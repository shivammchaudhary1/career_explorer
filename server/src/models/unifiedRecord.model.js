import mongoose from 'mongoose';

const unifiedRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserDetail',
    },
    combinedPayment: {
      isPaid: {
        type: Boolean,
        default: false,
      },
      remainingAttempts: {
        type: Number,
        default: 3, // Initial attempts
      },
      lastPaymentDate: {
        type: Date, // To track the last payment date
      },
    },
    interestProfile: {
      type: [
        {
          assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InterestProfile',
          },
          timestamp: {
            type: Date,
          },
          isTaken: {
            type: Boolean,
          },
          cdrLink: {
            type: String,
          },
        },
      ],
      default: [], // Initialize as an empty array
    },
    discProfile: {
      type: [
        {
          assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DiscProfile',
          },
          timestamp: {
            type: Date,
          },
          isTaken: {
            type: Boolean,
          },
        },
      ],
      default: [], // Initialize as an empty array
    },
    survey: {
      type: [
        {
          surveyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Survey',
          },
          timestamp: {
            type: Date,
          },
          isTaken: {
            type: Boolean,
          },
        },
      ],
      default: [], // Initialize as an empty array
    },
    resume: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
      },
    },
    cdrLinks: {
      type: [
        {
          attemptNumber: { type: Number },
          link: { type: String }, // Resume link
          status: { type: Boolean, default: false },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [], // Initialize as an empty array
    },
    unique_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
unifiedRecordSchema.index({ userId: 1 }); // Index on userId for fast lookups

const UnifiedRecord = mongoose.model('UnifiedRecord', unifiedRecordSchema);

export default UnifiedRecord;
