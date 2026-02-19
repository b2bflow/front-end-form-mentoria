import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ChatMessage } from "./ChatMessage";
import { TextInput } from "./TextInput";
import { OptionButtons } from "./OptionButtons";
import { DateTimePicker } from "./DateTimePicker";
import { SuccessMessage } from "./SuccessMessage";
import { getSessionCookie, setSessionCookie } from "@/utils/cookies";
import { createLead, createAppointment, LeadData, updateLead, CreateLeadData } from "@/services/mockApi";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

interface LeadFormData {
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

type Step =
  | "nome"
  | "telefone"
  | "email"
  | "temEmpresa"
  | "empresa"
  | "desafio"
  | "momento"
  | "investimento"
  | "success"
  | "data";

const desafio = ["Consumo muitos tutoriais, mas não sei qual stack de ferramentas realmente gera lucro e escala.", "Tenho medo de fechar um contrato e não saber estruturar um fluxo que funcione no mundo real sem quebrar.", "Não sei como cobrar o valor justo ou demonstrar o ROI da solução de IA para o cliente.", "Sinto que o que eu faço qualquer um faz com o ChatGPT; preciso criar Agentes de Elite que resolvam problemas complexos.", "Não tenho um método para prospectar leads qualificados e dependo apenas de indicações esporádicas.", "Já vendo alguns projetos, mas a entrega consome todo o meu tempo e não consigo escalar meu faturamento."];

const momento = ["Trabalho em outra área, mas quero aproveitar o boom da IA para construir minha liberdade financeira e migrar de carreira.", "Já sou dono de agência (marketing, software, etc) e preciso integrar IA urgentemente para não perder mercado.", "Faço alguns freelas de automação, mas sinto que sou visto como um amador e quero me tornar uma referência de elite.", "Tenho facilidade técnica, mas percebi que preciso aprender a vender e gerir um negócio de IA para ganhar dinheiro de verdade.", "Sou sócio/gestor de uma empresa e quero aprender o método para implementar soluções internas e reduzir custos.", "Domino a técnica e quero estruturar meu conhecimento para ensinar outros, mas me falta o método de escala."];
const investimento = [
"Entendo o valor de um método testado e o investimento está totalmente dentro do meu planejamento para crescer agora",
"Tenho o capital, mas meu foco é validar como este acompanhamento vai acelerar meu ROI",
"Tenho prioridade total em resolver isso, mas precisaria de opções de parcelamento",
"Reconheço que preciso de ajuda, mas no momento não possuo recurso financeiro para investir em uma mentoria profissional."
];


export const LeadFormChat = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("nome");
  const [leadData, setLeadData] = useState<Partial<LeadFormData>>({});
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; key: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadToken, setLeadToken] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = getSessionCookie();
    if (token) {
      navigate("/confirmacao");
    }
  }, [navigate]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { text, isUser, key: `${Date.now()}-${isUser}` }]);
  };

  useEffect(() => {
    // Initial greeting
    addMessage(
      "Bem-vindo! 👋 Em poucos passos, vou montar um Plano Estratégico para aumentar seu faturamento com IA",
      false
    );
    setTimeout(() => {
      addMessage("Então bora começar! Qual seu nome?", false);
    }, 500);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step]);

  const handleNome = (nome: string) => {
    setLeadData((prev) => ({ ...prev, nome }));
    addMessage(nome, true);
    setTimeout(() => {
      addMessage(`Prazer, ${nome}! Qual seu telefone?`, false);
      setStep("telefone");
    }, 400);
  };

  const handleTelefone = (telefone: string) => {
    setLeadData((prev) => ({ ...prev, telefone }));
    addMessage(telefone, true);
    setTimeout(() => {
      addMessage("Ótimo! E qual seu e-mail?", false);
      setStep("email");
    }, 400);
  };

  const handleEmail = (email: string) => {
    setLeadData((prev) => ({ ...prev, email }));
    addMessage(email, true);
    setTimeout(() => {
      addMessage("Ótimo! Você possui uma empresa?", false);
      setStep("temEmpresa");
    }, 400);
  };

  const handleTemEmpresa = (temEmpresa: string) => {
    setLeadData((prev) => ({ ...prev, temEmpresa }));
    addMessage(temEmpresa, true);
    console.log(temEmpresa)
    setTimeout(() => {
      if (temEmpresa === "sim") {
        addMessage("Perfeito! Qual o nome da sua empresa?", false);
        setStep("empresa");
      } else {
        addMessage("Perfeito! Qual seu maior desafio hoje?", false);
        setStep("desafio");
      }
    }, 400);
  };

  const handleDesafio = async (desafio: string) => {

    if (leadData.empresa == undefined) {
      leadData.empresa = leadData.nome
    }

    const currentLeadData: CreateLeadData = {
      name: leadData.nome!,
      phone: leadData.telefone!,
      email: leadData.email!,
      business_name: leadData.empresa!,
      type_lead: "consultoria"
    };

    try {
      const response = await createLead(currentLeadData);
      console.log(response);
      console.log('token',response.token);
      setLeadToken(response.token);

      setLeadData((prev) => ({ ...prev, desafio }));
      addMessage(desafio, true);
      setTimeout(() => {
        addMessage("Perfeito! Qual o momento da sua empresa?", false);
        setStep("momento");
      }, 400);

    } catch (error) {
      console.error("Error creating lead:", error);
      addMessage("Ocorreu um erro. Por favor, tente novamente.", false);
    }
  };

  const handleEmpresa = async (empresa: string) => {
    setLeadData((prev) => ({ ...prev, empresa }));
    addMessage(empresa, true);
    setTimeout(() => {
        addMessage(
          `${empresa}! É sempre um prazer conhecer empresas assim. A IA pode trazer um diferencial incrível para vocês. Qual o segmento da sua empresa?`,
          false
        );
        setStep("desafio");
      }, 400);
  };

  const handleMomento = (momento: string) => {
    setLeadData((prev) => ({ ...prev, momento }));
    addMessage(momento, true);
    setTimeout(() => {
      addMessage("o valor médio do acompanhanto é de R$ 6.000, como você identifica esse investimento?", false);
      setStep("investimento");
    }, 400);
  };

  const handleInvestimento = async (investimento: string) => {
    setLeadData((prev) => ({ ...prev, investimento }));
    addMessage(investimento, true);

    const currentLeadData: LeadData = {
      name: leadData.nome!,
      phone: leadData.telefone!,
      email: leadData.email!,
      business_name: leadData.empresa!,
      challenge: leadData.desafio!,
      customer_stage: leadData.momento!,
      investment_capacity: investimento,
      type_lead: "consultoria"
    };

    try {
      await updateLead(currentLeadData);

      setTimeout(() => {
        addMessage(
          `${leadData.nome}, Obrigado por responder! Isso nos ajuda bastante a entender seu cenário e pensar na melhor forma de te apoiar para extrair o máximo desse investimento. 🚀`,
          false
        );
        setTimeout(() => {
          addMessage(
            "Agende abaixo o melhor dia e horário para falar com a nossa equipe e garantir sua sessão estratégica!",
            false
          );
          setStep("data");
        }, 600);
      }, 400);
    } catch (error) {
      console.error("Error creating lead:", error);
      addMessage("Ocorreu um erro. Por favor, tente novamente.", false);
    }

    setTimeout(() => {
      addMessage("Vamos marcar nosso encontro?", false);
      setStep("data");
    }, 400);
  };

  const handleDateTime = async (date: Date, time: string) => {
    if (!leadToken) return;

    setIsSubmitting(true);

    try {
      const appointmentResponse = await createAppointment({
        leadToken,
        date: date.toISOString().split("T")[0],
        time,
      });

      console.log('appointment',appointmentResponse);

      if (appointmentResponse.success) {
        // Save session cookie
        setSessionCookie(leadToken, new Date(appointmentResponse.expiretedDate));

        setLeadData((prev) => ({
          ...prev,
          dataAgendada: date,
          horaAgendada: time,
        }));
        setStep("success");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      addMessage("Ocorreu um erro ao agendar. Por favor, tente novamente.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header />

        <div
          ref={scrollRef}
          className="space-y-2 max-h-[60vh] overflow-y-auto scroll-smooth pr-2"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.key} isUser={msg.isUser} delay={0}>
              {msg.text}
            </ChatMessage>
          ))}
        </div>

        <div className="mt-6">
          {step === "nome" && (
            <TextInput placeholder="Digite seu nome..." onSubmit={handleNome} />
          )}
          {step === "telefone" && (
            <TextInput
              placeholder="+55 (00) 00000-0000"
              onSubmit={handleTelefone}
              type="tel"
            />
          )}
          {step === "email" && (
            <TextInput
              placeholder="seu@email.com"
              onSubmit={handleEmail}
              type="email"
            />
          )}
          {step === "temEmpresa" && (
            <OptionButtons options={["sim", "nao"]} onSelect={handleTemEmpresa} />
          )}
          {step === "empresa" && (
            <TextInput placeholder="Nome da empresa..." onSubmit={handleEmpresa} />
          )}
          {step === "desafio" && (
            <OptionButtons options={desafio} onSelect={handleDesafio} />
          )}
          {step === "momento" && (
            <OptionButtons options={momento} onSelect={handleMomento} />
          )}
          {step === "investimento" && (
            <OptionButtons options={investimento} onSelect={handleInvestimento} />
          )}
          {step === "data" && (
            <DateTimePicker onSelect={handleDateTime} isLoading={isSubmitting} />
          )}
          {step === "success" && leadData.dataAgendada && leadData.horaAgendada && (
            <SuccessMessage
              data={{
                nome: leadData.nome!,
                telefone: leadData.telefone!,
                email: leadData.email!,
                empresa: leadData.empresa!,
                desafio: leadData.desafio!,
                momento: leadData.momento!,
                investimento: leadData.investimento!,
                dataAgendada: leadData.dataAgendada,
                horaAgendada: leadData.horaAgendada,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
