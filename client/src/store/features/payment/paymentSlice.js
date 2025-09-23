import { createSlice } from '@reduxjs/toolkit';
import { paymentApiSlice } from './paymentApiSlice';

const initialState = {
    paymentIntent: null,
    paymentSuccess: null,
    paymentCancle: null,
    isLoading: false,
    error: null,
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.paymentIntent = null;
            state.paymentSuccess = null;
            state.paymentCancle = null;
            state.isLoading = false;
            state.error = null;
        },
        setPaymentSuccess: (state, action) => {
            state.paymentSuccess = action.payload;
        },
        setPaymentCancel: (state, action) => {
            state.paymentCancle = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                paymentApiSlice.endpoints.createPaymentIntent.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                paymentApiSlice.endpoints.createPaymentIntent.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.paymentIntent = action.payload;
                }
            )
            .addMatcher(
                paymentApiSlice.endpoints.createPaymentIntent.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message;
                }
            );
    }
});

export const { 
    resetPaymentState, 
    setPaymentSuccess, 
    setPaymentCancel, 
    setLoading, 
    setError 
} = paymentSlice.actions;

export default paymentSlice.reducer;

export const selectPaymentIntent = (state) => state.payment.paymentIntent;
export const selectPaymentLoading = (state) => state.payment.isLoading;
export const selectPaymentError = (state) => state.payment.error;

