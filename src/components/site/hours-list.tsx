import { hoursLines } from "@/lib/hours";
import type { Business } from "@/lib/repos/types";

/** Opening hours, Monday first. Shows the fallback text until the owner sets hours. */
export function HoursList({ hours, fallback }: { hours: Business["hours"]; fallback: string }) {
  const lines = hoursLines(hours);
  if (!lines) return <p>{fallback}</p>;
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      {lines.map((line) => (
        <div key={line.day} className="contents">
          <dt className="text-bone-500">{line.day}</dt>
          <dd>{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}
