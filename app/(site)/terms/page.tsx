import type { Metadata } from "next"
import { LegalDocument, type LegalSection } from "@/components/site/legal-document"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the MicroRootsKE website and any orders you place with us.",
}

const sections: LegalSection[] = [
  {
    id: "about-us",
    number: "2.1",
    heading: "About us",
    blocks: [
      {
        type: "p",
        text: "MicroRootsKE is a Nairobi-based producer of AI-grown microgreens. Contact details are the same as those in the Privacy Policy.",
      },
    ],
  },
  {
    id: "products-and-ordering",
    number: "2.2",
    heading: "Products and ordering",
    blocks: [
      {
        type: "p",
        text: "All products are subject to availability. We grow many varieties to order; typical lead times are 7–21 days depending on the crop. Prices are stated in Kenyan Shillings and may change without notice. We reserve the right to refuse or cancel any order in cases of stock shortage, obvious pricing error, or suspected fraud.",
      },
    ],
  },
  {
    id: "payment",
    number: "2.3",
    heading: "Payment",
    blocks: [
      {
        type: "p",
        text: "Accepted payment methods include M-Pesa, cash on delivery (where offered), and any other methods displayed on the website. For established wholesale clients, credit terms of 7–14 days may apply by separate written agreement.",
      },
    ],
  },
  {
    id: "delivery",
    number: "2.4",
    heading: "Delivery",
    blocks: [
      {
        type: "p",
        text: "Delivery is available within Nairobi and the areas listed on our Contact & Delivery page. Risk in the goods passes to you on delivery. Please inspect the product on receipt and notify us of any quality concerns within 24 hours of delivery.",
      },
    ],
  },
  {
    id: "quality-and-food-safety",
    number: "2.5",
    heading: "Quality and food safety",
    blocks: [
      {
        type: "p",
        text: "We produce under strict hygiene protocols and pack for maximum freshness. Microgreens are living, perishable produce. Once delivered, storage and handling become your responsibility. We do not accept returns of opened or perishable product except where the product was defective at the time of delivery.",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "2.6",
    heading: "Intellectual property",
    blocks: [
      {
        type: "p",
        text: "All content on the website (text, images, logos, branding and design) is owned by or licensed to MicroRootsKE and may not be copied, reproduced or used without our prior written permission.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: "2.7",
    heading: "Limitation of liability",
    blocks: [
      {
        type: "p",
        text: "To the fullest extent permitted by Kenyan law, our liability arising from any order is limited to the value of that order. We are not liable for any indirect or consequential loss. Nothing in these Terms excludes liability for death or personal injury caused by our negligence, or for fraud.",
      },
    ],
  },
  {
    id: "governing-law",
    number: "2.8",
    heading: "Governing law",
    blocks: [
      {
        type: "p",
        text: "These Terms are governed by the laws of the Republic of Kenya. Any dispute shall be subject to the exclusive jurisdiction of the Kenyan courts.",
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro={[
        `These Terms of Service govern your use of the MicroRootsKE website (${site.legal.website}) and any orders you place with us. By accessing the website or placing an order you agree to these Terms. If you do not agree, please do not use the site or our services.`,
      ]}
      sections={sections}
    />
  )
}