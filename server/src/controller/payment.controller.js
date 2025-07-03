import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import Payment from '##/src/models/payment.model.js';
import config from '##/src/config/config.js';
import Stripe from 'stripe';
const stripe = new Stripe(config.stripe.Secret_Key);
import User from '##/src/models/user.model.js';

const initiatePayment = async (req, res) => {
  try {
    const { userId, couponCode } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Validate the coupon code with Stripe
    let discount;
    if (couponCode) {
      try {
        const coupon = await stripe.coupons.retrieve(couponCode);
        if (coupon.valid) {
          discount = coupon.id;
        }
      } catch (error) {
        return res.status(406).send({ message: 'Invalid coupon code' });
      }
    }

    // Define product details
    const product = {
      name: 'Career Direction Report',
      amount: 4900, // $49.00 in cents
      currency: 'usd',
    };

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      discounts: discount ? [{ coupon: discount }] : undefined,
      success_url: `${config.host}/payment-successful`,
      cancel_url: `${config.host}/payment-cancelled`,
      metadata: { userId },
    });

    const PaymentRecord = new Payment({
      userId,
      assessmentName: product.name,
      transactionID: session.id,
      paymentStatus: 'pending',
      currency: session.currency,
      amount: session.amount_total / 100,
    });
    await PaymentRecord.save();

    res.send({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user and payment record in parallel
    const [user, paymentRecord, unifiedRecord] = await Promise.all([
      User.findById(userId),
      Payment.findOne({ userId }).sort({ createdAt: -1 }),
      UnifiedRecord.findOne({ userId }),
    ]);

    if (!user) return res.status(404).send({ error: 'User not found' });
    if (!paymentRecord) return res.status(404).send({ error: 'Payment not found' });

    // Check if the payment record is already verified
    if (paymentRecord.isVerified) {
      return res.status(400).send({ success: false, message: 'Payment already verified' });
    }

    const sessionId = paymentRecord.transactionID;

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Update payment status if successful
    if (session.payment_status === 'paid') {
      if (paymentRecord.paymentStatus !== 'paid') {
        paymentRecord.paymentStatus = 'paid';
        paymentRecord.isVerified = true;
        await paymentRecord.save();
      }
      if (unifiedRecord.combinedPayment.isPaid === true) {
        unifiedRecord.combinedPayment.remainingAttempts += 3;
      }
      // Update unified record's combinedPayment.isPaid to true
      if (unifiedRecord && unifiedRecord.combinedPayment) {
        unifiedRecord.combinedPayment.isPaid = true;
        await unifiedRecord.save();
      }

      return res.send({ message: 'Payment successful', session, paymentRecord });
    }

    res.status(400).send({ error: 'Payment not completed yet' });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).send({ error: 'Internal server error', message: error.message });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user, payment record, and unified record concurrently
    const [user, paymentRecord, unifiedRecord] = await Promise.all([
      User.findById(userId),
      Payment.findOne({ userId }),
      UnifiedRecord.findOne({ userId }),
    ]);

    // Check if user exists
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });

    // Check if payment record exists
    if (!paymentRecord)
      return res.status(404).send({ success: false, message: 'Payment record not found' });

    // Check if unified record exists
    if (!unifiedRecord)
      return res.status(404).send({ success: false, message: 'Unified record not found' });

    // Initialize variables for payment status and remaining attempts
    let isPaid = unifiedRecord.combinedPayment.isPaid;
    let remainingAttempts = unifiedRecord.combinedPayment.remainingAttempts;

    // Respond with payment status and remaining attempts
    return res.send({
      success: true,
      message: 'Payment status fetched successfully',
      isPaid,
      remainingAttempts,
    });
  } catch (error) {
    // Catch any unexpected errors and send a server error message
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: 'Internal server error', error: error.message });
  }
};

export { initiatePayment, verifyPayment, checkPaymentStatus };
