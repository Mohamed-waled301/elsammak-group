// import { apiClient } from './client';

export const submitTrainingBooking = async (bookingData: any) => {
 // Real implementation: return apiClient.post('/training/book', bookingData);
 console.log('Stub: Submitting training booking', bookingData);
 return new Promise((resolve) => 
 setTimeout(() => resolve({ success: true, message: 'Training booked successfully!' }), 1500)
 );
};
