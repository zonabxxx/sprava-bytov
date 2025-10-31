import { Apartment } from './types';

// Vypočíta jednorazové náklady (znalec + právnik + daň + provízia + renovácia)
export function calcJednorazoveNaklady(row: Apartment): number {
  const znalec = row.Znalec_EUR ?? 0;
  const pravnik = row.Pravnik_EUR ?? 0;
  const dan = row.Dan_z_prevodu_EUR ?? 0;
  const provisia = row.Realitna_provisia_EUR ?? 0;
  const renovacia = row.Renovacia_vstup_EUR ?? 0;
  
  return znalec + pravnik + dan + provisia + renovacia;
}

// Vypočíta celkovú investíciu (kúpna cena + jednorazové náklady)
export function calcCelkovaInvesticia(row: Apartment): number {
  const kupnaCena = row.Kupna_cena_EUR ?? 0;
  const jednorazoveNaklady = calcJednorazoveNaklady(row);
  
  return kupnaCena + jednorazoveNaklady;
}

// Vypočíta celkové mesačné náklady (družstvo + elektrina + plyn + voda + internet + ostatné)
export function calcMonthlyCosts(row: Apartment): number {
  const druzstvo = row.Druzstvo_EUR ?? 0;
  const elektrina = row.Elektrina_EUR ?? 0;
  const plyn = row.Plyn_EUR ?? 0;
  const voda = row.Voda_EUR ?? 0;
  const internet = row.Internet_EUR ?? 0;
  const ostatne = row.Ostatne_naklady_EUR ?? 0;
  
  return druzstvo + elektrina + plyn + voda + internet + ostatne;
}

// Vypočíta mesačný cashflow (nájom - náklady - splátka)
export function calcMonthlyCashflow(row: Apartment): number {
  const najom = row.Najom_brutto_EUR ?? 0;
  const naklady = calcMonthlyCosts(row);
  const splatka = row.Mesacna_splatka_uveru_EUR ?? 0;
  
  return najom - naklady - splatka;
}

// Vypočíta ročnú hrubú výnosnosť (nájom * 12 / celková investícia) - v percentách
export function calcAnnualYield(row: Apartment): number | null {
  const najom = row.Najom_brutto_EUR ?? 0;
  const celkovaInvesticia = calcCelkovaInvesticia(row);
  
  if (celkovaInvesticia === 0) return null;
  
  return (najom * 12 / celkovaInvesticia) * 100; // v percentách
}

