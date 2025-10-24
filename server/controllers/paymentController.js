import { processPayment, verifyMomoPayment } from '../services/paymentService.js';
import db from '../models/index.js';
import Stripe from 'stripe';
import { emitToUser } from '../socket/index.js';

const Payment = db.Payment;
const Rental = db.Rental;
const Car = db.Car;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Process a new payment
 */
export const createPayment = async (req, res) => {
  try {
    const { rentalId, paymentMethod, paymentData } = req.body;
    const userId = req.user.id;

    // Get rental details
    const rental = await Rental.findByPk(rentalId);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    // Prepare payment data
    const paymentInfo = {
      ...paymentData,
      rentalId,
      userId,
      amount: rental.totalCost,
      currency: 'USD', // or get from rental/request
      description: `Payment for rental #${rentalId}`,
    };

    // Process payment
    const paymentResult = await processPayment(paymentInfo, paymentMethod);

    // Save payment record
    const payment = await Payment.create({
      rentalId,
      userId,
      amount: rental.totalCost,
      currency: 'USD',
      paymentMethod,
      paymentStatus: paymentResult.status || 'pending',
      paymentReference: paymentResult.paymentId,
      paymentDate: new Date(),
    });

    // Update rental status if payment is successful
    if (paymentResult.success) {
      await rental.update({ status: 'confirmed' });
    }

    emitToUser(userId, 'payment:updated', {
      action: 'created',
      paymentId: payment.id,
      status: payment.paymentStatus,
    });

    res.status(200).json({
      success: true,
      payment,
      paymentResult: {
        requiresAction: paymentResult.requiresAction,
        clientSecret: paymentResult.clientSecret,
        // Add other relevant payment result data
      },
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed',
    });
  }
};

/**
 * Verify MoMo payment status
 */
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod } = req.params;
    
    if (paymentMethod.toLowerCase() === 'momo') {
      const verification = await verifyMomoPayment(paymentId);
      
      // Update payment status in database
      await Payment.update(
        { paymentStatus: verification.status },
        { where: { paymentReference: paymentId } }
      );
      
      return res.status(200).json(verification);
    }
    
    // For Stripe, you would handle webhooks instead
    res.status(400).json({ error: 'Verification method not supported' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message || 'Payment verification failed' });
  }
};

/**
 * Handle Stripe webhook events
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

// Helper function to handle successful payments
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const payment = await Payment.findOne({
      where: { paymentReference: paymentIntent.id }
    });

    if (payment) {
      await payment.update({
        paymentStatus: 'completed',
        paymentDate: new Date(),
      });

      // Update rental status
      await Rental.update(
        { status: 'confirmed' },
        { where: { id: payment.rentalId } }
      );
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Helper function to handle failed payments
const handleFailedPayment = async (paymentIntent) => {
  try {
    await Payment.update(
      { paymentStatus: 'failed' },
      { where: { paymentReference: paymentIntent.id } }
    );
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

/**
 * Create a Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { 
      rentalId,
      carId,
      startDate, 
      endDate,
      pickupAddress,
      totalAmount,
      userId,
      userEmail,
      userName
    } = req.body;

    // Get car details
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Get the existing rental record
    const rental = await Rental.findByPk(rentalId);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${car.make} ${car.model} Rental`,
              description: `Rental from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
              images: car.imageUrl ? [car.imageUrl] : []
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL  || 'http://localhost:5000'}/booking-success?session_id={CHECKOUT_SESSION_ID}&rental_id=${rental.id}`,
      cancel_url: `${process.env.CLIENT_URL  || 'http://localhost:5000'}/booking-cancel`,
      customer_email: userEmail,
      client_reference_id: rental.id.toString(),
      metadata: {
        rentalId: rental.id,
        carId: car.id,
        userId: userId,
        userName: userName || 'Customer',
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalAmount: totalAmount.toString()
      },
      payment_intent_data: {
        metadata: {
          rentalId: rental.id,
          carId: car.id,
          userId: userId
        }
      }
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
    }
  };

export const getUserPaymentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.findAll({
      where: { userId },
      include: [
        {
          model: Rental,
          as: 'rental',
          attributes: [
            'id',
            'startDate',
            'endDate',
            'status',
            'totalDays',
            'totalCost',
          ],
          include: [
            {
              model: Car,
              as: 'car',
              attributes: [
                'id',
                'make',
                'model',
                'year',
                'rentalPricePerDay',
                'imageUrl',
              ],
            },
          ],
        },
      ],
      order: [['paymentDate', 'DESC']],
    });

    const transactions = payments.map((payment) => {
      const rental = payment.rental;
      const car = rental?.car;
      const description = car
        ? `${car.make || ''} ${car.model || ''} ${car.year || ''}`.trim()
        : 'Rental payment';

      return {
        id: payment.paymentReference || payment.id,
        paymentId: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        status: payment.paymentStatus,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        description: rental
          ? `${description} - ${rental.totalDays || 0} day(s)`
          : description,
        rental: rental
          ? {
              id: rental.id,
              startDate: rental.startDate,
              endDate: rental.endDate,
              status: rental.status,
              totalDays: rental.totalDays,
              totalCost: Number(rental.totalCost || payment.amount),
            }
          : null,
        car: car
          ? {
              id: car.id,
              make: car.make,
              model: car.model,
              year: car.year,
              imageUrl: car.imageUrl,
              dailyRate: Number(car.rentalPricePerDay || 0),
            }
          : null,
        receiptUrl:
          payment.gateway === 'stripe'
            ? `https://dashboard.stripe.com/payments/${payment.paymentReference || payment.id}`
            : null,
      };
    });

    const methodsMap = new Map();
    payments.forEach((payment) => {
      const method = payment.paymentMethod || 'unknown';
      if (!methodsMap.has(method)) {
        const referenceDigits = (payment.paymentReference || '')
          .replace(/\D/g, '')
          .slice(-4);

        methodsMap.set(method, {
          id: `${method}-${payment.id}`,
          type: method,
          last4: referenceDigits || 'N/A',
          isDefault: methodsMap.size === 0,
          usageCount: 1,
        });
      } else {
        const existing = methodsMap.get(method);
        methodsMap.set(method, {
          ...existing,
          usageCount: existing.usageCount + 1,
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        transactions,
        paymentMethods: Array.from(methodsMap.values()),
      },
    });
  } catch (error) {
    console.error('Error loading payment summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load payments',
      error: error.message,
    });
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

/**
 * Handle successful checkout session completion
 */
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const rental = await Rental.findByPk(session.client_reference_id);
    if (!rental) {
      console.error('Rental not found for session:', session.id);
      return;
    }

    // If the payment was successful, update the rental status
    if (session.payment_status === 'paid') {
      await rental.update({ 
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentDate: new Date(),
        paymentMethod: 'stripe',
        paymentReference: session.payment_intent,
        updatedAt: new Date()
      });

      // Create payment record
      const recordedPayment = await Payment.create({
        rentalId: rental.id,
        userId: rental.userId,
        amount: session.amount_total / 100, // Convert back to dollars
        currency: session.currency,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        paymentReference: session.payment_intent,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // TODO: Send confirmation email to the customer
      console.log(`Payment successful for rental ${rental.id}`);

      emitToUser(rental.userId, 'payment:updated', {
        action: 'confirmed',
        paymentId: recordedPayment.id,
        status: recordedPayment.paymentStatus,
      });
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    // TODO: Implement proper error handling and retry logic
  }
};

/**
 * Handle successful payment intent
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const rental = await Rental.findOne({
      where: { paymentReference: paymentIntent.id }
    });

      if (rental && rental.status !== 'confirmed') {
        await rental.update({
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentDate: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`Updated rental ${rental.id} status to confirmed`);
        emitToUser(rental.userId, 'payment:updated', {
          action: 'intent_succeeded',
          rentalId: rental.id,
          status: 'paid',
        });
      }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
  }
};

/**
 * Handle failed payment intent
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const rental = await Rental.findOne({
      where: { paymentReference: paymentIntent.id }
    });

      if (rental) {
        await rental.update({
          status: 'payment_failed',
          paymentStatus: 'failed',
          updatedAt: new Date()
        });
        
        console.log(`Updated rental ${rental.id} status to payment_failed`);
        emitToUser(rental.userId, 'payment:updated', {
          action: 'intent_failed',
          rentalId: rental.id,
          status: 'failed',
        });
      }
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
  }
};

export default {
  createPayment,
  verifyPayment,
  stripeWebhook,
  handleSuccessfulPayment,
  createCheckoutSession,
  handleStripeWebhook,
  getUserPaymentSummary
};
