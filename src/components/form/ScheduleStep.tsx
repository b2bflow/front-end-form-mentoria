import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { getAvailableDays, type AvailableDay } from "@/services/fluxoApi";
import { EASE, ErrorText, GoldButton, QuestionHeader } from "./primitives";

interface ScheduleStepProps {
  /** date em YYYY-MM-DD (dia local do calendário, sem conversão de fuso). */
  onConfirm: (date: string, time: string) => Promise<void>;
  error?: string | null;
  /** Muda quando o horário escolhido foi recusado (ocupado): recarrega a agenda. */
  reloadKey?: number;
}

export function ScheduleStep({ onConfirm, error, reloadKey = 0 }: ScheduleStepProps) {
  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setDays(await getAvailableDays());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Não conseguimos carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTime(undefined);
    load();
  }, [load, reloadKey]);

  const slots = useMemo(() => {
    if (!date) return [];
    return days.find((d) => isSameDay(parseISO(d.date), date))?.slots.filter((s) => s.available) ?? [];
  }, [date, days]);

  const firstMonth = days[0] ? parseISO(days[0].date) : undefined;

  async function confirm() {
    if (!date || !time || saving) return;
    setSaving(true);
    try {
      await onConfirm(format(date, "yyyy-MM-dd"), time);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <QuestionHeader
        eyebrow="Agenda"
        question="Escolha o melhor dia e horário para a sua sessão estratégica"
        hint="Horário de Brasília · reunião online de 1 hora pelo Google Meet."
      />

      <div className="mt-8 rounded-lg border border-border/70 bg-card p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            Buscando horários disponíveis...
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <button type="button" onClick={load} className="text-xs uppercase tracking-[0.18em] text-gold hover:brightness-110">
              Tentar novamente
            </button>
          </div>
        ) : !days.length ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Nenhum horário disponível nas próximas semanas. Nosso time vai entrar em contato pelo WhatsApp.
          </p>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={firstMonth}
              onSelect={(d) => {
                setDate(d);
                setTime(undefined);
              }}
              disabled={(d) => !days.some((day) => isSameDay(parseISO(day.date), d))}
              locale={ptBR}
              className="w-full p-0"
              classNames={{
                months: "flex flex-col",
                month: "w-full space-y-4",
                caption: "relative flex items-center justify-center pt-1",
                caption_label: "font-serif text-xl font-medium capitalize text-foreground",
                nav: "flex items-center space-x-1",
                nav_button: "h-8 w-8 rounded-md p-0 text-muted-foreground transition-colors hover:text-gold",
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse",
                head_row: "grid grid-cols-7",
                head_cell: "text-center text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground",
                row: "mt-2 grid grid-cols-7 gap-1",
                cell: "relative aspect-square w-full p-0 text-center text-sm",
                day: "h-full w-full rounded-md p-0 font-normal text-foreground transition-colors hover:bg-gold/15",
                day_selected: "!bg-gold font-semibold !text-gold-foreground",
                day_today: "border border-gold/40",
                day_outside: "opacity-0 pointer-events-none",
                day_disabled: "cursor-not-allowed text-muted-foreground opacity-25 hover:bg-transparent",
                day_hidden: "invisible",
              }}
            />

            {date && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-6 border-t border-border/70 pt-5"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Horários em {format(date, "EEEE, dd/MM", { locale: ptBR })}
                </p>
                {slots.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        type="button"
                        onClick={() => setTime(s.time)}
                        className={cn(
                          "rounded-md border py-3 text-sm transition-all active:scale-[0.98]",
                          time === s.time
                            ? "border-gold bg-gold/10 text-foreground"
                            : "border-border/70 bg-background/40 text-foreground hover:border-gold/60",
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Nenhum horário livre nesta data.</p>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <GoldButton type="button" onClick={confirm} disabled={!date || !time} loading={saving} className="mt-8">
        {saving
          ? "Confirmando..."
          : date && time
            ? `Confirmar · ${format(date, "dd/MM")} às ${time}`
            : "Confirmar agendamento"}
      </GoldButton>
    </div>
  );
}
