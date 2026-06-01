import { Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import { TRAINING_PROGRAMS, SCHEDULED_WHEN_FULL_KEY } from '../config/trainingPrograms';

const CATEGORY_KEYS = [
  'training.courses.c1_cat',
  'training.courses.c2_cat',
  'training.courses.c3_cat',
  'training.courses.c4_cat',
  'training.courses.c5_cat',
  'training.courses.c6_cat',
  'training.courses.c7_cat',
] as const;

const FORMAT_KEYS = [
  'training.courses.c1_fmt',
  'training.courses.c2_fmt',
  'training.courses.c3_fmt',
  'training.courses.c4_fmt',
  'training.courses.c5_fmt',
  'training.courses.c6_fmt',
  'training.courses.c7_fmt',
] as const;

const Training = () => {
  const { t } = useTranslation();
  const whenFull = t(SCHEDULED_WHEN_FULL_KEY);

  const courses = TRAINING_PROGRAMS.map((program, idx) => ({
    title: t(program.titleKey),
    category: t(CATEGORY_KEYS[idx] ?? 'training.courses.c1_cat'),
    duration: whenFull,
    date: whenFull,
    location: t(FORMAT_KEYS[idx] ?? 'training.courses.c1_fmt'),
  }));

  return (
    <div className="bg-gray-50 min-h-screen transition-colors duration-300">
      <div className="bg-[var(--color-primary)] text-white py-20 px-4 text-center transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">{t('training.title')}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-sm">{t('training.subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2">
            {t('training.programs_label')}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] transition-colors">
            {t('training.upcoming_courses')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[var(--color-gold)]/50 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-2"
            >
              <div className="p-8 flex-grow">
                <span className="inline-block px-3 py-1 bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-bold uppercase tracking-wider rounded-full mb-4 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-primary)] transition-colors">
                  {course.category}
                </span>
                <h4 className="text-xl font-bold text-[var(--color-primary)] mb-6 group-hover:text-[var(--color-gold)] transition-colors">
                  {course.title}
                </h4>

                <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-[var(--color-gold)] group-hover:scale-110 transition-transform" />
                    <span>
                      {t('training.duration')} {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-[var(--color-gold)] group-hover:scale-110 transition-transform" />
                    <span>
                      {t('training.start')} {course.date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-[var(--color-gold)] group-hover:scale-110 transition-transform" />
                    <span>
                      {t('training.format')} {course.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 transition-colors">
                <Button
                  to="/training-booking"
                  variant="primary"
                  className="w-full shadow-md group-hover:shadow-[var(--color-primary)]/20 transition-all"
                >
                  {t('training.book_seat')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;
