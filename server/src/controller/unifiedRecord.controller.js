import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import User from '##/src/models/user.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import DiscProfile from '##/src/models/disc.model.js';
import Survey from '##/src/models/survey.model.js';
import Resume from '##/src/models/resume.model.js';
import mongoose from 'mongoose';
import { uploadToS3 } from '##/src/config/lib/S3.js';

async function getUnifiedRecordData(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const unifiedRecordData = await UnifiedRecord.findOne({ userId }).lean();

    if (!unifiedRecordData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    res.status(200).json({ unifiedRecordData });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// admin routes

async function getAllUnifiedRecordData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || '';

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // First, find matching users based on the search query and role "user"
    const matchingUsers = await User.find({
      role: 'user', // Filter for users with the role "user"
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
    }).select('_id'); // We only need the user IDs

    const userIds = matchingUsers.map((user) => new mongoose.Types.ObjectId(user._id));

    // Now, fetch unified records that match the user IDs
    const [unifiedRecordData, totalRecords] = await Promise.all([
      UnifiedRecord.find({
        userId: { $in: userIds },
      })
        .populate({
          path: 'userId',
          select: 'firstName lastName email', // Select the fields you need
        })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .lean(),
      UnifiedRecord.countDocuments({
        userId: { $in: userIds },
      }),
    ]);

    return res.status(200).json({
      message: 'Unified records fetched successfully',
      unifiedRecordData,
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function getUnifiedRecordDataOfUser(req, res) {
  const { unifiedId } = req.params;

  try {
    // Find the unified record and populate interestProfile, discProfile, and survey
    const unifiedRecord = await UnifiedRecord.findById(unifiedId)
      .populate({
        path: 'interestProfile.assessmentId',
        model: 'InterestProfile', // Adjust model name if different
      })
      .populate({
        path: 'discProfile.assessmentId',
        model: 'DiscProfile', // Adjust model name if different
      })
      .populate({
        path: 'survey.surveyId',
        model: 'Survey', // Adjust model name if different
      })
      .lean();

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    const { userId } = unifiedRecord;

    // Fetch related data concurrently
    const [user, resume] = await Promise.all([
      User.findById(userId).lean(),
      Resume.findOne({ userId }).lean(),
    ]);

    // Combine results into a single response object
    const response = {
      unifiedRecord,
      user,
      resume,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function updateResumeStatus(req, res) {
  const { userId } = req.params;
  try {
    const unifiedData = await UnifiedRecord.findOne({ userId });
    if (!unifiedData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    unifiedData.resume.isCompleted = true;
    await unifiedData.save();
    return res.status(200).json({ message: 'Resume status updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function saveCdrToStorgae(req, res) {
  try {
    const { userId, attemptNumber } = req.params;
    const parsedAttemptNumber = Number(attemptNumber);

    // Find the unified data
    const unifiedData = await UnifiedRecord.findOne({ userId });
    if (!unifiedData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    // Find the interest profile
    const interestProfile = await InterestProfile.findOne({
      userId,
      attemptNumber: parsedAttemptNumber,
    });
    if (!interestProfile) {
      return res.status(404).json({ message: 'Interest profile not found for this attempt' });
    }

    const interestProfileId = interestProfile._id;

    // Check if CDR already exists in interestProfile
    const existingInterestProfileEntry = unifiedData.interestProfile.find(
      (entry) => entry.assessmentId.toString() === interestProfileId.toString(),
    );

    console.log('existingInterestProfileEntry', existingInterestProfileEntry);

    if (existingInterestProfileEntry?.cdrLink) {
      return res.status(400).json({
        message: 'CDR link already exists for this interest profile',
        existingLink: existingInterestProfileEntry.cdrLink,
      });
    }

    // Check if CDR already exists in cdrLinks array
    const existingCdrLink = unifiedData.cdrLinks.find(
      (entry) => entry.attemptNumber === parsedAttemptNumber,
    );

    if (existingCdrLink) {
      return res.status(400).json({
        message: 'CDR already saved for this attempt number',
        existingLink: existingCdrLink.link,
      });
    }

    // Upload the file to S3
    const { fileLink, ok } = await uploadToS3(req, 'cdrs');
    if (!ok) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    // Update interestProfile with CDR link
    unifiedData.interestProfile = unifiedData.interestProfile.map((entry) => {
      if (entry.assessmentId.toString() === interestProfileId.toString()) {
        return {
          ...entry.toObject(),
          cdrLink: fileLink,
        };
      }
      return entry;
    });

    // Add to cdrLinks array
    unifiedData.cdrLinks.push({
      link: fileLink,
      status: true,
      timestamp: new Date(),
      attemptNumber: parsedAttemptNumber,
    });

    // Save all changes
    await unifiedData.save();

    return res.status(200).json({
      success: true,
      message: 'CDR uploaded and linked successfully',
      cdrLink: fileLink,
      attemptNumber: parsedAttemptNumber,
    });
  } catch (error) {
    console.error('Error in saveCdrToStorage:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

export {
  getUnifiedRecordData,
  getAllUnifiedRecordData,
  getUnifiedRecordDataOfUser,
  updateResumeStatus,
  saveCdrToStorgae,
};
