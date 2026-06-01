import { apiUrl } from '../config/api';

export type TrainingBookingPayload = {
  name: string;
  email: string;
  phone: string;
  course: string;
  attendanceMode: 'remote' | 'physical';
  bookingDate: string;
  governorate: string;
  city: string;
};

export async function submitTrainingBooking(payload: TrainingBookingPayload) {
  const res = await fetch(apiUrl('/api/training/booking'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    mode: 'cors',
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    emailSent?: boolean;
    emailWarning?: string;
  };
  if (!res.ok) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
