// import { apiClient } from './client';

export const submitBooking = async (bookingData: any) => {
 // Real implementation: return apiClient.post('/booking', bookingData);
 console.log('Stub: Submitting booking', bookingData);
 return new Promise((resolve) => 
 setTimeout(() => resolve({ success: true, message: 'Booking confirmed!' }), 1500)
 );
};
