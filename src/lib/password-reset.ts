import { randomInt } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getIsoTimestr } from "@/lib/time";
import { getSupabaseClient } from "@/models/db";

const PASSWORD_RESET_PREFIX = "password_reset:";
const PASSWORD_RESET_EXPIRES_MINUTES = 10;
const PASSWORD_RESET_RESEND_SECONDS = 60;

export function getPasswordResetIdentifier(email: string) {
  return `${PASSWORD_RESET_PREFIX}${email.trim().toLowerCase()}`;
}

export function generatePasswordResetCode() {
  return String(randomInt(0, 1000000)).padStart(6, "0");
}

export async function findPasswordResetVerification(email: string) {
  const supabase = getSupabaseClient();
  const identifier = getPasswordResetIdentifier(email);
  const { data, error } = await supabase
    .from("verification")
    .select("*")
    .eq("identifier", identifier)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createPasswordResetVerification(email: string, code: string) {
  const supabase = getSupabaseClient();
  const identifier = getPasswordResetIdentifier(email);
  const now = new Date();
  const nowIso = getIsoTimestr();
  const expiresAt = new Date(now.getTime() + PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000).toISOString();
  const codeHash = await hashPassword(code);

  await supabase.from("verification").delete().eq("identifier", identifier);

  const { error } = await supabase.from("verification").insert({
    id: uuidv4(),
    identifier,
    value: JSON.stringify({
      email: email.trim().toLowerCase(),
      codeHash,
      type: "password_reset",
    }),
    expires_at: expiresAt,
    created_at: nowIso,
    updated_at: nowIso,
  });

  if (error) {
    throw error;
  }
}

export async function verifyPasswordResetCode(email: string, code: string) {
  const verification = await findPasswordResetVerification(email);
  if (!verification) {
    return { ok: false, reason: "not_found" as const };
  }

  if (new Date(verification.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "expired" as const, verification };
  }

  let parsedValue: { codeHash?: string; type?: string; email?: string } | null = null;
  try {
    parsedValue = JSON.parse(verification.value);
  } catch {
    return { ok: false, reason: "invalid" as const, verification };
  }

  if (
    parsedValue?.type !== "password_reset" ||
    parsedValue?.email !== email.trim().toLowerCase() ||
    !parsedValue?.codeHash
  ) {
    return { ok: false, reason: "invalid" as const, verification };
  }

  const matched = await verifyPassword(code, parsedValue.codeHash);
  if (!matched) {
    return { ok: false, reason: "mismatch" as const, verification };
  }

  return { ok: true as const, verification };
}

export function canResendPasswordResetCode(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() >= PASSWORD_RESET_RESEND_SECONDS * 1000;
}

export const passwordResetConfig = {
  expiresMinutes: PASSWORD_RESET_EXPIRES_MINUTES,
  resendSeconds: PASSWORD_RESET_RESEND_SECONDS,
};
