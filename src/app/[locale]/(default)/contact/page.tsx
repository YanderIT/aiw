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
        emailTip: t("form.emailTip"),
        feedbackType: t("form.feedbackType"),
        selectFeedbackType: t("form.selectFeedbackType"),
        documentType: t("form.documentType"),
        selectDocumentType: t("form.selectDocumentType"),
        satisfaction: t("form.satisfaction"),
        selectSatisfaction: t("form.selectSatisfaction"),
        message: t("form.message"),
        messagePlaceholder: t("form.messagePlaceholder"),
        submit: t("form.submit"),
        submitting: t("form.submitting"),
        privacyNotice: t("privacyNotice"),
        privacyPolicy: t("privacyPolicy"),
        feedbackTypes: {
          document_quality: t("form.feedbackTypes.document_quality"),
          feature_request: t("form.feedbackTypes.feature_request"),
          bug_report: t("form.feedbackTypes.bug_report"),
          ai_generation: t("form.feedbackTypes.ai_generation"),
          template_issue: t("form.feedbackTypes.template_issue"),
          account_payment: t("form.feedbackTypes.account_payment"),
          other: t("form.feedbackTypes.other"),
        },
        documentTypes: {
          recommendation_letter: t("form.documentTypes.recommendation_letter"),
          cover_letter: t("form.documentTypes.cover_letter"),
          personal_statement: t("form.documentTypes.personal_statement"),
          sop: t("form.documentTypes.sop"),
          resume: t("form.documentTypes.resume"),
          study_abroad_consultation: t("form.documentTypes.study_abroad_consultation"),
          not_applicable: t("form.documentTypes.not_applicable"),
        },
        satisfactionLevels: {
          very_satisfied: t("form.satisfactionLevels.very_satisfied"),
          satisfied: t("form.satisfactionLevels.satisfied"),
          neutral: t("form.satisfactionLevels.neutral"),
          dissatisfied: t("form.satisfactionLevels.dissatisfied"),
          very_dissatisfied: t("form.satisfactionLevels.very_dissatisfied"),
        }
      }}
    />
  );
}