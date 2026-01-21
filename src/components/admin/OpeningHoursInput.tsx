import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OpeningHoursData } from "@/components/OpeningHours";

interface OpeningHoursInputProps {
  value: OpeningHoursData;
  onChange: (hours: OpeningHoursData) => void;
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const OpeningHoursInput = ({ value, onChange }: OpeningHoursInputProps) => {
  const handleChange = (day: keyof OpeningHoursData, hours: string) => {
    onChange({
      ...value,
      [day]: hours || undefined,
    });
  };

  return (
    <div className="space-y-3">
      <Label>Opening Hours</Label>
      <div className="grid grid-cols-2 gap-3">
        {DAYS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-20">{label}</span>
            <Input
              placeholder="e.g. 9am-5pm or Closed"
              value={value[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Leave blank for days when hours are unknown. Use "Closed" for closed days.
      </p>
    </div>
  );
};

export default OpeningHoursInput;
