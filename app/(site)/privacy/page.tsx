import type { Metadata } from "next"
import { LegalDocument, type LegalSection } from "@/components/site/legal-document"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How MicroRootsKE collects, uses and protects your personal data in line with the Data Protection Act, 2019 (Kenya).",
}

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    number: "1.1",
    heading: "Who we are (Data Controller)",
    blocks: [
      {
        type: "p",
        text: `Data Controller: ${site.legal.controller}, operated by ${site.legal.operator}, ${site.legal.location}.`,
      },
      {
        type: "p",
        text: `Contact: ${site.legal.phoneDisplay} | ${site.legal.email} | ${site.legal.website}`,
      },
      {
        type: "p",
        text: "MicroRootsKE has not appointed a Data Protection Officer; please contact us directly using the details above.",
      },
    ],
  },
  {
    id: "data-we-collect",
    number: "1.2",
    heading: "Personal data we collect",
    blocks: [
      {
        type: "p",
        text: "We may collect the following personal data when you use our website, place an order, subscribe, or contact us:",
      },
      {
        type: "ul",
        items: [
          "Name and contact details (phone number, email address)",
          "Delivery address",
          "Order history and preferences",
          "Payment references (we do not store full card or M-Pesa PIN details)",
          "Communication preferences",
          "Technical data such as IP address, browser type, device information and pages visited",
        ],
      },
    ],
  },
  {
    id: "why-we-collect",
    number: "1.3",
    heading: "Why we collect your data and the legal basis",
    blocks: [
      { type: "p", text: "We process personal data only for specified, legitimate purposes:" },
      {
        type: "ul",
        items: [
          "To fulfil your orders and deliver products (contract)",
          "To communicate about your order or respond to enquiries (contract / legitimate interests)",
          "To send marketing messages (only with your consent or where soft opt-in applies)",
          "To improve our website and services (legitimate interests)",
          "To comply with legal obligations (tax, food safety records, etc.)",
        ],
      },
    ],
  },
  {
    id: "sharing",
    number: "1.4",
    heading: "Sharing of your data",
    blocks: [
      {
        type: "p",
        text: "We do not sell your personal data. We may share it only with trusted service providers (delivery partners, payment processors, website hosting or email platforms) strictly for the purposes above and under appropriate contracts. We may also disclose data where required by Kenyan law or to protect rights and safety.",
      },
    ],
  },
  {
    id: "international-transfers",
    number: "1.5",
    heading: "International transfers",
    blocks: [
      {
        type: "p",
        text: "If any personal data is transferred outside Kenya, we will ensure appropriate safeguards exist or obtain your consent as required by Section 48 of the Data Protection Act, 2019.",
      },
    ],
  },
  {
    id: "retention",
    number: "1.6",
    heading: "How long we keep your data",
    blocks: [
      {
        type: "p",
        text: "We keep personal data only as long as necessary for the purposes for which it was collected, or as required by tax, food-safety or other legal obligations (typically at least seven (7) years for transaction records). After that period the data is securely deleted or anonymised.",
      },
    ],
  },
  {
    id: "your-rights",
    number: "1.7",
    heading: "Your rights",
    blocks: [
      { type: "p", text: "Under the Data Protection Act, 2019 you have the right to:" },
      {
        type: "ul",
        items: [
          "be informed of the use to which your personal data is put",
          "access your personal data",
          "object to processing of all or part of your data",
          "request correction or deletion of your data",
          "data portability (where applicable)",
          "withdraw consent at any time",
        ],
      },
      {
        type: "p",
        text: `To exercise any of these rights, contact us using the details above. You also have the right to lodge a complaint with the ${site.legal.supervisoryAuthority} (${site.legal.supervisoryAuthorityUrl}).`,
      },
    ],
  },
  {
    id: "security",
    number: "1.8",
    heading: "Security",
    blocks: [
      {
        type: "p",
        text: "We implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, alteration or destruction.",
      },
    ],
  },
  {
    id: "changes",
    number: "1.9",
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "We may update this Privacy Policy from time to time. The latest version will always be published on our website with the “Last updated” date.",
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro={[
        "MicroRootsKE (“we”, “us”, “our”) respects your privacy and is committed to protecting your personal data in accordance with Article 31 of the Constitution of Kenya, the Data Protection Act, 2019 (Cap 411C) and the Data Protection (General) Regulations, 2021.",
      ]}
      sections={sections}
    />
  )
}