import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BlackWoods Creative - Coming Soon | Professional Video Production & 3D Services',
  description: 'BlackWoods Creative is upgrading our website to serve you better. Professional video production, 3D modeling, and creative services in Morocco. Contact us at (+212) 625 55 37 68',
  keywords: 'blackwoods creative, video production, 3D modeling, film production, creative services, Morocco, BLKWDS',
  robots: 'index, follow',
  openGraph: {
    title: 'BlackWoods Creative - Coming Soon',
    description: 'Professional video production and 3D services. Website under construction - contact us directly.',
    type: 'website',
    url: 'https://blackwoodscreative.com',
    siteName: 'BlackWoods Creative',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BlackWoods Creative - Professional Video Production & 3D Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackWoods Creative - Coming Soon',
    description: 'Professional video production and 3D services. Website under construction.',
  },
  alternates: {
    canonical: 'https://blackwoodscreative.com',
  },
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BlackWoods Creative",
      "alternateName": ["BLKWDS Creative", "Blackwood Creative", "Black Woods Creative"],
      "url": "https://blackwoodscreative.com",
      "telephone": "+212625553768",
      "email": "contact@blackwoodscreative.com",
      "description": "Professional video production, 3D modeling, and creative services in Morocco",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Morocco"
      },
      "serviceArea": {
        "@type": "Place",
        "name": "Morocco"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Creative Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Video Production",
              "description": "Professional filming and editing services"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "3D Modeling",
              "description": "Cutting-edge 3D design and visualization"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Creative Direction",
              "description": "Bringing your vision to life"
            }
          }
        ]
      }
    })
  }
};

export default function UnderConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
