// Cookie de sessão do lead (token assinado pela plataforma fluxo).

const COOKIE_NAME = "b2bflow_session";

export const setSessionCookie = (token: string, expiresAt: Date): void => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Strict${secure}`;
};

export const getSessionCookie = (): string | null => {
  for (const cookie of document.cookie.split(";")) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === COOKIE_NAME && rest.length) return decodeURIComponent(rest.join("="));
  }
  return null;
};

export const clearSessionCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
