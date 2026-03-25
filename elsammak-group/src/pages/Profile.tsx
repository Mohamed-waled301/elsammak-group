import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import LocationSelect from '../components/LocationSelect';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Lock } from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    governorate: user?.governorate || '',
    city: user?.city || ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-[var(--color-primary)] text-[var(--color-gold)] rounded-full flex items-center justify-center text-2xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('nav.profile', 'User Profile')}</h1>
              <p className="text-gray-500">{t('profile.manage_settings', 'Manage your account settings')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {saved && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
                {t('profile.saved_success', 'Profile updated successfully!')}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> {t('auth.fullName', 'Full Name')}
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {t('contact.email', 'Email')}
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> {t('auth.phone', 'Phone Number')}
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" /> {t('auth.password', 'New Password')}
                </label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" /> {t('profile.location_settings', 'Location Settings')}
              </h3>
              <LocationSelect 
                initialGov={formData.governorate}
                initialCity={formData.city}
                onLocationChange={({governorate, city}) => setFormData(prev => ({ ...prev, governorate, city }))}
              />
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full md:w-auto">
                {t('profile.save_changes', 'Save Changes')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
