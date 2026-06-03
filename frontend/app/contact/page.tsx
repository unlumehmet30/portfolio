import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { defaultProfile } from "@/lib/site";
import { getUiCopy } from "@/lib/ui-copy";

const copy = getUiCopy("en").contact;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.45fr_0.55fr]">
      <div>
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${defaultProfile.email}`} variant="outline">{copy.email}</ButtonLink>
          <ButtonLink href={defaultProfile.githubUrl} variant="outline">{copy.github}</ButtonLink>
          <ButtonLink href={defaultProfile.linkedinUrl} variant="outline">{copy.linkedin}</ButtonLink>
        </div>
      </div>
      <ContactForm locale="en" />
    </div>
  );
}
