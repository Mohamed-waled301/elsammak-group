import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import LocationSelect from '../components/LocationSelect';
import { BookOpen, Loader2 } from 'lucide-react';
import { submitTrainingBooking } from '../api/training';

const TrainingBooking = () => {
 const { t, i18n } = useTranslation();
 const isRTL = i18n.language === 'ar';
 const [submitted, setSubmitted] = useState(false);

 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 course: '',
 date: '',
 governorate: '',
 city: ''
 });
 const [loading, setLoading] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 try {
 await submitTrainingBooking(formData);
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
 <h2 className="text-2xl font-bold text-gray-900 mb-2">{isRTL ? 'تم تأكيد الحجز' : 'Booking Confirmed'}</h2>
 <p className="text-gray-600 mb-8">{isRTL ? 'تم استلام طلبك. سنتواصل معك قريباً لتأكيد الموعد.' : 'Your training request has been received. We will contact you shortly.'}</p>
 <Button to="/" className="w-full">{isRTL ? 'العودة للرئيسية' : 'Return Home'}</Button>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50 py-24 transition-colors duration-300">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="bg-white pt-10 pb-12 px-8 sm:px-12 rounded-xl shadow-2xl border border-gray-100 ">
 <div className="text-center mb-10">
 <BookOpen className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-4" />
 <h1 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4 drop-shadow-sm">
 {t('training.book_seat')}
 </h1>
 <p className="text-gray-600 ">
 {isRTL ? 'يرجى تقديم بياناتك لحجز مقعدك في البرنامج التدريبي.' : 'Please provide your details to reserve your seat in the training program.'}
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
 <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
 <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'البرنامج التدريبي' : 'Training Program'}</label>
 <select name="course" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 ">
 <option value="" disabled>{isRTL ? 'اختر البرنامج...' : 'Select a program...'}</option>
 <option value="data_analysis">{isRTL ? 'تحليل البيانات' : 'Data Analysis'}</option>
 <option value="human_resources">{isRTL ? 'الموارد البشرية' : 'Human Resources'}</option>
 <option value="legal_training">{isRTL ? 'التدريب القانوني للمحامين' : 'Legal Training for Lawyers'}</option>
 </select>
 </div>
 </div>

 <LocationSelect 
 initialGov={formData.governorate}
 initialCity={formData.city}
 onLocationChange={({governorate, city}) => setFormData(prev => ({ ...prev, governorate, city }))}
 />

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'التاريخ المفضل' : 'Preferred Date'}</label>
 <input type="date" name="date" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
 </div>

 <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
 {loading ? (
 <span className="flex items-center justify-center gap-2">
 <Loader2 className="w-5 h-5 animate-spin" /> {isRTL ? 'جاري المعالجة...' : 'Processing...'}
 </span>
 ) : (
 isRTL ? 'تأكيد الحجز' : 'Confirm Booking'
 )}
 </Button>
 </form>
 </div>
 </div>
 </div>
 );
};

export default TrainingBooking;
