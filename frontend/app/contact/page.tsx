import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { defaultProfile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Mehmet Ünlü about forecasting, computer vision, ML project work, or collaboration."
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.45fr_0.55fr]">
      <div>
        <SectionHeader
          eyebrow="Contact"
          title="Have a project, question, or collaboration idea?"
          description="Send a direct message here, or reach me through email, GitHub, or LinkedIn."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${defaultProfile.email}`} variant="outline">Email</ButtonLink>
          <ButtonLink href={defaultProfile.githubUrl} variant="outline">GitHub</ButtonLink>
          <ButtonLink href={defaultProfile.linkedinUrl} variant="outline">LinkedIn</ButtonLink>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
