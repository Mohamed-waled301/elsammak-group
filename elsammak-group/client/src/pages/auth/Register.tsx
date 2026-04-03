import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import LocationSelect from '../../components/LocationSelect';
import { useAuth } from '../../context/AuthContext';
import { getMe, register as apiRegister, verifyOTP as apiVerifyOTP } from '../../api/auth';
import { validateEgyptianNationalId, type ParsedNationalId } from '../../utils/egyptNationalId';

const Register = () => {
 const { t } = useTranslation();
 const navigate = useNavigate();
 const { login } = useAuth();
 const [mode, setMode] = useState<'register' | 'otp'>('register');
 const [loading, setLoading] = useState(false);
 const [nidParsed, setNidParsed] = useState<ParsedNationalId | null>(null);
 const [nidError, setNidError] = useState('');

 const [formData, setFormData] = useState({
  name: '',
  nationalId: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  governorate: '',
  city: '',
  otp: ''
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
  setNidError('');
  setFormData((f) => ({ ...f, nationalId: raw }));

  if (raw.length !== 14) {
    setNidParsed(null);
    return;
  }
  const result = validateEgyptianNationalId(raw);
  if (!result.ok) {
    setNidParsed(null);
    return;
  }
  setNidParsed(result.parsed);
  setFormData((f) => ({
    ...f,
    nationalId: raw,
    governorate: result.parsed.governorateName,
    city: f.governorate !== result.parsed.governorateName ? '' : f.city,
  }));
 };

 const handleNationalIdBlur = () => {
  const raw = formData.nationalId.replace(/\D/g, '');
  if (!raw) {
    setNidError('');
    return;
  }
  if (raw.length !== 14) {
    setNidError(t('auth.national_id_invalid'));
    return;
  }
  const result = validateEgyptianNationalId(raw);
  setNidError(result.ok ? '' : result.error);
 };

 const handleLocationChange = (loc: { governorate: string; city: string }) => {
  setFormData((prev) => ({ ...prev, governorate: loc.governorate, city: loc.city }));
 };

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    toast.error(t('auth.passwords_mismatch'));
    return;
  }
  const nidCheck = validateEgyptianNationalId(formData.nationalId.replace(/\D/g, ''));
  if (!nidCheck.ok) {
    toast.error(nidCheck.error);
    setNidError(nidCheck.error);
    return;
  }
  if (formData.governorate !== nidCheck.parsed.governorateName) {
    toast.error(
      t('auth.gov_must_match_nid', 'Governorate must match your National ID (place of birth).')
    );
    return;
  }
  setLoading(true);
  try {
    const data = await apiRegister({
      name: formData.name,
      nationalId: formData.nationalId.replace(/\D/g, ''),
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
      governorate: formData.governorate,
      city: formData.city,
      birthDate: nidCheck.parsed.birthDateISO,
      gender: nidCheck.parsed.gender,
    });
    if (data?.success !== true) {
      toast.error(String(data?.message || t('auth.register_failed', 'Registration failed')));
      return;
    }
    toast.success(String(data?.message || t('auth.register_success')));
    setMode('otp');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : t('auth.register_failed', 'Registration failed');
    toast.error(msg);
  } finally {
    setLoading(false);
  }
 };

 const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const data = await apiVerifyOTP({
      email: formData.email,
      otp: formData.otp
    });
    if (data?.success !== true || !data?.token) {
      toast.error(String(data?.message || 'OTP verification failed ❌'));
      return;
    }
    const userRes = await getMe(data.token);
    const verifiedUser = userRes?.data?.user;
    login(data.token, {
      id: verifiedUser?._id,
      name: verifiedUser?.name || formData.name,
      email: verifiedUser?.email || formData.email,
      phone: verifiedUser?.phone || formData.phone,
      role: 'client',
      nationalId: verifiedUser?.nationalId || formData.nationalId,
      governorate: verifiedUser?.governorate || formData.governorate,
      city: verifiedUser?.city || formData.city,
    });
    toast.success('Account verified successfully ✅');
    navigate('/');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'OTP verification failed ❌';
    toast.error(msg);
  } finally {
    setLoading(false);
  }
 };

 return (
 <div className="min-h-screen bg-gray-50 py-24 flex items-center justify-center transition-colors duration-300">
 <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl border border-gray-100 ">
 <h2 className="text-3xl font-black text-[var(--color-primary)] mb-6 text-center">
  {mode === 'register' ? t('auth.register') : t('auth.verify_otp', 'Verify OTP')}
 </h2>
 
 {mode === 'register' ? (
   <form onSubmit={handleRegister} className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName')}</label>
        <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.nationalId')}</label>
        <input
          type="text"
          name="nationalId"
          inputMode="numeric"
          autoComplete="off"
          required
          maxLength={14}
          value={formData.nationalId}
          onChange={handleNationalIdChange}
          onBlur={handleNationalIdBlur}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 ${nidError ? 'border-red-500' : 'border-gray-300'}`}
        />
        {nidError ? <p className="mt-1 text-sm text-red-600">{nidError}</p> : null}
      </div>
    </div>

    {nidParsed ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
        <div>
          <span className="font-medium text-gray-600">{t('auth.birth_date', 'Birth date')}: </span>
          <span dir="ltr">{nidParsed.birthDateISO}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">{t('auth.gender', 'Gender')}: </span>
          <span>
            {nidParsed.gender === 'male'
              ? t('auth.gender_male', 'Male')
              : t('auth.gender_female', 'Female')}
          </span>
        </div>
      </div>
    ) : null}
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
      <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone', 'WhatsApp Number')}</label>
      <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
        <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
        <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
      </div>
    </div>
    
    <LocationSelect
      initialGov={formData.governorate}
      initialCity={formData.city}
      lockedGovernorate={nidParsed ? nidParsed.governorateName : null}
      onLocationChange={handleLocationChange}
    />

    <Button type="submit" className="w-full mt-6" size="lg" disabled={loading || Boolean(nidError)}>
      {loading ? t('common.processing', 'Processing...') : t('auth.register')}
    </Button>

    <p className="text-center text-sm text-gray-600 mt-6">
      {t('auth.have_account')} <Link to="/login" className="text-[var(--color-primary)] font-bold hover:underline">{t('auth.login')}</Link>
    </p>
   </form>
 ) : (
   <form onSubmit={handleVerify} className="space-y-5">
     <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.otp_placeholder')}</label>
       <input type="text" name="otp" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900 " />
     </div>
     <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
       {loading ? t('common.processing', 'Processing...') : t('auth.activate_login')}
     </Button>
   </form>
 )}
 </div>
 </div>
 );
};

export default Register;
