const UNITS: [number, Intl.RelativeTimeFormatUnit][] = [
  [60, "second"],
  [60, "minute"],
  [24, "hour"],
  [7, "day"],
  [4.34524, "week"],
  [12, "month"],
  [Number.POSITIVE_INFINITY, "year"],
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function relativeTime(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  let diff = (date.getTime() - Date.now()) / 1000;
  for (const [size, unit] of UNITS) {
    if (Math.abs(diff) < size) return rtf.format(Math.round(diff), unit);
    diff /= size;
  }
  return rtf.format(Math.round(diff), "year");
}
