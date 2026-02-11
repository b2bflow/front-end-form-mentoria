// Cookie utility functions for session management

const COOKIE_NAME = "b2bflow_session";
const COOKIE_EXPIRY_DAYS = 30;

export const setSessionCookie = (token: string, expiryDate: Date ): void => {
  expiryDate.setDate(expiryDate.getDate());

  document.cookie = `${COOKIE_NAME}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  console.log("[Cookie] Session saved:", token);
};

export const getSessionCookie = (): string | null => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === COOKIE_NAME && value) {
      return value;
    }
  }

  return null;
};

export const clearSessionCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log("[Cookie] Session cleared");
};
