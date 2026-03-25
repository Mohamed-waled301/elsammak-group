import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';

const Contact = () => {
 const { t } = useTranslation();

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 alert('Form submission ready for backend integration.');
 };

 return (
 <div className="bg-white min-h-screen transition-colors duration-300">
 <div className="bg-[var(--color-primary)] text-white py-20 px-4 text-center transition-colors duration-300">
 <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">{t('contact.title')}</h1>
 <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-sm">{t('contact.subtitle')}</p>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
 {/* Form */}
 <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm transition-colors">
 <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 transition-colors">{t('contact.send_msg')}</h2>
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 transition-colors">{t('contact.full_name')}</label>
 <input type="text" id="name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-all shadow-sm hover:border-gray-300 " placeholder="John Doe" required />
 </div>
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 transition-colors">{t('contact.email')}</label>
 <input type="email" id="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-all shadow-sm hover:border-gray-300 " placeholder="john@company.com" required />
 </div>
 </div>
 <div>
 <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 transition-colors">{t('contact.subject')}</label>
 <select id="subject" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-all shadow-sm hover:border-gray-300 cursor-pointer">
 <option value="legal">{t('contact.subjects.s1')}</option>
 <option value="accounting">{t('contact.subjects.s2')}</option>
 <option value="data">{t('contact.subjects.s3')}</option>
 <option value="training">{t('contact.subjects.s4')}</option>
 <option value="general">{t('contact.subjects.s5')}</option>
 </select>
 </div>
 <div>
 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 transition-colors">{t('contact.message')}</label>
 <textarea id="message" rows={5} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent outline-none transition-all resize-none shadow-sm hover:border-gray-300 " placeholder="..." required></textarea>
 </div>
 <Button type="submit" variant="primary" className="w-full py-4 text-lg shadow-lg hover:-translate-y-1 mt-4">{t('contact.send_btn')}</Button>
 </form>
 </div>

 {/* Info & Map */}
 <div className="flex flex-col justify-between">
 <div>
 <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-8 transition-colors">{t('contact.info_title')}</h2>
 <ul className="space-y-8 mb-12">
 <li className="flex items-start group">
 <div className="w-12 h-12 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-xl flex items-center justify-center mr-6 rtl:ml-6 rtl:mr-0 flex-shrink-0 mt-1 transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-primary)]">
 <MapPin className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-gray-900 mb-1 transition-colors">{t('contact.office')}</h4>
 <p className="text-gray-600 whitespace-pre-line transition-colors leading-relaxed">{t('contact.office_addr')}</p>
 </div>
 </li>
 <li className="flex items-start group">
 <div className="w-12 h-12 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-xl flex items-center justify-center mr-6 rtl:ml-6 rtl:mr-0 flex-shrink-0 mt-1 transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-primary)]">
 <Phone className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-gray-900 mb-1 transition-colors">{t('contact.phone')}</h4>
 <p className="text-gray-600 transition-colors">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
 </div>
 </li>
 <li className="flex items-start group">
 <div className="w-12 h-12 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-xl flex items-center justify-center mr-6 rtl:ml-6 rtl:mr-0 flex-shrink-0 mt-1 transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-primary)]">
 <Mail className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-gray-900 mb-1 transition-colors">{t('contact.email_label')}</h4>
 <p className="text-gray-600 transition-colors">info@elsammak-group.com<br/>support@elsammak-group.com</p>
 </div>
 </li>
 </ul>
 </div>
 
 {/* Map Placeholder */}
 <div className="rounded-3xl overflow-hidden border border-gray-100 h-64 bg-gray-200 relative group">
 <div className="absolute inset-0 flex items-center justify-center bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=13&size=600x300&maptype=roadmap&sensor=false')] bg-cover bg-center opacity-50 transition-opacity duration-300 group-hover:opacity-70 "></div>
 <div className="relative z-10 flex items-center justify-center w-full h-full text-gray-900 font-bold drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] ">
 {t('contact.map_placeholder')}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default Contact;
