import { DateTimePicker } from "@/components/LeadForm/DateTimePicker";
import { useState } from "react";

export const Calendario = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateTime = async (date: Date, time: string) => {
        console.log(date, time);

        // só pra teste de UI
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 1500);
    };

    return (
        <DateTimePicker
            onSelect={handleDateTime}
            isLoading={isSubmitting}
        />
    );
};
