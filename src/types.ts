// Typ pre byt v Google Sheets
export interface Apartment {
  Byt_ID: string;
  Adresa_ulica: string;
  Mesto: string;
  PSC: string;
  Typ_bytu: string;
  Rozloha_m2: number | null;
  Kupna_cena_EUR: number | null;
  Vlastne_zdroje_EUR: number | null;
  Uver_vyska_EUR: number | null;
  Urokova_sadzba: number | null;
  Pocet_rokov_uveru: number | null;
  Banka: string;
  Datum_zaciatku: string;
  Mesacna_splatka_EUR: number | null;
  Druzstvo_EUR: number | null;
  Elektrina_EUR: number | null;
  Plyn_EUR: number | null;
  Ostatne_naklady_EUR: number | null;
  Celkove_mesacne_naklady_EUR: number | null;
  Najom_brutto_EUR: number | null;
  Cashflow_mesacny_EUR: number | null;
  Rocna_hruba_vynosnost: number | null;
  Najomnik_meno: string;
  Najomnik_telefon: string;
  Najomnik_email: string;
}

// Čiastočný update bytu (PATCH)
export type PartialApartment = Partial<Apartment>;

// Nájomca - zjednodušený pohľad
export interface Tenant {
  meno: string;
  telefon: string;
  email: string;
  byt_id: string;
  vyska_najomu: number | null;
  mesacne_naklady_bytu: number | null;
}

// Štatistiky - summary
export interface StatsSummary {
  count: number;
  totalPurchase: number;
  totalMonthlyCosts: number;
  totalMonthlyRent: number;
  totalMonthlyCashflow: number;
  averageYield: number | null;
}

// Mapa stĺpcov (A=0, B=1, ...)
export const COLUMN_MAP: Record<keyof Apartment, number> = {
  Byt_ID: 0,
  Adresa_ulica: 1,
  Mesto: 2,
  PSC: 3,
  Typ_bytu: 4,
  Rozloha_m2: 5,
  Kupna_cena_EUR: 6,
  Vlastne_zdroje_EUR: 7,
  Uver_vyska_EUR: 8,
  Urokova_sadzba: 9,
  Pocet_rokov_uveru: 10,
  Banka: 11,
  Datum_zaciatku: 12,
  Mesacna_splatka_EUR: 13,
  Druzstvo_EUR: 14,
  Elektrina_EUR: 15,
  Plyn_EUR: 16,
  Ostatne_naklady_EUR: 17,
  Celkove_mesacne_naklady_EUR: 18,
  Najom_brutto_EUR: 19,
  Cashflow_mesacny_EUR: 20,
  Rocna_hruba_vynosnost: 21,
  Najomnik_meno: 22,
  Najomnik_telefon: 23,
  Najomnik_email: 24,
};

// Helper: konverzia čísla stĺpca na písmeno (0=A, 1=B, ...)
export function columnNumberToLetter(colNum: number): string {
  let letter = '';
  let num = colNum;
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter;
    num = Math.floor(num / 26) - 1;
  }
  return letter;
}

// Helper: konverzia hodnoty z Sheets (môže byť string, number alebo prázdne)
export function parseValue(val: any): any {
  if (val === undefined || val === null || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? val : num;
}

