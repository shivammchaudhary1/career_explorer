import User from '##/src/models/user.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import Survey from '##/src/models/survey.model.js';

async function getInterestProfiler(req, res) {
  const { userId } = req.params;
  const { attemptNumber } = req.query;

  try {
    // Fetch user and check if it exists
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let surveyData;
    if (attemptNumber) {
      surveyData = await Survey.findOne({
        userId,
        attemptNumber: parseInt(attemptNumber),
      }).lean();
    } else {
      surveyData = await Survey.findOne({ userId }).sort({ createdAt: -1 }).lean();
    }

    if (!surveyData) {
      return res.status(404).json({
        message: attemptNumber
          ? `Survey not found for attempt ${attemptNumber}`
          : 'No survey found for this user',
      });
    }

    const unifiedRecord = await UnifiedRecord.findOne({ userId }).lean();

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    let interestProfileDetails;

    if (attemptNumber) {
      // Find by specific attemptNumber in InterestProfile collection
      interestProfileDetails = await InterestProfile.findOne({
        userId,
        attemptNumber: parseInt(attemptNumber),
      }).lean();

      if (!interestProfileDetails) {
        return res
          .status(404)
          .json({ message: `Interest profile not found for attempt ${attemptNumber}` });
      }
    } else {
      // Get the latest InterestProfile from InterestProfile collection
      interestProfileDetails = await InterestProfile.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

      if (!interestProfileDetails) {
        return res.status(404).json({ message: 'No interest profile found for this user' });
      }
    }

    // Check if this assessment exists in unifiedRecord's interestProfile array
    const existsInUnified = unifiedRecord.interestProfile.some(
      (profile) => profile.assessmentId.toString() === interestProfileDetails._id.toString(),
    );

    if (!existsInUnified) {
      return res.status(404).json({ message: 'Profile not found in unified record' });
    }

    // Check payment status and respond accordingly
    if (unifiedRecord.combinedPayment.isPaid) {
      return res.status(200).json({
        interestProfileDetails,
        educationLevel: surveyData?.educationLevel || null,
      });
    } else {
      const randomCareers = getRandomCareers(interestProfileDetails.careers?.career || [], 3);
      return res.status(200).json({
        interestProfileDetails: {
          ...interestProfileDetails,
        },
        careers: { career: randomCareers },
        educationLevel: surveyData?.educationLevel || null,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Function to get random careers
function getRandomCareers(careers, num) {
  if (!careers || careers.length === 0) return [];
  const shuffled = careers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(num, shuffled.length));
}

export { getInterestProfiler };
