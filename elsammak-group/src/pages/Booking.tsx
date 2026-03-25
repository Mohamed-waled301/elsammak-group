import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import LocationSelect from '../components/LocationSelect';
import { submitBooking } from '../api/booking';
import { Loader2 } from 'lucide-react';

const Booking = () => {
 const { t } = useTranslation();
 const [submitted, setSubmitted] = useState(false);

 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 serviceType: '',
 date: '',
 time: '',
 notes: '',
 governorate: '',
 city: ''
 });
 const [loading, setLoading] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };



 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 try {
 await submitBooking(formData);
 setSubmitted(true);
 } catch (error) {
 console.error(error);
 } finally {
 setLoading(false);
 }
 };

 if (submitted) {
 return (
 <div className="min-h-screen bg-gray-50 py-32 px-4 transition-colors duration-300 flex items-center justify-center">
 <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100 text-center flex flex-col items-center">
 <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">✓</div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed</h2>
 <p className="text-gray-600 mb-8">Your consultation request has been received. We will contact you shortly to confirm the appointment.</p>
 <Button to="/" className="w-full">Return Home</Button>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50 py-24 transition-colors duration-300">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="bg-white pt-10 pb-12 px-8 sm:px-12 rounded-xl shadow-2xl border border-gray-100 ">
 <div className="text-center mb-10">
 <h1 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4 drop-shadow-sm">
 {t('common.book_consultation')}
 </h1>
 <p className="text-gray-600 ">
 Please fill in your details to schedule a professional consultation.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName', 'Full Name')}</label>
 <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email', 'Email Address')}</label>
 <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
 <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
 <select name="serviceType" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 ">
 <option value="" disabled>Select a service...</option>
 <option value="legal">{t('servicesItems.legal_consulting')}</option>
 <option value="accounting">{t('servicesItems.accounting_tax')}</option>
 </select>
 </div>
 </div>

 <div className="mb-2">
 <a href="https://maps.app.goo.gl/yjGz5J2FZSbUPcq27" target="_blank" rel="noreferrer" className="text-sm font-medium text-[#c5a059] hover:underline flex items-center gap-1 mb-4">
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
 View our main office on Google Maps
 </a>
 <LocationSelect 
 initialGov={formData.governorate}
 initialCity={formData.city}
 onLocationChange={({governorate, city}) => setFormData(prev => ({ ...prev, governorate, city }))}
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
 <input type="date" name="date" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
 <input type="time" name="time" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
 <textarea name="notes" rows={4} onChange={handleChange} placeholder="Briefly describe your requirements..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 resize-none"></textarea>
 </div>

 <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
 {loading ? (
 <span className="flex items-center justify-center gap-2">
 <Loader2 className="w-5 h-5 animate-spin" /> Processing...
 </span>
 ) : (
 'Confirm Booking'
 )}
 </Button>
 </form>
 </div>
 </div>
 </div>
 );
};

export default Booking;
