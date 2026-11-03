// Componentes do modelo "convite confidencial" (DESIGN-MAP.md): uma pergunta por
// tela, azul-marinho + dourado, títulos em Cormorant Garamond.
import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

// --- Moldura ------------------------------------------------------------------
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-border/40">
      <motion.div
        className="h-full bg-gold"
        initial={false}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: EASE }}
      />
    </div>
  );
}

export function TopBar({ progress, onBack, canGoBack }: { progress: number; onBack: () => void; canGoBack: boolean }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 bg-background/80 pt-4 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between px-5 pb-2">
        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-gold"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : (
          <span />
        )}
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{progress}%</span>
      </div>
    </div>
  );
}

/** Transição entre telas: entra subindo 12px, sai subindo 8px. */
export function StepTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// --- Tipografia e ornamentos ----------------------------------------------------
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-gold">
      <span className="h-1 w-1 rounded-full bg-gold" />
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-16 bg-gold/40", className)} />;
}

export function QuestionHeader({ eyebrow, question, hint }: { eyebrow?: string; question: string; hint?: string }) {
  return (
    <>
      {eyebrow && <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{eyebrow}</p>}
      <h2 className="mt-3 font-serif text-2xl font-medium leading-tight text-foreground sm:text-3xl">{question}</h2>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p role="alert" className="mt-3 text-xs text-destructive">{children}</p>;
}

// --- Botões -----------------------------------------------------------------------
export function GoldButton({
  children,
  loading,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-lg shadow-gold/10 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// --- Perguntas ----------------------------------------------------------------------
const optionBase = "w-full rounded-lg border px-5 py-4 text-left text-sm leading-snug text-foreground transition-all active:scale-[0.99]";
const optionOff = "border-border/70 bg-card hover:border-gold/60 hover:bg-accent/40";
const optionOn = "border-gold bg-gold/10";

/** Escolha única: clicar já responde e avança. */
export function SingleChoice({
  eyebrow, question, options, value, onSelect, error,
}: {
  eyebrow?: string;
  question: string;
  options: { label: string; value: string }[];
  value?: string;
  onSelect: (value: string) => Promise<void> | void;
  error?: string | null;
}) {
  const [pending, setPending] = useState<string | null>(null);

  async function choose(v: string) {
    if (pending) return;
    setPending(v);
    try {
      await onSelect(v);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col">
      <QuestionHeader eyebrow={eyebrow} question={question} />
      <div className="mt-8 flex flex-col gap-3">
        {options.map((o) => {
          const active = value === o.value || pending === o.value;
          return (
            <button
              key={o.value}
              type="button"
              disabled={!!pending}
              onClick={() => choose(o.value)}
              className={cn("group relative", optionBase, active ? optionOn : optionOff)}
            >
              <span className="block pr-6">{o.label}</span>
              {pending === o.value ? (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold" />
              ) : (
                <span
                  className={cn(
                    "absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all",
                    active ? "bg-gold shadow-[0_0_0_4px_hsl(var(--gold)/0.2)]" : "bg-border group-hover:bg-gold/50",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/** Múltipla escolha com caixa de seleção e botão Continuar. */
export function MultiChoice({
  eyebrow, question, hint, options, value, onSubmit, error,
}: {
  eyebrow?: string;
  question: string;
  hint?: string;
  options: string[];
  value: string[];
  onSubmit: (value: string[]) => Promise<void> | void;
  error?: string | null;
}) {
  const [selected, setSelected] = useState<string[]>(value);
  const [saving, setSaving] = useState(false);

  const toggle = (o: string) => setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  async function submit() {
    if (saving || !selected.length) return;
    setSaving(true);
    try {
      await onSubmit(selected);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <QuestionHeader eyebrow={eyebrow} question={question} hint={hint} />
      <div className="mt-8 flex flex-col gap-3">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              aria-pressed={on}
              className={cn("flex items-center justify-between", optionBase, on ? optionOn : optionOff)}
            >
              <span className="pr-4">{o}</span>
              <span
                aria-hidden
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-all",
                  on ? "border-gold bg-gold text-gold-foreground" : "border-border bg-transparent",
                )}
              >
                {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <GoldButton type="button" onClick={submit} disabled={!selected.length} loading={saving} className="mt-8">
        {saving ? "Salvando..." : "Continuar"}
      </GoldButton>
    </div>
  );
}

/** Campo de texto único (nome, WhatsApp, e-mail, empresa). */
export function TextQuestion({
  eyebrow, question, placeholder, value, type = "text", inputMode, autoComplete, format, validate, onSubmit, submitLabel = "Continuar", error,
}: {
  eyebrow?: string;
  question: string;
  placeholder: string;
  value: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  format?: (v: string) => string;
  /** Mensagem de erro, ou null quando válido. */
  validate: (v: string) => string | null;
  onSubmit: (v: string) => Promise<void> | void;
  submitLabel?: string;
  error?: string | null;
}) {
  const [text, setText] = useState(value);
  const [localError, setLocalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    const v = text.trim();
    const problem = validate(v);
    if (problem) return setLocalError(problem);
    setSaving(true);
    try {
      await onSubmit(v);
    } finally {
      setSaving(false);
    }
  }

  const shown = localError ?? error;
  return (
    <form onSubmit={submit} className="flex flex-col" noValidate>
      <QuestionHeader eyebrow={eyebrow} question={question} />
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={text}
        autoFocus
        maxLength={255}
        onChange={(e) => {
          setText(format ? format(e.target.value) : e.target.value);
          if (localError) setLocalError(null);
        }}
        className="mt-8 w-full rounded-md border border-border/70 bg-card px-4 py-4 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      {shown && <ErrorText>{shown}</ErrorText>}
      <GoldButton type="submit" loading={saving} className="mt-8">
        {saving ? "Enviando..." : submitLabel}
      </GoldButton>
    </form>
  );
}

/** Tela de transição: um parágrafo serifado e um botão. */
export function TransitionScreen({ body, cta, onContinue }: { body: ReactNode; cta: string; onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Divider className="mb-8 bg-gold/50" />
      <p className="font-serif text-xl leading-relaxed text-foreground sm:text-2xl">{body}</p>
      <GoldButton type="button" onClick={onContinue} className="mt-10 max-w-xs">
        {cta}
      </GoldButton>
    </div>
  );
}

/** Círculo dourado com check fino (telas de sucesso). */
export function SuccessIcon() {
  return (
    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/5">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-gold" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
