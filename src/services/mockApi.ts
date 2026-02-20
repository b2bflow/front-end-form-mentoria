// Mock API service simulating external backend calls

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  business_name: string;
  challenge: string | string[];
  customer_stage: string;
  // investment_capacity: string;
  type_lead: string;
}

export interface CreateLeadData {
  name: string;
  phone: string;
  email: string;
  business_name: string;
  type_lead: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDay {
  date: string; // ISO date string (YYYY-MM-DD)
  slots: TimeSlot[];
}

export interface CreateLeadResponse {
  success: boolean;
  token: string;
  leadId: string;
}

export interface AppointmentData {
  leadToken: string;
  date: string;
  time: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  eventId: string;
  expiretedDate: string;
  confirmedDate: string;
  confirmedTime: string;
}

export interface SessionData {
  leadId: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  appointmentDate: string;
  appointmentTime: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock available days for the next 30 days
const generateMockAvailableDays = (): AvailableDay[] => {
  const days: AvailableDay[] = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Random availability (80% of days are available)
    if (Math.random() > 0.2) {
      const slots: TimeSlot[] = [];
      const possibleTimes = [
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];

      possibleTimes.forEach((time) => {
        // Random slot availability (70% of slots are available)
        slots.push({
          time,
          available: Math.random() > 0.3,
        });
      });

      // Only add day if it has at least one available slot
      if (slots.some((s) => s.available)) {
        days.push({
          date: date.toISOString().split("T")[0],
          slots,
        });
      }
    }
  }

  return days;
};

// Mock: Create lead and return session token
export const createLead = async (data: CreateLeadData): Promise<CreateLeadResponse> => {
  const API_URL = import.meta.env.VITE_API_URL;

  console.log('emvoamdp dadoso',data)

  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': import.meta.env.VITE_CLIENT_TOKEN,
      },
      body: JSON.stringify(data),
    });

    console.log("[Mock API] Response:", response);

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar lead:", error);
    throw error;
  }
};

export const updateLead = async (data: LeadData): Promise<void> => {
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': import.meta.env.VITE_CLIENT_TOKEN,
      },
      body: JSON.stringify(data),
    });

    console.log("[Mock API] Response:", response);

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    throw error;
  }
}

// Mock: Get available days from Google Calendar
export const getAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/appointment`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': import.meta.env.VITE_CLIENT_TOKEN,
      },
    }
  );
  if (!response.ok) throw new Error('Erro ao buscar agenda');
  return await response.json();
};

export const createAppointment = async (
  data: AppointmentData
): Promise<CreateAppointmentResponse> => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}/appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Token': import.meta.env.VITE_CLIENT_TOKEN,
    },
    body: JSON.stringify(data),
  });

  const eventId = `evt_${Math.random().toString(36).substr(2, 9)}`;

  if (response.ok) {
    return {
      success: true,
      eventId,
      expiretedDate: data.date,
      confirmedDate: data.date,
      confirmedTime: data.time,
    };
  }

  throw new Error('Erro ao criar Evento');
};

export const validateSession = async (token: string): Promise<SessionData | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': import.meta.env.VITE_CLIENT_TOKEN,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const session: SessionData = {
      leadId: data.id,
      nome: data.name,
      empresa: data.business_name || "Não informada",
      email: data.email,
      telefone: data.phone,
      appointmentDate: data.appointmentDate || "",
      appointmentTime: data.appointmentTime || ""
    };

    console.log("[API] Sessão validada e mapeada:", session);

    return session;

  } catch (error) {
    console.error("[API] Erro ao validar sessão:", error);
    return null;
  }
};
