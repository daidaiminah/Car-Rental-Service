import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

console.log('Stripe packages imported successfully!');
console.log('loadStripe:', typeof loadStripe);
console.log('Elements:', typeof Elements);
