// /api/page-data/route.ts
import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { SocialType } from '@/app/types/sociallink'
import { FooterType } from '@/app/types/footerlink'
import { WorkType } from '@/app/types/work'
import { FeatureType } from '@/app/types/features'
import { FaqType } from '@/app/types/faq'

const Headerdata: HeaderItem[] = [
  { label: 'Home', href: '/' },
  { label: 'AI Assistant', href: '/ai-assistant' },
  { label: 'Medicine Scanner', href: '/scanner' }, 
  { label: 'Emergency SOS', href: '/sos' }
];

const workdata: WorkType[] = [
  {
    imgSrc: '/images/work/icon-one.svg',
    heading: 'Create Account',
    subheading:
      'Sign up with your email, set up a secure password, to unlock full access to the platform. Getting started takes just a few minutes.',
  },
  {
    imgSrc: '/images/work/details.svg',
    heading: 'Add details',
    subheading:
      'Click on Getting Started button -> Add your details and you can export your medical data any time. Also do not forget to add your medical history in profile section as this helps AI to give you better results',
  },
  {
    imgSrc: '/images/work/export.svg',
    heading: 'Export and more',
    subheading:
      'Clicking the export button above will generate a PDF containing your medical information and uploaded documents. Our AI will also provide insights and explanations for any medical terms you might not be familiar with.',
  },
]

const Featuresdata: FeatureType[] = [
  {
    imgSrc: '/images/features/privacy.png',
    heading: 'User Rights & Disclaimers',
    subheading:
      'Clear disclaimers are shown during sign-up and AI chats — reminding users that AI is not a substitute for doctors. Data is encrypted and fully user-controlled.',
  },
  {
    imgSrc: '/images/features/scan.png',
    heading: 'Medicine Scan Safety Check',
    subheading:
      'Use your phone to scan medicine barcodes. Our AI checks ingredients against your profile for allergies or interactions, labeling results: Safe, Warning, or Dangerous.',
  },
  {
    imgSrc: '/images/features/export.png',
    heading: 'PDF Medical Export',
    subheading:
      'Download a clean PDF with your full profile, uploaded documents, and timestamps — perfect for hospital check-ins or travel.',
  },
  {
    imgSrc: '/images/features/hospital.png',
    heading: 'Nearby Hospitals Finder',
    subheading:
      'Auto-detects your location and shows nearby hospitals with distance, phone numbers, directions, and availability.',
  },
  {
    imgSrc: '/images/features/ai.png',
    heading: 'Personalized AI Health Chat',
    subheading:
      'Talk to an AI trained on medical safety and your data. Ask health questions, scan meds, and get safe, transparent answers — with disclaimers and audit logs.',
  },
]
const Faqdata: FaqType[] = [
  {
    heading: '1. Can I trust the AI health suggestions?',
    subheading:
      'Even though AI is going to give a good response, it is not a replacement for a certified doctor. Always consult a healthcare provider for final decisions.',
  },
  {
    heading: '2. What does the PDF export include?',
    subheading:
      'The exported PDF includes all profile data you submitted, your uploaded documents, and timestamped metadata. It’s formatted for hospital and travel use.',
  },
  {
    heading: '3. What happens if I scan a medicine I’m allergic to?',
    subheading:
      'The app will show a “DANGEROUS” warning if any scanned ingredient conflicts with your profile (e.g., known allergies or health conditions). Always verify with a doctor.',
  },
]


const Sociallinkdata: SocialType[] = [
  { imgsrc: '/images/footer/insta.svg', href: 'https://instagram.com/suryansh.rohil' },
  { imgsrc: '/images/footer/link.svg', href: 'https://www.linkedin.com/in/suryansh-rohil-982a21270/' },
  { imgsrc: '/images/footer/twitter.svg', href: 'https://x.com/rohil_suryansh' },
  { imgsrc: '/images/footer/youtube.svg', href: 'https://www.youtube.com/@XenomorphGlad' },
  { imgsrc: '/images/footer/git.svg', href: 'https://github.com/s-uryansh' },
]

const Footerlinkdata: FooterType[] = [
  { label: 'Home', href: '/' },
  { label: 'How GladMeds works', href: '/#exchange-section' },
  { label: 'Features', href: '/#features-section' },
  { label: 'FAQ', href: '/#faq-section' },
  { label: 'Contact Us', href: '/#contact' },
]

export const GET = async () => {
  return NextResponse.json({
    Headerdata,
    workdata,
    Featuresdata,
    Faqdata,
    Sociallinkdata,
    Footerlinkdata,
  })
}
