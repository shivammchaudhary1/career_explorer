import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    watchedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        },
        myNotes: {
          type: String,
          default: '',
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sharedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Keeps timestamps for the main userHistory document
    versionKey: false, // Disables the __v field
  },
);

// Indexes
userHistorySchema.index({ userId: 1 });
userHistorySchema.index({ 'watchedVideos.videoId': 1 });
userHistorySchema.index({ 'likedVideos.videoId': 1 });

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

export default UserHistory;
