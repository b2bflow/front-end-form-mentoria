import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Building2, Mail, Phone, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadData {
  nome: string;
  telefone: string;
  email: string;
  empresa: string;
  desafio: string;
  momento: string;
  investimento: string;
  dataAgendada: Date;
  horaAgendada: string;
}

interface SuccessMessageProps {
  data: LeadData;
}

export const SuccessMessage = ({ data }: SuccessMessageProps) => {
  const formattedDate = format(
    data.dataAgendada,
    "EEEE, dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-xl border border-white"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-secondary/50 rounded-full p-3"
        >
          <CheckCircle2 className="text-white" size={40} />
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-foreground text-center mb-2">
        Agendamento Confirmado!
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        {data.nome}, sua sessão estratégica está marcada!
      </p>

      <div className="space-y-3 bg-secondary/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-white" size={18} />
          <div>
            <p className="text-xs text-muted-foreground">Data</p>
            <p className="text-foreground font-semibold capitalize text-sm">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="text-white" size={18} />
          <div>
            <p className="text-xs text-muted-foreground">Horário</p>
            <p className="text-foreground font-semibold text-sm">
              {data.horaAgendada}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="text-white" size={18} />
          <div>
            <p className="text-xs text-muted-foreground">Empresa</p>
            <p className="text-foreground font-semibold text-sm">{data.empresa}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-white" size={18} />
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="text-foreground font-semibold text-sm">{data.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-white" size={18} />
          <div>
            <p className="text-xs text-muted-foreground">Telefone</p>
            <p className="text-foreground font-semibold text-sm">{data.telefone}</p>
          </div>
        </div>
      </div>

      {/* <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/30">
        <p className="text-sm text-foreground text-center">
          💰 <strong>Economia estimada:</strong> R$ 8.000 a R$ 15.000/mês com IA
        </p>
      </div> */}
    </motion.div>
  );
};
