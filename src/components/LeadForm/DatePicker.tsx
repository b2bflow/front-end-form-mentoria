import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface DatePickerProps {
  onSelect: (date: Date) => void;
}

export const DatePicker = ({ onSelect }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>();

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onSelect(selectedDate);
    }
  };

  // Get the current date and set minimum selectable date
  const today = new Date();
  const disabledDays = { before: today };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center mb-4"
    >
      <div className="bg-red rounded-2xl p-6 shadow-xl border border-border max-w-md w-full">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="text-primary" size={20} />
          <span className="font-semibold text-foreground">Selecione a Data</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin size={14} />
          <span>Timezone: America/Sao_Paulo</span>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabledDays}
          locale={ptBR}
          className="rounded-lg pointer-events-auto"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-lg font-semibold text-foreground",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: "h-10 w-10 p-0 font-normal text-foreground hover:bg-primary/20 rounded-lg transition-colors",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
            day_today: "bg-secondary text-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
        />
      </div>
    </motion.div>
  );
};
