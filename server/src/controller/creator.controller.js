import { uploadToS3 } from '##/src/config/lib/S3.js';
import Video from '##/src/models/video.model.js';
import User from '##/src/models/user.model.js';
import { extractVideoId } from '##/src/utility/extractVideoId.js';
import Follower from '##/src/models/followers.model.js';
import UserDetails from '##/src/models/userDetails.model.js';
import userHistory from '##/src/models/userHistory.model.js';
import { countryList } from '##/src/utility/countryList.js';

async function monthlyCounsellorsReportData(req, res) {
  try {
    const { userId } = req.params;

    // Fetch all necessary data in parallel for better performance
    const [watchedHistories, users, videos, followers] = await Promise.all([
      userHistory.find({}),
      User.find({}),
      Video.find({ creatorId: userId }),
      Follower.find({ followingId: userId }),
    ]);

    // Check if any data exists at all
    const noDataAvailable =
      !watchedHistories?.length && !users?.length && !videos?.length && !followers?.length;
    if (noDataAvailable) {
      return res.status(404).json({
        success: false,
        message: 'No analytics data available at this time',
      });
    }

    // Initialize all report data structures
    const reportData = {
      userData: [],
      demographicsData: [
        { name: '16-18', male: 0, female: 0 },
        { name: '19-21', male: 0, female: 0 },
        { name: '22-24', male: 0, female: 0 },
        { name: '25-27', male: 0, female: 0 },
        { name: '28-30', male: 0, female: 0 },
        { name: '30+', male: 0, female: 0 },
      ],
      monthlyData: [
        { name: 'Jan', likes: 0, followers: 0 },
        { name: 'Feb', likes: 0, followers: 0 },
        { name: 'Mar', likes: 0, followers: 0 },
        { name: 'Apr', likes: 0, followers: 0 },
        { name: 'May', likes: 0, followers: 0 },
        { name: 'Jun', likes: 0, followers: 0 },
        { name: 'Jul', likes: 0, followers: 0 },
        { name: 'Aug', likes: 0, followers: 0 },
        { name: 'Sep', likes: 0, followers: 0 },
        { name: 'Oct', likes: 0, followers: 0 },
        { name: 'Nov', likes: 0, followers: 0 },
        { name: 'Dec', likes: 0, followers: 0 },
      ],
    };

    // Process country-wise user data if watched histories exist
    // if (watchedHistories?.length) {
    //   let countryCount = {};

    //   for (let history of watchedHistories) {
    //     if (!history.watchedVideos?.length) continue;

    //     for (let videoEntry of history.watchedVideos) {
    //       let videoId = videoEntry.videoId?.$oid || videoEntry.videoId;
    //       if (!videoId) continue;

    //       let video = await Video.findById(videoId);
    //       if (!video || video.creatorId.toString() !== userId) continue;

    //       let user = await User.findById(history.userId);
    //       if (user?.nationality) {
    //         countryCount[user.nationality] = (countryCount[user.nationality] || 0) + 1;
    //       }
    //     }
    //   }

    //   reportData.userData = Object.entries(countryCount).map(([country, users]) => ({
    //     country,
    //     users,
    //   }));
    // }

    if (watchedHistories?.length) {
      let countryCount = {};

      // Create a map for quick lookup of country by dial code
      const countryByDialCode = {};
      countryList.forEach((country) => {
        countryByDialCode[country.dial_code] = country.code;
      });

      for (let history of watchedHistories) {
        if (!history.watchedVideos?.length) continue;

        for (let videoEntry of history.watchedVideos) {
          let videoId = videoEntry.videoId?.$oid || videoEntry.videoId;
          if (!videoId) continue;

          let video = await Video.findById(videoId);
          if (!video || video.creatorId.toString() !== userId) continue;

          let user = await User.findById(history.userId);
          if (!user) continue;

          // Determine country code - priority to nationality, then mobile dial code
          let countryCode = '';

          // Check if nationality is set and exists in our country list
          if (user.nationality) {
            const country = countryList.find((c) => c.name === user.nationality);
            if (country) {
              countryCode = country.code;
            }
          }

          // If nationality not found, try to get from mobile number
          if (!countryCode && user.mobile) {
            // Extract dial code from mobile (e.g., "+91 9935169128" -> "+91")
            const dialCode = user.mobile.split(' ')[0];
            countryCode = countryByDialCode[dialCode];
          }

          if (countryCode) {
            countryCount[countryCode] = (countryCount[countryCode] || 0) + 1;
          }
        }
      }

      // Convert countryCount to array with full country info
      reportData.userData = Object.entries(countryCount).map(([code, count]) => {
        const country = countryList.find((c) => c.code === code);
        return {
          // countryCode: code,
          country: country?.name || code,
          users: count,
          // flagEmoji: country?.emoji || '',
          // flagImage: country?.image || '',
        };
      });
    }

    // Process demographics data if users exist
    if (users?.length) {
      const currentYear = new Date().getFullYear();

      for (let user of users) {
        if (!user.dateOfBirth || !user.gender) continue;

        const birthYear = new Date(user.dateOfBirth.$date || user.dateOfBirth).getFullYear();
        const age = currentYear - birthYear;
        const gender = user.gender.toLowerCase();

        let ageGroupIndex;
        if (age >= 16 && age <= 18) ageGroupIndex = 0;
        else if (age >= 19 && age <= 21) ageGroupIndex = 1;
        else if (age >= 22 && age <= 24) ageGroupIndex = 2;
        else if (age >= 25 && age <= 27) ageGroupIndex = 3;
        else if (age >= 28 && age <= 30) ageGroupIndex = 4;
        else if (age > 30) ageGroupIndex = 5;

        if (ageGroupIndex !== undefined && (gender === 'male' || gender === 'female')) {
          reportData.demographicsData[ageGroupIndex][gender]++;
        }
      }
    }

    // Process monthly analytics if videos or followers exist
    if (videos?.length) {
      for (let video of videos) {
        const createdAt = new Date(video.createdAt.$date || video.createdAt);
        const monthIndex = createdAt.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          reportData.monthlyData[monthIndex].likes += video.totalLikes || 0;
        }
      }
    }

    if (followers?.length) {
      for (let follower of followers) {
        const createdAt = new Date(follower.createdAt);
        const monthIndex = createdAt.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          reportData.monthlyData[monthIndex].followers += 1;
        }
      }
    }

    // Check if all data arrays are empty
    const allDataEmpty =
      reportData.userData.length === 0 &&
      reportData.demographicsData.every((group) => group.male === 0 && group.female === 0) &&
      reportData.monthlyData.every((month) => month.likes === 0 && month.followers === 0);

    if (allDataEmpty) {
      return res.status(404).json({
        success: false,
        message: 'Analytics data is available but all values are currently zero',
      });
    }

    // Successful response with all data
    res.status(200).json({
      ...reportData,
      success: true,
      message: 'Monthly counsellor report data fetched successfully',
    });
  } catch (error) {
    console.error('Error in monthlyCounsellorsReportData:', error);
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
}

async function uploadVideo(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fileLink, ok } = await uploadToS3(req, 'videos');
    if (!ok) {
      return res.status(400).json({ message: 'No file upload', ok: false });
    }

    const video = new Video({
      creatorId: userId,
      videoLink: fileLink,
    });
    await video.save();

    return res.status(201).json({
      message: 'Video uploaded successfully',
      data: { link: fileLink, creatorId: userId, video },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function uploadThumbnail(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { fileLink, ok } = await uploadToS3(req, 'thumbnails');

    if (!ok) {
      return res.status(400).json({ message: 'No file upload', ok: false });
    }
    return res.status(200).json({ message: 'Thumbnail uploaded successfully', link: fileLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function uploadYoutubeVideoURL(req, res) {
  try {
    const { userId } = req.params;
    const { title, description, language, category, tags, youtubeLink } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const videoId = extractVideoId(youtubeLink);

    const saveVideo = new Video({
      creatorId: userId,
      title,
      description,
      language,
      category,
      tags,
      youtubeLink: true,
      videoLink: youtubeLink,
      youtubeVideoId: videoId,
    });

    await saveVideo.save();

    return res.status(201).json({ message: 'Video uploaded successfully', video: saveVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// Get Author videos for CRUD by Original AUthor

async function getAllAuthorVideos(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Videos per page
    const searchQuery = req.query.search || '';

    if (!userId) {
      return res.status(400).json({ message: 'Creator id is required' });
    }

    // Calculate the number of videos to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch videos and total count concurrently for better performance
    const [videos, totalVideos] = await Promise.all([
      Video.find({
        creatorId: userId,
        title: searchRegex, // Assuming the title field is used for searching
      })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'firstName lastName') // Include creator details
        .lean(), // Use lean to get plain JavaScript objects
      Video.countDocuments({
        creatorId: userId,
        title: searchRegex, // Counting with the same search criteria
      }),
    ]);

    if (videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this author' });
    }

    return res.status(200).json({
      message: 'My Content retrieved successfully.',
      success: true,
      videos,
      totalVideos,
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve author videos. Please try again later. Error: ${error.message}`,
    });
  }
}

async function updateVideo(req, res) {
  try {
    const { userId, videoId } = req.params;
    const { title, description, language, category, tags, thumbnail } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'UserId and videoId are required' });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (language) updateFields.language = language;
    if (category) updateFields.category = category;
    if (tags) updateFields.tags = tags;
    if (thumbnail) updateFields.thumbnail = thumbnail;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function deleteVideo(req, res) {
  try {
    const { userId, videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.creatorId.toString() !== userId) {
      return res.status(404).json({ message: 'Unauthorized access' });
    }

    // Remove videoId from all userHistory documents
    await userHistory.updateMany(
      {},
      {
        $pull: {
          watchedVideos: { videoId },
          likedVideos: { videoId },
          sharedVideos: { videoId },
        },
      },
    );

    // Remove videoId from all playlists
    const Playlist = (await import('##/src/models/playlist.model.js')).default;
    await Playlist.updateMany({}, { $pull: { videoId } });

    // Delete all likes for this video
    const Like = (await import('##/src/models/like.model.js')).default;
    await Like.deleteMany({ videoId });

    // Delete all ratings for this video
    const Rating = (await import('##/src/models/rating.model.js')).default;
    await Rating.deleteMany({ videoId });

    // Now delete the video itself
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getCreatorProfile(req, res) {
  const { userId } = req.params;

  try {
    // Run both queries in parallel for better performance
    const [user, followerCount, userDetails] = await Promise.all([
      User.findById(userId).select(
        '-password -updatedAt -role -createdAt -unique_id -isEmailVerified',
      ), // Fetch user details excluding the password
      Follower.countDocuments({ followingId: userId }), // Count followers
      UserDetails.findOne({ userId }).select('socialMediaLinks').lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const socialMediaLinks = userDetails ? userDetails.socialMediaLinks : [];

    // Send user details along with the follower count
    return res.status(200).json({
      user,
      followerCount,
      socialMediaLinks,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

async function videoDetailById(req, res) {
  try {
    const { videoId } = req.params;
    const videoDetails = await Video.findById(videoId);

    if (!videoDetails) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { creatorId } = videoDetails;

    const creatorDetails = await User.findById(creatorId).select(
      'firstName lastName profilePicture',
    );

    if (!creatorDetails) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    return res.status(200).json({
      message: 'Video details fetched successfully',
      videoDetails,
      creatorDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getGeneralVideoData(req, res) {
  try {
    const { userId } = req.params;

    // Fetch videos created by the user
    const videos = await Video.find({ creatorId: userId });

    if (!videos || videos.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: 'No video records available at the moment.' });
    }

    // Initialize counters for aggregation
    let totalLikes = 0;
    let totalComments = 0;
    let totalRatings = 0;
    let totalRatingPoints = 0;
    let totalVideos = videos.length;
    let totalShares = 0;
    let totalViews = 0;

    // Iterate through each video to calculate likes, comments, ratings, and average ratings
    for (const video of videos) {
      totalLikes += video.totalLikes;
      totalComments += video.totalComments;
      totalRatings += video.totalRatings;
      totalRatingPoints += video.averageRating * video.totalRatings; // Multiply average by total ratings to get total rating points
      totalShares += video.totalShares;
      totalViews += video.totalViews;

      // Calculate the video's average rating
      let averageRating = 0;
      if (video.totalRatings > 0) {
        averageRating = totalRatingPoints / totalRatings;
      }
      // Update the video's average rating (optional, if you want to save this to the database)
      video.averageRating = averageRating;
      // await video.save();
    }

    // Calculate total number of videos by the user
    const totalVideoCount = await Video.countDocuments({ creatorId: userId });

    // Calculate the overall average rating
    let overallAverageRating = 0;
    if (totalRatings > 0) {
      overallAverageRating = totalRatingPoints / totalRatings;
    }

    // Return aggregated data
    return res.status(200).json({
      message: 'General video data fetched successfully',
      success: true,
      data: {
        totalLikes,
        totalComments,
        totalRatings,
        overallAverageRating,
        totalVideos: totalVideoCount,
        totalShares,
        totalViews,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}

// async function getUserAnalytics(req, res) {
//   try {
//     const { userId } = req.params; // You may need this to fetch user-specific data if required

//     // Fetch users grouped by nationality
//     const userStats = await User.aggregate([
//       { $group: { _id: '$nationality', count: { $sum: 1 } } },
//       { $project: { country: '$_id', users: '$count', _id: 0 } },
//     ]);

//     // Prepare the response
//     const response = userStats.map((item) => ({
//       country: item.country,
//       users: item.users,
//     }));

//     // Respond with the aggregated data
//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching analytics data' });
//   }
// }

export {
  uploadVideo,
  uploadThumbnail,
  updateVideo,
  uploadYoutubeVideoURL,
  getAllAuthorVideos,
  deleteVideo,
  getCreatorProfile,
  videoDetailById,
  getGeneralVideoData,
  monthlyCounsellorsReportData,
};
