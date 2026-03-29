import { cookies } from "next/headers";

const GUEST_TRIAL_FORM_COOKIE = "guest_trial_form_id";
const GUEST_TRIAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function getGuestTrialFormId() {
  const cookieValue = cookies().get(GUEST_TRIAL_FORM_COOKIE)?.value;
  if (!cookieValue) {
    return null;
  }

  const parsedFormId = Number.parseInt(cookieValue, 10);
  return Number.isNaN(parsedFormId) ? null : parsedFormId;
}

export function hasGuestTrialForm() {
  return getGuestTrialFormId() !== null;
}

export function markGuestTrialFormCreated(formId: number) {
  cookies().set(GUEST_TRIAL_FORM_COOKIE, String(formId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_TRIAL_COOKIE_MAX_AGE_SECONDS,
  });
}

export function isFormOwnedByCurrentVisitor(params: {
  formId: number;
  formUserId: string | null | undefined;
  currentUserId: string | null | undefined;
}) {
  const { formId, formUserId, currentUserId } = params;

  if (currentUserId) {
    return formUserId === currentUserId;
  }

  return !formUserId && getGuestTrialFormId() === formId;
}
