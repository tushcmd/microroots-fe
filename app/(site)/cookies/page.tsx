import type { Metadata } from "next"
import { LegalDocument, type LegalSection } from "@/components/site/legal-document"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How MicroRootsKE uses cookies and similar technologies, and how you can manage your preferences.",
}

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    number: "3.1",
    heading: "What are cookies?",
    blocks: [
      {
        type: "p",
        text: "Cookies are small text files placed on your device when you visit a website. They help the site function, remember your preferences and understand how the site is used.",
      },
    ],
  },
  {
    id: "how-we-use-cookies",
    number: "3.2",
    heading: "How we use cookies",
    blocks: [
      { type: "p", text: "We may use the following categories:" },
      {
        type: "ul",
        items: [
          "Essential cookies – required for the website to work (session management, security). These do not require consent.",
          "Analytics cookies – help us understand visitor numbers and page performance. Used only with your consent where required.",
          "Marketing cookies – used only if you actively opt in.",
        ],
      },
    ],
  },
  {
    id: "managing-cookies",
    number: "3.3",
    heading: "Managing cookies",
    blocks: [
      {
        type: "p",
        text: "On your first visit you will see a cookie banner allowing you to accept or reject optional cookies. You can also control cookies through your browser settings. Blocking essential cookies may affect site functionality.",
      },
      {
        type: "p",
        text: "For more information about how we handle personal data, please read our Privacy Policy.",
      },
    ],
  },
]

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      intro={[
        `This Cookie Policy explains how ${site.legal.controller} uses cookies and similar technologies on ${site.legal.website}.`,
      ]}
      sections={sections}
    />
  )
}