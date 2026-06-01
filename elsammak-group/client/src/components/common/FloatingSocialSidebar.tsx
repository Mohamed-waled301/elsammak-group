import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import clsx from 'clsx';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './SocialBrandIcons';

const DEFAULT_FACEBOOK_URL =
  'https://www.facebook.com/profile.php?id=61582507755598&sfnsn=wa';

const SOCIAL_BTN =
  'relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const FloatingSocialSidebar = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [expanded, setExpanded] = useState(false);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '201276691302';
  const whatsappText = isRTL ? 'مرحباً! كيف يمكنني مساعدتكم؟' : 'Hello! How can we help you?';
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  const facebookHref =
    (import.meta.env.VITE_FACEBOOK_URL as string | undefined)?.trim() || DEFAULT_FACEBOOK_URL;

  const instagramHref =
    (import.meta.env.VITE_INSTAGRAM_URL as string | undefined)?.trim() ||
    'https://www.instagram.com/';

  const tiktokHref =
    (import.meta.env.VITE_TIKTOK_URL as string | undefined)?.trim() || 'https://www.tiktok.com/';

  const links = [
    {
      href: facebookHref,
      label: isRTL ? 'فيسبوك' : 'Facebook',
      className: 'bg-[#1877F2] focus-visible:ring-[#1877F2]',
      icon: <FacebookIcon className="h-6 w-6" />,
    },
    {
      href: whatsappHref,
      label: isRTL ? 'واتساب' : 'WhatsApp',
      className: 'bg-[#25D366] focus-visible:ring-[#25D366]',
      icon: <WhatsAppIcon className="h-6 w-6" />,
    },
    {
      href: tiktokHref,
      label: isRTL ? 'تيك توك' : 'TikTok',
      className: 'bg-[#010101] focus-visible:ring-gray-800',
      icon: <TikTokIcon className="h-6 w-6" />,
    },
    {
      href: instagramHref,
      label: isRTL ? 'إنستغرام' : 'Instagram',
      className:
        'bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] focus-visible:ring-pink-500',
      icon: <InstagramIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div
      className="fixed bottom-6 left-6 z-[60] flex flex-col items-center gap-3"
      aria-label={isRTL ? 'روابط التواصل الاجتماعي' : 'Social media links'}
    >
      <div
        className={clsx(
          'flex flex-col items-center gap-3 overflow-hidden transition-all duration-500 ease-in-out',
          expanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(SOCIAL_BTN, link.className, 'group')}
            aria-label={link.label}
            tabIndex={expanded ? 0 : -1}
          >
            <span
              className={clsx(
                'absolute inset-0 rounded-full opacity-20 animate-ping group-hover:opacity-35',
                link.className.includes('25D366') && 'bg-[#25D366]',
                link.className.includes('1877F2') && 'bg-[#1877F2]',
                link.className.includes('010101') && 'bg-black',
                link.className.includes('gradient') && 'bg-pink-500'
              )}
            />
            <span className="relative z-10">{link.icon}</span>
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={clsx(
          SOCIAL_BTN,
          'bg-[var(--color-primary)] text-white focus-visible:ring-[var(--color-primary)]',
          'border-2 border-[var(--color-gold)]/40'
        )}
        aria-expanded={expanded}
        aria-label={
          expanded
            ? isRTL
              ? 'إخفاء روابط التواصل'
              : 'Collapse social links'
            : isRTL
              ? 'عرض روابط التواصل'
              : 'Expand social links'
        }
      >
        {expanded ? (
          isRTL ? (
            <ChevronRight className="h-5 w-5 text-[var(--color-gold)]" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-[var(--color-gold)]" />
          )
        ) : (
          <Share2 className="h-5 w-5 text-[var(--color-gold)]" />
        )}
      </button>
    </div>
  );
};

export default FloatingSocialSidebar;
