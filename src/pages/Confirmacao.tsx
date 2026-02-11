import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Building2, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/LeadForm/Header";
import { getSessionCookie, clearSessionCookie } from "@/utils/cookies";
import { validateSession, SessionData } from "@/services/mockApi";
import { Button } from "@/components/ui/button";

const Confirmacao = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = getSessionCookie();

      console.log(token);

      if (!token) {
        console.log("Nenhuma sessão encontrada");
        navigate("/");
        return;
      }

      const data = await validateSession(token);

      if (!data) {
        console.log("Sessão inválida");
        clearSessionCookie();
        navigate("/");
        return;
      }

      setSessionData(data);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleNewAppointment = () => {
    console.log("Sessão inválida");
    clearSessionCookie();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!sessionData) return null;

  const formattedDate = format(
    parseISO(sessionData.appointmentDate),
    "EEEE, dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="bg-black rounded-2xl p-8 shadow-xl border border-white">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-secondary/50 rounded-full p-4">
                <CheckCircle2 className="text-white" size={48} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              Agendamento Confirmado!
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Olá, {sessionData.nome}! Sua sessão estratégica já está marcada.
            </p>

            <div className="space-y-4 bg-secondary/50 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-white" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="text-foreground font-semibold capitalize">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-white" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="text-foreground font-semibold">
                    {sessionData.appointmentTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="text-white" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="text-foreground font-semibold">
                    {sessionData.empresa}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-white" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="text-foreground font-semibold">
                    {sessionData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-white" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground font-semibold">
                    {sessionData.telefone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Confirmacao;
