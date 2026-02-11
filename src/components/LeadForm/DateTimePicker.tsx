import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin, Clock, Loader2 } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format, parseISO, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { getAvailableDays, AvailableDay, TimeSlot } from "@/services/mockApi";

interface DateTimePickerProps {
  onSelect: (date: Date, time: string) => void;
  isLoading?: boolean;
}

export const DateTimePicker = ({ onSelect, isLoading = false }: DateTimePickerProps) => {
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const days = await getAvailableDays();
        console.log(days);
        setAvailableDays(days);
      } catch (error) {
        console.error("Error fetching available days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const availableDates = availableDays.map((d) => parseISO(d.date));

  const isDateAvailable = (date: Date) => {
    return availableDates.some((availableDate) => isSameDay(date, availableDate));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    setSelectedTime(undefined);

    const dayData = availableDays.find((d) =>
      isSameDay(parseISO(d.date), date)
    );

    if (dayData) {
      setAvailableSlots(dayData.slots.filter((s) => s.available));
    } else {
      setAvailableSlots([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
  };

  const today = new Date();

  // Disable dates that are not in the available list
  const disabledMatcher = (date: Date) => {
    if (date < today) return true;
    return !isDateAvailable(date);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-4"
      >
        <div className="bg-card rounded-2xl p-6 shadow-xl border border-border max-w-md w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-primary mr-2" size={24} />
          <span className="text-muted-foreground">Buscando horários disponíveis...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mb-4"
    >
      <div className="bg-card rounded-2xl p-6 shadow-xl border border-white w-full max-w-none">

        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="color-white" size={20} />
          <span className="font-semibold text-foreground">Selecione a Data</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin size={14} />
          <span>Timezone: America/Sao_Paulo</span>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={disabledMatcher}
          locale={ptBR}
          className="rounded-lg pointer-events-auto w-full"
          classNames={{
            months: "flex flex-col",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-lg font-semibold text-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",

            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell: "text-muted-foreground rounded-md text-center font-normal text-[0.8rem]",

            row: "grid grid-cols-7 mt-2",

            cell: "aspect-square w-full text-center text-sm p-0 relative",
            day: "w-full h-full p-0 font-normal text-foreground hover:bg-primary/20 rounded-lg transition-colors",

            day_selected: "bg-primary text-primary-foreground font-semibold",
            day_today: "bg-secondary text-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
            day_hidden: "invisible",
          }}
        />

        {/* Time Slots */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-6 border-t border-border pt-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-primary" size={18} />
              <span className="font-semibold text-foreground text-sm">
                Horários disponíveis em {format(selectedDate, "dd/MM", { locale: ptBR })}
              </span>
            </div>

            {availableSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum horário disponível para esta data.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedTime === slot.time
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-primary/20"
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Confirm Button */}
        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Confirmando...
                </>
              ) : (
                <>Confirmar Agendamento - {format(selectedDate, "dd/MM", { locale: ptBR })} às {selectedTime}</>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
