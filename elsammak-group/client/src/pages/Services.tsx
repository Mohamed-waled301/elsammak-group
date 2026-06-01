import { Scale, Calculator, BarChart3, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'law',
      icon: <Scale className="w-12 h-12" />,
      title: t('services.law.title'),
      desc: t('services.law.desc'),
      services: t('services.law.items', { returnObjects: true }) as string[],
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80',
      link: null as string | null,
    },
    {
      id: 'accounting',
      icon: <Calculator className="w-12 h-12" />,
      title: t('services.accounting.title'),
      desc: t('services.accounting.desc'),
      services: t('services.accounting.items', { returnObjects: true }) as string[],
      image: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&q=80',
      link: null,
    },
    {
      id: 'analysis',
      icon: <BarChart3 className="w-12 h-12" />,
      title: t('services.analysis.title'),
      desc: t('services.analysis.desc'),
      services: t('services.analysis.items', { returnObjects: true }) as string[],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      link: '/data-analysis',
    },
    {
      id: 'training',
      icon: <GraduationCap className="w-12 h-12" />,
      title: t('services.training.title'),
      desc: t('services.training.desc'),
      services: t('services.training.items', { returnObjects: true }) as string[],
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
      link: '/training',
    },
  ];

  return (
    <div className="bg-white min-h-screen transition-colors duration-300">
      <div className="bg-[var(--color-primary)] text-white py-20 px-4 text-center transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">{t('services.title')}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-sm">{t('services.subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            id={section.id}
            className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="flex-1">
              <div className="text-[var(--color-gold)] mb-6 bg-[var(--color-primary)]/5 w-24 h-24 rounded-3xl flex items-center justify-center transform transition-transform hover:scale-105 hover:rotate-3 shadow-sm">
                {section.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 transition-colors">
                {section.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed transition-colors">{section.desc}</p>
              <ul className="space-y-4">
                {section.services.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-700 bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[var(--color-gold)]/30 transition-all hover:shadow-md hover:-translate-y-1 group"
                  >
                    <div className="w-2 h-2 bg-[var(--color-gold)] rounded-full mr-4 rtl:ml-4 rtl:mr-0 group-hover:scale-150 transition-transform" />
                    <span className="font-medium group-hover:text-[var(--color-primary)] transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {section.link ? (
                <Link
                  to={section.link}
                  className="inline-block mt-8 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-gold)] transition-colors"
                >
                  {t('common.learn_more')} →
                </Link>
              ) : null}
            </div>
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-gold)] to-transparent opacity-20 rounded-3xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="bg-gray-900 h-96 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/90 via-[#0B1E36]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 rtl:left-auto rtl:right-6 flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <div className="text-[var(--color-gold)]">{section.icon}</div>
                  </div>
                  <div className="text-sm font-bold">{section.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
