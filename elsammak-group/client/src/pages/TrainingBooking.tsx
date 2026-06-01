import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Button from '../components/Button';
import LocationSelect from '../components/LocationSelect';
import { BookOpen, Loader2, Monitor, Users } from 'lucide-react';
import { submitTrainingBooking } from '../api/training';
import { getAvailability } from '../api/availability';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import {
  TRAINING_PROGRAMS,
  getTrainingProgram,
  type AttendanceMode,
} from '../config/trainingPrograms';

const TrainingBooking = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    attendanceMode: '' as AttendanceMode | '',
    bookingDate: '',
    governorate: '',
    city: '',
  });

  const selectedProgram = useMemo(
    () => (formData.course ? getTrainingProgram(formData.course) : undefined),
    [formData.course]
  );

  const remoteDisabled = selectedProgram ? !selectedProgram.allowRemote : true;
  const physicalDisabled = selectedProgram ? !selectedProgram.allowPhysical : true;

  useEffect(() => {
    if (!selectedProgram) return;
    if (formData.attendanceMode === 'remote' && remoteDisabled) {
      setFormData((p) => ({ ...p, attendanceMode: physicalDisabled ? '' : 'physical' }));
    }
    if (formData.attendanceMode === 'physical' && physicalDisabled) {
      setFormData((p) => ({ ...p, attendanceMode: remoteDisabled ? '' : 'remote' }));
    }
  }, [formData.course, formData.attendanceMode, remoteDisabled, physicalDisabled, selectedProgram]);

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getAvailability({ serviceType: 'training', month });
        setUnavailable(new Set(res?.unavailableDates || []));
      } catch {
        setUnavailable(new Set());
      }
    };
    run();
  }, [month]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setFormData((p) => ({ ...p, course: value, attendanceMode: '' }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const setAttendanceMode = (mode: AttendanceMode) => {
    if (mode === 'remote' && remoteDisabled) return;
    if (mode === 'physical' && physicalDisabled) return;
    setFormData((p) => ({ ...p, attendanceMode: mode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDateError('');

    if (!formData.attendanceMode) {
      setError(t('training.attendance_required'));
      setLoading(false);
      return;
    }

    if (formData.bookingDate && unavailable.has(formData.bookingDate)) {
      setDateError(t('common.day_unavailable'));
      setLoading(false);
      return;
    }

    try {
      const result = await submitTrainingBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        attendanceMode: formData.attendanceMode,
        bookingDate: formData.bookingDate,
        governorate: formData.governorate,
        city: formData.city,
      });
      toast.success(t('training.booking_confirmed_toast'));
      if (result?.emailSent === false && result?.emailWarning) {
        toast(result.emailWarning, { icon: '✉️', duration: 6000 });
      }
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        attendanceMode: '',
        bookingDate: '',
        governorate: '',
        city: '',
      });
    } catch (err) {
      console.error(err);
      const msg =
        (err as Error)?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Request failed';
      setError(typeof msg === 'string' ? msg : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-32 px-4 transition-colors duration-300 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('training.success_title')}</h2>
          <p className="text-gray-600 mb-8">{t('training.success_msg')}</p>
          <Button to="/" className="w-full">
            {t('common.return_home')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white pt-10 pb-12 px-8 sm:px-12 rounded-xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <BookOpen className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4 drop-shadow-sm">
              {t('training.book_seat')}
            </h1>
            <p className="text-gray-600">{t('training.booking_help')}</p>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('training.program_label')}</label>
                <select
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-gold)] outline-none bg-white text-gray-900"
                >
                  <option value="" disabled>
                    {t('training.select_program')}
                  </option>
                  {TRAINING_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.titleKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('training.attendance_label')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={remoteDisabled || !formData.course}
                  onClick={() => setAttendanceMode('remote')}
                  className={clsx(
                    'flex items-center gap-3 p-4 rounded-xl border-2 text-left rtl:text-right transition-all',
                    remoteDisabled || !formData.course
                      ? 'opacity-45 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                      : formData.attendanceMode === 'remote'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] shadow-sm'
                        : 'border-gray-200 hover:border-[var(--color-gold)] bg-white text-gray-700'
                  )}
                >
                  <Monitor className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{t('training.attendance_remote')}</div>
                    {remoteDisabled && formData.course ? (
                      <div className="text-xs mt-0.5 text-gray-400">{t('training.attendance_unavailable')}</div>
                    ) : null}
                  </div>
                </button>
                <button
                  type="button"
                  disabled={physicalDisabled || !formData.course}
                  onClick={() => setAttendanceMode('physical')}
                  className={clsx(
                    'flex items-center gap-3 p-4 rounded-xl border-2 text-left rtl:text-right transition-all',
                    physicalDisabled || !formData.course
                      ? 'opacity-45 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                      : formData.attendanceMode === 'physical'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] shadow-sm'
                        : 'border-gray-200 hover:border-[var(--color-gold)] bg-white text-gray-700'
                  )}
                >
                  <Users className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{t('training.attendance_physical')}</div>
                    {physicalDisabled && formData.course ? (
                      <div className="text-xs mt-0.5 text-gray-400">{t('training.attendance_unavailable')}</div>
                    ) : null}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.booking_date')}</label>
              <AvailabilityCalendar
                value={formData.bookingDate}
                onChange={(isoDate) => setFormData((p) => ({ ...p, bookingDate: isoDate }))}
                month={month}
                setMonth={setMonth}
                unavailableDates={unavailable}
                isRTL={isRTL}
                unavailableMessage={t('common.day_unavailable')}
              />
              {dateError ? <div className="mt-2 text-sm text-red-600">{dateError}</div> : null}
            </div>

            <LocationSelect
              initialGov={formData.governorate}
              initialCity={formData.city}
              onLocationChange={({ governorate, city }) =>
                setFormData((prev) => ({ ...prev, governorate, city }))
              }
            />

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> {t('common.processing')}
                </span>
              ) : (
                t('common.confirm_booking')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainingBooking;
