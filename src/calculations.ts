import { Apartment } from './types';

// Vypočíta celkové mesačné náklady (družstvo + elektrina + plyn + ostatné)
export function calcMonthlyCosts(row: Apartment): number {
  const druzstvo = row.Druzstvo_EUR ?? 0;
  const elektrina = row.Elektrina_EUR ?? 0;
  const plyn = row.Plyn_EUR ?? 0;
  const ostatne = row.Ostatne_naklady_EUR ?? 0;
  
  return druzstvo + elektrina + plyn + ostatne;
}

// Vypočíta mesačný cashflow (nájom - náklady - splátka)
export function calcMonthlyCashflow(row: Apartment): number {
  const najom = row.Najom_brutto_EUR ?? 0;
  const naklady = calcMonthlyCosts(row);
  const splatka = row.Mesacna_splatka_EUR ?? 0;
  
  return najom - naklady - splatka;
}

// Vypočíta ročnú hrubú výnosnosť (nájom * 12 / kúpna cena)
export function calcAnnualYield(row: Apartment): number | null {
  const najom = row.Najom_brutto_EUR ?? 0;
  const kupnaCena = row.Kupna_cena_EUR ?? 0;
  
  if (kupnaCena === 0) return null;
  
  return (najom * 12) / kupnaCena;
}

