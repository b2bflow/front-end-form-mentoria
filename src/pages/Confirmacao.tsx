import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BookingConfirmed } from "@/components/form/LeadFlow";
import { StepTransition } from "@/components/form/primitives";
import { getSessionCookie, clearSessionCookie } from "@/utils/cookies";
import { validateSession, type SessionData } from "@/services/fluxoApi";

const Confirmacao = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getSessionCookie();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    validateSession(token)
      .then((data) => {
        // Token vencido ou reunião já realizada/cancelada: começa de novo.
        if (!data || !data.appointmentDate || !data.appointmentTime) {
          clearSessionCookie();
          navigate("/", { replace: true });
          return;
        }
        setSession(data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Não conseguimos carregar seu agendamento."));
  }, [navigate]);

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-gold" />
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-20 sm:items-center sm:pt-24">
        <div className="w-full max-w-xl">
          {session ? (
            <StepTransition>
              <BookingConfirmed
                nome={session.name}
                email={session.email}
                booking={{ date: session.appointmentDate!, time: session.appointmentTime! }}
              />
            </StepTransition>
          ) : error ? (
            <p className="text-center text-sm text-muted-foreground">{error}</p>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
              Carregando seu agendamento...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Confirmacao;
