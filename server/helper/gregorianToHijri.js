import HijriDate from "hijri-date/lib/safe";

export function gregorianToHijri(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const hijri = new HijriDate(new Date(year, month - 1, day));
  return `${hijri.getFullYear()}-${String(hijri.getMonth() + 1).padStart(2, '0')}-${String(hijri.getDate()).padStart(2, '0')}`;
} 