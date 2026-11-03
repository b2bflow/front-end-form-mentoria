// Cliente da API do formulário na plataforma fluxo (/api/formulario/*).
// VITE_API_URL = https://<fluxo>/api/formulario · VITE_CLIENT_TOKEN = FORM_CLIENT_TOKEN da fluxo.

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const CLIENT_TOKEN = import.meta.env.VITE_CLIENT_TOKEN ?? "";
const TIMEOUT_MS = 20_000;

export type NextAction = "collect_more" | "schedule" | "thank_you";

export interface Utms {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface CreateLeadData {
  name: string;
  phone: string;
  email: string;
  business_name: string | null;
  utms?: Utms;
}

export interface QualifyLeadData {
  challenge: string[];
  customer_stage: string;
}

export interface LeadResponse {
  message: string;
  token: string;
  status: "created" | "updated";
  next_action: NextAction;
  negocio_id: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDay {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface AppointmentResponse {
  success: boolean;
  event_id: string | null;
  meet_link: string | null;
  confirmed_date: string;
  confirmed_time: string;
  expires_at: string;
}

export interface SessionData {
  id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
  meetLink: string | null;
}

/** Erro da API com a mensagem já pronta para mostrar ao lead. */
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown; leadToken?: string | null } = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const headers: Record<string, string> = { "X-Client-Token": CLIENT_TOKEN };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.leadToken) headers["X-Lead-Token"] = init.leadToken;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? "GET",
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = typeof json?.error === "string" ? json.error : "Não conseguimos enviar. Tente novamente.";
      throw new ApiError(msg, res.status);
    }
    return json as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Falha de conexão. Verifique sua internet e tente novamente.", 0);
  } finally {
    clearTimeout(timer);
  }
}

export const createLead = (data: CreateLeadData) =>
  request<LeadResponse>("/leads", { method: "POST", body: data });

export const qualifyLead = (leadToken: string, data: QualifyLeadData) =>
  request<LeadResponse>("/leads", { method: "PUT", body: data, leadToken });

export const getAvailableDays = () => request<AvailableDay[]>("/horarios");

export const createAppointment = (leadToken: string, data: { date: string; time: string }) =>
  request<AppointmentResponse>("/agendamento", { method: "POST", body: data, leadToken });

/** Sessão do lead; null quando o token não vale mais. */
export async function validateSession(leadToken: string): Promise<SessionData | null> {
  try {
    return await request<SessionData>("/sessao", { method: "POST", body: {}, leadToken });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}
