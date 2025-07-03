import config from '##/src/config/config.js';
import { comparePassword, encryptPassword } from '##/src/config/lib/bcrypt.js';
import { jwtVerify, signJwt } from '##/src/config/lib/jwt.js';
import { sendEmail } from '##/src/config/lib/nodemailer.js';
import User from '##/src/models/user.model.js';
import UserDetails from '##/src/models/userDetails.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import UserHistory from '##/src/models/userHistory.model.js';
import Playlist from '##/src/models/playlist.model.js';
import Resume from '##/src/models/resume.model.js';
import { checkPassStrength, isValidEmail } from '##/utility/validate.js';
import UniqueIDCounter from '##/src/models/uniqueIdCounter.model.js';
import ReportData from '##/src/models/reportData.model.js';
import { v4 as uuidv4 } from 'uuid';
import {
  generateStudentSignupTemplates,
  generateCounsellorSignupTemplates,
  generateForgotPasswordTemplate,
} from '##/src/utility/emailTemplates.js';

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, role, gender } = req.body;

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide a valid email address', field: 'email' });
    }

    if (!checkPassStrength(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least one uppercase letter, one number, and be minimum 6 characters',
        field: 'password',
      });
    }

    // Check if user exists
    const isUserExist = await User.findOne({ email }).lean();
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: 'User already exists, please login',
        user: email,
        field: 'email',
      });
    }

    const hashedPassword = await encryptPassword(password);

    let status = role === 'creator' ? 'pending' : 'active';

    // Generate unique_id only for non-creators (users)
    let unique_id = '';
    if (role !== 'creator') {
      // Get the current year and month in YYYYMM format
      const currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
      const MAX_RETRIES = 5;
      let retryCount = 0;
      while (retryCount < MAX_RETRIES) {
        try {
          const counter = await UniqueIDCounter.findOneAndUpdate(
            { yearMonth: currentYearMonth },
            { $inc: { sequenceNumber: 1 } },
            { new: true, upsert: true }, // Create if it doesn't exist
          );

          const sequentialNumber = counter.sequenceNumber;
          unique_id = `${currentYearMonth}${sequentialNumber.toString().padStart(4, '0')}`;

          break; // Break out of the loop on success
        } catch (error) {
          retryCount++;
          if (retryCount === MAX_RETRIES) {
            return res.status(500).json({
              message: 'Failed to generate unique ID',
              error: error.message,
            });
          }
        }
      }
    } else {
      unique_id = uuidv4();
    }

    // Create user document
    const user = new User({
      ...req.body,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      status,
      activeDashboard: role,
      mobile,
      gender,
      unique_id: role !== 'creator' ? unique_id : uuidv4(),
    });

    // Save user
    await user.save();

    // Create userDetails for both users and creators
    const userDetails = new UserDetails({
      userId: user._id,
    });

    await userDetails.save();

    // Skip creation of other records for creators
    if (role !== 'creator') {
      const newResume = new Resume({
        userId: user._id,
        personalInfo: {
          firstName,
          lastName,
          email,
          mobile,
          gender,
        },
      });

      const newUnifiedRecord = new UnifiedRecord({
        userId: user._id,
        unique_id,
        userDetailsId: userDetails._id,
        // interestProfile: { isTaken: false },
        // discProfile: { isTaken: false },
        // survey: { isTaken: false },
        resume: { isCompleted: false, resumeId: newResume._id },
      });

      const newReportData = new ReportData({
        userId: user._id,
      });

      const newPlaylist = new Playlist({ userId: user._id });
      const userHistory = new UserHistory({ userId: user._id });

      // Save unifiedRecord and playlist for non-creators
      await Promise.all([
        newResume.save(),
        newUnifiedRecord.save(),
        newPlaylist.save(),
        userHistory.save(),
        newReportData.save(),
      ]);
    }

    // Generate token and send email
    const token = signJwt({ email: user.email, id: user._id }, '7d', 'access');
    const verificationLink = `${config.domain.app}/verify-email?token=${token}`;

    const studentHtml = generateStudentSignupTemplates(verificationLink);
    const counsellorHtml = generateCounsellorSignupTemplates(verificationLink);

    let html = role === 'creator' ? counsellorHtml : studentHtml;

    await sendEmail(email, 'Email Verification', html);

    return res
      .status(201)
      .json({ success: true, message: 'User Registration Successful', user: { email } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'User Registration Failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        field: !email ? 'email' : 'password',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
        field: 'email',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'This email is not registered with us.',
        field: 'email',
      });
    }

    // Check password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password. Please try again.',
        field: 'password',
      });
    }

    // Generate token
    const token = signJwt({ userId: user._id, role: user.role }, '7d', 'access');

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again later.',
      error: error.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
        field: 'email',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
        field: 'email',
      });
    }

    // Find user
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'This email is not registered with us.',
        field: 'email',
      });
    }

    const token = signJwt({ email: user.email, id: user._id }, '20m', 'access');
    const link = `${config.domain.app}/create-new-password?user=${user._id}&token=${token}`;

    const html = generateForgotPasswordTemplate(link);
    await sendEmail(email, 'Reset Password', html);

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: error.message,
    });
  }
};

const verifyEmailLinkAndUpdate = async (req, res) => {
  try {
    const { userId, token } = req.query;
    const { password, confirmPassword } = req.body;

    const user = await User.findById(userId);

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm password fields cannot be empty.',
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password should match.' });
    }

    if (!checkPassStrength(password)) {
      return res.status(400).json({
        message:
          'Password should be have one uppercase letter, one number, and minimum 6 characters',
      });
    }

    const isVerified = jwtVerify(token, 'access');

    if (!isVerified) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Encrypt the new password
    const newPassword = await encryptPassword(password);

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully', ok: true });
  } catch (error) {
    return res.status(500).json({ message: `Failed to reset password: ${error.message}` });
  }
};

// new

const verifyEmailAndUpdateStatus = async (req, res) => {
  try {
    const { token } = req.query;
    const { email, id } = jwtVerify(token, 'access');

    if (!email || !id) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email verification status to true
    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to verify email', error: error.message });
  }
};

export { signup, login, forgetPassword, verifyEmailLinkAndUpdate, verifyEmailAndUpdateStatus };
