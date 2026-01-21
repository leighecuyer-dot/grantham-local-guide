import { Clock, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface OpeningHoursData {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

interface OpeningHoursProps {
  hours: OpeningHoursData;
  className?: string;
  compact?: boolean;
}

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

const FULL_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const OpeningHours = ({ hours, className, compact = false }: OpeningHoursProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayHours = hours[today as keyof OpeningHoursData];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">
          {todayHours ? (
            <>Today: <span className="text-foreground font-medium">{todayHours}</span></>
          ) : (
            "Hours not available"
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm w-full hover:text-primary transition-colors"
      >
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">
          {todayHours ? (
            <>Today: <span className="text-foreground font-medium">{todayHours}</span></>
          ) : (
            "Hours not available"
          )}
        </span>
        <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", expanded && "rotate-180")} />
      </button>
      
      {expanded && (
        <div className="pl-6 space-y-1.5 animate-fade-in">
          {FULL_DAYS.map(({ key, label }) => {
            const dayHours = hours[key as keyof OpeningHoursData];
            const isToday = key === today;
            return (
              <div
                key={key}
                className={cn(
                  "flex justify-between text-sm",
                  isToday && "font-medium text-primary"
                )}
              >
                <span className={isToday ? "text-primary" : "text-muted-foreground"}>
                  {label}
                </span>
                <span className={isToday ? "text-primary" : "text-foreground"}>
                  {dayHours || "Closed"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OpeningHours;
export { DAYS, FULL_DAYS };
