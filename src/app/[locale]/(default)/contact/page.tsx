export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import ContactForm from "./contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/contact`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/contact`;
  }

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  return (
    <ContactForm 
      title={t("title")}
      subtitle={t("subtitle")}
      translations={{
        name: t("form.name"),
        email: t("form.email"),
        emailTip: t("form.email_tip"),
        projectType: t("form.projectType"),
        selectProjectType: t("form.selectProjectType"),
        budget: t("form.budget"),
        selectBudget: t("form.selectBudget"),
        message: t("form.message"),
        messagePlaceholder: t("form.messagePlaceholder"),
        needsNda: t("form.needsNda"),
        ndaDescription: t("form.ndaDescription"),
        submit: t("form.submit"),
        submitting: t("form.submitting"),
        privacyNotice: t("privacyNotice"),
        privacyPolicy: t("privacyPolicy"),
        projectTypes: {
          web: t("form.projectTypes.web"),
          app: t("form.projectTypes.app"),
          saas: t("form.projectTypes.saas"),
          ai: t("form.projectTypes.ai"),
          mini: t("form.projectTypes.mini"),
          system: t("form.projectTypes.system"),
          other: t("form.projectTypes.other"),
        },
        budgetRanges: {
          small: t("form.budgetRanges.small"),
          medium: t("form.budgetRanges.medium"),
          large: t("form.budgetRanges.large"),
          enterprise: t("form.budgetRanges.enterprise"),
        }
      }}
    />
  );
}