/**
 * Multi-language SEO Implementation
 *
 * Comprehensive multi-language SEO support for Morocco market
 * including French and Arabic language optimization
 */

// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    hreflang: 'en-US',
    dir: 'ltr',
    default: true,
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    hreflang: 'fr-MA',
    dir: 'ltr',
    default: false,
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    hreflang: 'ar-MA',
    dir: 'rtl',
    default: false,
  },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Multi-language content structure
export interface MultiLanguageContent {
  en: {
    title: string;
    description: string;
    keywords: string[];
    content?: string;
  };
  fr?: {
    title: string;
    description: string;
    keywords: string[];
    content?: string;
  };
  ar?: {
    title: string;
    description: string;
    keywords: string[];
    content?: string;
  };
}

// Morocco-specific keywords by language
export const MOROCCO_KEYWORDS_MULTILANG = {
  en: {
    primary: [
      'video production morocco',
      'photography morocco',
      '3d visualization morocco',
      'creative studio morocco',
      'film production casablanca',
      'corporate video morocco',
    ],
    locations: [
      'morocco',
      'casablanca',
      'rabat',
      'mohammedia',
      'marrakech',
      'fez',
      'tangier',
      'agadir',
    ],
    services: [
      'video production',
      'photography',
      '3d visualization',
      'filmmaking',
      'corporate video',
      'brand film',
      'commercial photography',
      'architectural visualization',
    ],
  },
  fr: {
    primary: [
      'production vidéo maroc',
      'photographie maroc',
      'visualisation 3d maroc',
      'studio créatif maroc',
      'production film casablanca',
      'vidéo corporate maroc',
    ],
    locations: [
      'maroc',
      'casablanca',
      'rabat',
      'mohammedia',
      'marrakech',
      'fès',
      'tanger',
      'agadir',
    ],
    services: [
      'production vidéo',
      'photographie',
      'visualisation 3d',
      'réalisation',
      'vidéo corporate',
      'film de marque',
      'photographie commerciale',
      'visualisation architecturale',
    ],
  },
  ar: {
    primary: [
      'إنتاج الفيديو المغرب',
      'التصوير المغرب',
      'التصور ثلاثي الأبعاد المغرب',
      'استوديو إبداعي المغرب',
      'إنتاج الأفلام الدار البيضاء',
      'فيديو الشركات المغرب',
    ],
    locations: ['المغرب', 'الدار البيضاء', 'الرباط', 'محمدية', 'مراكش', 'فاس', 'طنجة', 'أكادير'],
    services: [
      'إنتاج الفيديو',
      'التصوير',
      'التصور ثلاثي الأبعاد',
      'صناعة الأفلام',
      'فيديو الشركات',
      'فيلم العلامة التجارية',
      'التصوير التجاري',
      'التصور المعماري',
    ],
  },
};

// Generate hreflang tags for multi-language pages
export function generateHreflangTags(
  currentPath: string,
  availableLanguages: LanguageCode[] = ['en', 'fr', 'ar']
): string {
  const baseUrl = 'https://blackwoodscreative.com';

  const hreflangTags = availableLanguages
    .filter(lang => Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, lang))
    .map(lang => {
      const langConfig = SUPPORTED_LANGUAGES[lang] ?? SUPPORTED_LANGUAGES.en;
      const url = lang === 'en' ? `${baseUrl}${currentPath}` : `${baseUrl}/${lang}${currentPath}`;

      return `<link rel="alternate" hreflang="${langConfig.hreflang}" href="${url}" />`;
    })
    .join('\n');

  // Add x-default for English
  const defaultTag = `<link rel="alternate" hreflang="x-default" href="${baseUrl}${currentPath}" />`;

  return `${hreflangTags}\n${defaultTag}`;
}

// Generate multi-language meta tags
export function generateMultiLanguageMeta(
  content: MultiLanguageContent,
  currentLang: LanguageCode = 'en'
) {
  // Validate language code exists
  if (!Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, currentLang)) {
    throw new Error(`Unsupported language code: ${currentLang}`);
  }

  const langConfig = SUPPORTED_LANGUAGES[currentLang] ?? SUPPORTED_LANGUAGES.en;
  const langContent = content[currentLang] ?? content.en;

  if (!langContent) {
    throw new Error(`Content not available for language: ${currentLang}`);
  }

  return {
    title: langContent.title,
    description: langContent.description,
    keywords: langContent.keywords.join(', '),
    language: langConfig.code,
    dir: langConfig.dir,
    hreflang: langConfig.hreflang,
  };
}

// Generate multi-language schema markup
export function generateMultiLanguageSchema(
  content: MultiLanguageContent,
  currentLang: LanguageCode = 'en',
  schemaType: 'Organization' | 'LocalBusiness' | 'Service' = 'LocalBusiness'
) {
  // Validate language code exists
  if (!Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, currentLang)) {
    throw new Error(`Unsupported language code: ${currentLang}`);
  }

  const langConfig = SUPPORTED_LANGUAGES[currentLang] ?? SUPPORTED_LANGUAGES.en;
  const langContent = content[currentLang] ?? content.en;

  if (!langContent) {
    throw new Error(`Content not available for language: ${currentLang}`);
  }

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: 'BlackWoods Creative',
    description: langContent.description,
    inLanguage: langConfig.hreflang,

    // Multi-language name variations
    alternateName:
      currentLang === 'ar'
        ? ['بلاك وودز كريتيف', 'BlackWoods Creative']
        : currentLang === 'fr'
          ? ['BlackWoods Créatif', 'BlackWoods Creative']
          : ['BlackWood Creative', 'Black Woods Creative'],

    // Address in local language
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        currentLang === 'ar'
          ? 'مركز مفضل للأعمال، المبنى O، الطابق 5'
          : currentLang === 'fr'
            ? "Centre d'affaires MFADEL, Bâtiment O, 5ème étage"
            : 'MFADEL Business Center, Building O, Floor 5',
      addressLocality: currentLang === 'ar' ? 'محمدية' : 'Mohammedia',
      addressRegion:
        currentLang === 'ar'
          ? 'الدار البيضاء-سطات'
          : currentLang === 'fr'
            ? 'Casablanca-Settat'
            : 'Casablanca-Settat',
      addressCountry: currentLang === 'ar' ? 'المغرب' : currentLang === 'fr' ? 'Maroc' : 'Morocco',
      postalCode: '28810',
    },

    // Service areas in local language
    areaServed: (MOROCCO_KEYWORDS_MULTILANG[currentLang] ?? MOROCCO_KEYWORDS_MULTILANG.en).locations.map(location => ({
      '@type': 'Place',
      name: location,
    })),

    // Services in local language
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        currentLang === 'ar'
          ? 'الخدمات الإبداعية'
          : currentLang === 'fr'
            ? 'Services Créatifs'
            : 'Creative Services',
      itemListElement: (MOROCCO_KEYWORDS_MULTILANG[currentLang] ?? MOROCCO_KEYWORDS_MULTILANG.en).services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          areaServed: currentLang === 'ar' ? 'المغرب' : currentLang === 'fr' ? 'Maroc' : 'Morocco',
        },
      })),
    },
  };

  return baseSchema;
}

// Language detection and redirection logic
export function detectUserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';

  // Check localStorage first
  const savedLang = localStorage.getItem('preferred-language') as LanguageCode;
  if (savedLang && Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, savedLang)) {
    return savedLang;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ar')) return 'ar';

  // Check Accept-Language header patterns for Morocco
  if (browserLang.includes('ma') || browserLang.includes('morocco')) {
    // Prefer French for Morocco if not Arabic
    return browserLang.startsWith('ar') ? 'ar' : 'fr';
  }

  return 'en'; // Default to English
}

// Save user language preference
export function saveLanguagePreference(lang: LanguageCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang);
  }
}

// Generate language-specific URLs
export function generateLanguageUrls(
  basePath: string,
  availableLanguages: LanguageCode[] = ['en', 'fr', 'ar']
): Record<LanguageCode, string> {
  const baseUrl = 'https://blackwoodscreative.com';

  return availableLanguages.reduce(
    (urls, lang) => {
      // Safe object assignment with validation
      if (typeof lang === 'string' && lang.length > 0 && lang.length < 10) {
        urls[lang] = lang === 'en' ? `${baseUrl}${basePath}` : `${baseUrl}/${lang}${basePath}`;
      }
      return urls;
    },
    {} as Record<LanguageCode, string>
  );
}

// Content translation helpers
export const COMMON_TRANSLATIONS = {
  en: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    portfolio: 'Portfolio',
    contact: 'Contact',
    'video-production': 'Video Production',
    photography: 'Photography',
    '3d-visualization': '3D Visualization',
    'read-more': 'Read More',
    'get-quote': 'Get Quote',
    'contact-us': 'Contact Us',
  },
  fr: {
    home: 'Accueil',
    about: 'À Propos',
    services: 'Services',
    portfolio: 'Portfolio',
    contact: 'Contact',
    'video-production': 'Production Vidéo',
    photography: 'Photographie',
    '3d-visualization': 'Visualisation 3D',
    'read-more': 'Lire Plus',
    'get-quote': 'Obtenir un Devis',
    'contact-us': 'Nous Contacter',
  },
  ar: {
    home: 'الرئيسية',
    about: 'حولنا',
    services: 'الخدمات',
    portfolio: 'أعمالنا',
    contact: 'اتصل بنا',
    'video-production': 'إنتاج الفيديو',
    photography: 'التصوير',
    '3d-visualization': 'التصور ثلاثي الأبعاد',
    'read-more': 'اقرأ المزيد',
    'get-quote': 'احصل على عرض سعر',
    'contact-us': 'اتصل بنا',
  },
};

// Get translation for a key
export function getTranslation(key: string, lang: LanguageCode = 'en'): string {
  return (COMMON_TRANSLATIONS[lang] ?? COMMON_TRANSLATIONS.en)[key as keyof typeof COMMON_TRANSLATIONS.en] ?? key;
}

// Generate language switcher data
export function generateLanguageSwitcher(currentPath: string) {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => ({
    code: code as LanguageCode,
    name: config.name,
    nativeName: config.nativeName,
    url: generateLanguageUrls(currentPath)[code as LanguageCode],
    dir: config.dir,
    current: config.default,
  }));
}
