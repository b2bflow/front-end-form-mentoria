import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import logoInsider from "@/assets/logo_insider.png";
import { ApiError, createAppointment, createLead, qualifyLead } from "@/services/fluxoApi";
import { getSessionCookie, setSessionCookie } from "@/utils/cookies";
import { isValidPhone, maskPhone } from "@/utils/phone";
import { captureUtms } from "@/utils/utm";
import { trackRegistration } from "@/utils/tracking";
import { ScheduleStep } from "./ScheduleStep";
import {
  Divider, GoldButton, MultiChoice, Pill, ProgressBar, SingleChoice, StepTransition, SuccessIcon, TextQuestion, TopBar,
  TransitionScreen,
} from "./primitives";

const DESAFIOS = [
  "Consumo muitos tutoriais, mas não sei qual stack de ferramentas realmente gera lucro e escala.",
  "Tenho medo de fechar um contrato e não saber estruturar um fluxo que funcione no mundo real sem quebrar.",
  "Não sei como cobrar o valor justo ou demonstrar o ROI da solução de IA para o cliente.",
  "Sinto que o que eu faço qualquer um faz com o ChatGPT; preciso criar Agentes de Elite que resolvam problemas complexos.",
  "Não tenho um método para prospectar leads qualificados e dependo apenas de indicações esporádicas.",
  "Já vendo alguns projetos, mas a entrega consome todo o meu tempo e não consigo escalar meu faturamento.",
];

const MOMENTOS = [
  "Trabalho em outra área, mas quero aproveitar o boom da IA para construir minha liberdade financeira e migrar de carreira.",
  "Já sou dono de agência (marketing, software, etc) e preciso integrar IA urgentemente para não perder mercado.",
  "Faço alguns freelas de automação, mas sinto que sou visto como um amador e quero me tornar uma referência de elite.",
  "Tenho facilidade técnica, mas percebi que preciso aprender a vender e gerir um negócio de IA para ganhar dinheiro de verdade.",
  "Sou sócio/gestor de uma empresa e quero aprender o método para implementar soluções internas e reduzir custos.",
  "Domino a técnica e quero estruturar meu conhecimento para ensinar outros, mas me falta o método de escala.",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ordem: perguntas sobre a pessoa e o negócio → "análise quase pronta" → contato → agenda.
type StepId =
  | "welcome" | "temEmpresa" | "empresa" | "desafio" | "momento" | "quasePronto"
  | "nome" | "whatsapp" | "email" | "transicao" | "agenda" | "final";

/** Passos que contam na barra de progresso (a empresa só conta quando perguntada). */
const PROGRESS_STEPS: StepId[] = ["temEmpresa", "empresa", "desafio", "momento", "nome", "whatsapp", "email", "agenda"];

interface Answers {
  nome: string;
  whatsapp: string;
  email: string;
  temEmpresa?: "sim" | "nao";
  empresa: string;
  desafios: string[];
  momento?: string;
}

interface Booking {
  date: string;
  time: string;
}

const firstName = (nome: string) => nome.trim().split(/\s+/)[0] ?? nome;
const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Não conseguimos enviar. Tente novamente.");

export function LeadFlow() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<StepId[]>(["welcome"]);
  const [answers, setAnswers] = useState<Answers>({ nome: "", whatsapp: "", email: "", empresa: "", desafios: [] });
  const [leadToken, setLeadToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [scheduleReload, setScheduleReload] = useState(0);
  const utms = useMemo(captureUtms, []);

  const step = history[history.length - 1];

  // Quem já agendou volta direto para a confirmação.
  useEffect(() => {
    if (getSessionCookie()) navigate("/confirmacao", { replace: true });
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const go = (next: StepId) => {
    setError(null);
    setHistory((h) => [...h, next]);
  };
  const back = () => {
    setError(null);
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  };
  const save = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));

  const progress = useMemo(() => {
    if (step === "welcome") return 0;
    if (step === "final") return 100;
    const counted = PROGRESS_STEPS.filter((s) => s !== "empresa" || answers.temEmpresa === "sim");
    const done = counted.filter((s) => history.includes(s) && s !== step).length;
    return Math.max(4, Math.round((done / counted.length) * 100));
  }, [step, history, answers.temEmpresa]);

  // --- Integração com a plataforma fluxo ------------------------------------
  /**
   * Depois do e-mail (último dado de contato): cadastra o lead no CRM e, em
   * seguida, registra as respostas. Reenvio é seguro — a fluxo deduplica pelo
   * telefone e não repete a mesma nota.
   */
  async function submitLead(email: string) {
    const a = { ...answers, email };
    try {
      const lead = await createLead({
        name: a.nome,
        phone: a.whatsapp,
        email: a.email,
        business_name: a.temEmpresa === "sim" ? a.empresa : null,
        utms,
      });
      const q = await qualifyLead(lead.token, { challenge: a.desafios, customer_stage: a.momento! });
      setLeadToken(q.token);
      trackRegistration();
      go("transicao");
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  async function submitBooking(date: string, time: string) {
    if (!leadToken) return setError("Sua sessão expirou. Volte e reenvie seus dados.");
    setError(null);
    try {
      const r = await createAppointment(leadToken, { date, time });
      setSessionCookie(leadToken, new Date(r.expires_at));
      setBooking({ date: r.confirmed_date, time: r.confirmed_time });
      go("final");
    } catch (e) {
      setError(errorMessage(e));
      if (e instanceof ApiError && e.status === 409) setScheduleReload((n) => n + 1);
    }
  }

  // --- Telas -----------------------------------------------------------------
  function renderStep() {
    switch (step) {
      case "welcome":
        return (
          <div className="flex flex-col items-center text-center">
            <img src={logoInsider} alt="AI Insider Club" className="mb-8 h-12 w-12 rounded-lg object-cover opacity-90" />
            <Pill>Sessão Estratégica</Pill>
            <h1 className="font-serif text-4xl font-medium leading-[1.1] text-foreground sm:text-5xl">
              Plano Estratégico
              <span className="mt-2 block text-gold">Faturamento com IA</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Em poucos passos, entendemos o seu momento e montamos um plano para você transformar conhecimento em IA em
              faturamento recorrente e escalável.
            </p>
            <Divider className="mt-8" />
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Leva 2 minutos. Ao final, você agenda sua sessão estratégica com o time do AI Insider Club.
            </p>
            <GoldButton type="button" onClick={() => go("temEmpresa")} className="mt-8 max-w-xs">
              Começar
            </GoldButton>
          </div>
        );

      case "nome":
        return (
          <TextQuestion
            eyebrow="Contato · 1/3"
            question="Qual é o seu nome?"
            placeholder="Nome completo"
            autoComplete="name"
            value={answers.nome}
            validate={(v) => (v.length < 2 ? "Digite seu nome completo." : null)}
            onSubmit={(nome) => {
              save({ nome });
              go("whatsapp");
            }}
          />
        );

      case "whatsapp":
        return (
          <TextQuestion
            eyebrow="Contato · 2/3"
            question={`Prazer, ${firstName(answers.nome)}! Qual é o seu WhatsApp?`}
            placeholder="(11) 91234-5678"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            format={maskPhone}
            value={answers.whatsapp}
            validate={(v) => (isValidPhone(v) ? null : "Digite um WhatsApp válido — (XX) XXXXX-XXXX.")}
            onSubmit={(whatsapp) => {
              save({ whatsapp });
              go("email");
            }}
          />
        );

      case "email":
        return (
          <TextQuestion
            eyebrow="Contato · 3/3"
            question="Qual é o seu melhor e-mail?"
            placeholder="voce@exemplo.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={answers.email}
            validate={(v) => (EMAIL.test(v) ? null : "Digite um e-mail válido.")}
            submitLabel="Ver meu resultado"
            error={error}
            onSubmit={async (v) => {
              const email = v.toLowerCase();
              save({ email });
              await submitLead(email);
            }}
          />
        );

      case "temEmpresa":
        return (
          <SingleChoice
            eyebrow="Perfil"
            question="Você possui uma empresa?"
            options={[
              { label: "Sim, tenho uma empresa", value: "sim" },
              { label: "Não, ainda não", value: "nao" },
            ]}
            value={answers.temEmpresa}
            onSelect={(v) => {
              const temEmpresa = v as "sim" | "nao";
              save({ temEmpresa });
              go(temEmpresa === "sim" ? "empresa" : "desafio");
            }}
          />
        );

      case "empresa":
        return (
          <TextQuestion
            eyebrow="Perfil"
            question="Qual é o nome da sua empresa?"
            placeholder="Nome da empresa"
            autoComplete="organization"
            value={answers.empresa}
            validate={(v) => (v.length < 2 ? "Digite o nome da empresa." : null)}
            onSubmit={(empresa) => {
              save({ empresa });
              go("desafio");
            }}
          />
        );

      case "desafio":
        return (
          <MultiChoice
            eyebrow="Desafios"
            question="Quais destes gargalos mais impedem você de transformar IA em faturamento recorrente?"
            hint="Selecione todos que se aplicam."
            options={DESAFIOS}
            value={answers.desafios}
            onSubmit={(desafios) => {
              save({ desafios });
              go("momento");
            }}
          />
        );

      case "momento":
        return (
          <SingleChoice
            eyebrow="Momento"
            question="Qual destas opções melhor descreve o seu momento hoje?"
            options={MOMENTOS.map((m) => ({ label: m, value: m }))}
            value={answers.momento}
            onSelect={(momento) => {
              save({ momento });
              go("quasePronto");
            }}
          />
        );

      case "quasePronto":
        return (
          <TransitionScreen
            body="Sua análise está quase pronta. Só precisamos saber pra quem enviar o resultado."
            cta="Continuar"
            onContinue={() => go("nome")}
          />
        );

      case "transicao":
        return (
          <TransitionScreen
            body={`Pronto, ${firstName(answers.nome)}. Recebemos sua análise — agora é só escolher o melhor horário para a sua sessão estratégica, onde apresentamos o seu resultado.`}
            cta="Escolher horário"
            onContinue={() => go("agenda")}
          />
        );

      case "agenda":
        return <ScheduleStep onConfirm={submitBooking} error={error} reloadKey={scheduleReload} />;

      case "final":
        return booking ? <BookingConfirmed nome={answers.nome} email={answers.email} booking={booking} /> : null;
    }
  }

  const chrome = step !== "welcome" && step !== "final";
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <ProgressBar value={progress} />
      {chrome && <TopBar progress={progress} onBack={back} canGoBack={history.length > 1} />}
      <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-20 sm:items-center sm:pt-24">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <StepTransition key={step}>{renderStep()}</StepTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export function BookingConfirmed({ nome, email, booking }: { nome: string; email: string | null; booking: Booking }) {
  const quando = format(parseISO(booking.date), "EEEE, dd 'de' MMMM", { locale: ptBR });
  return (
    <div className="flex flex-col items-center text-center">
      <SuccessIcon />
      <h2 className="font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">Sessão confirmada.</h2>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {firstName(nome)}, sua sessão estratégica está marcada para{" "}
        <span className="text-foreground">
          {quando} às {booking.time}
        </span>{" "}
        (horário de Brasília).
      </p>
      <ul className="mt-6 flex flex-col gap-3 text-left text-sm text-foreground/90">
        <li className="flex gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
          <span>{email ? `O convite com o link do Google Meet foi enviado para ${email}.` : "Você receberá o link do Google Meet."}</span>
        </li>
        <li className="flex gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
          <span>No dia, enviamos o link também pelo WhatsApp.</span>
        </li>
        <li className="flex gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
          <span>Chegue com suas dúvidas: a sessão é sobre o seu cenário.</span>
        </li>
      </ul>
      <Divider className="mt-10" />
      <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Obrigado pela confiança</p>
    </div>
  );
}
