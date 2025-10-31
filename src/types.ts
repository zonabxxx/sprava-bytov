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
  Znalec_EUR: number | null;
  Pravnik_EUR: number | null;
  Dan_z_prevodu_EUR: number | null;
  Realitna_provisia_EUR: number | null;
  Renovacia_vstup_EUR: number | null;
  Jednorazove_naklady_EUR: number | null;
  Celkova_investicia_EUR: number | null;
  Urokova_sadzba_p_a_percent: number | null;
  Pocet_rokov_uveru: number | null;
  Banka: string;
  Datum_zaciatku_uveru: string;
  Mesacna_splatka_uveru_EUR: number | null;
  Druzstvo_EUR: number | null;
  Elektrina_EUR: number | null;
  Plyn_EUR: number | null;
  Voda_EUR: number | null;
  Internet_EUR: number | null;
  Ostatne_naklady_EUR: number | null;
  Celkove_mesacne_naklady_bez_uveru_EUR: number | null;
  Najom_brutto_EUR: number | null;
  Cashflow_mesacne_EUR: number | null;
  Rocna_hruba_vynosnost_percent: number | null;
  Najomnik_meno: string;
  Najomnik_telefon: string;
  Najomnik_email: string;
  Zmluva_od: string;
  Zmluva_do: string;
  Vyska_depozitu_EUR: number | null;
  Stav_platieb: string;
  Poznamka: string;
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
  Znalec_EUR: 9,
  Pravnik_EUR: 10,
  Dan_z_prevodu_EUR: 11,
  Realitna_provisia_EUR: 12,
  Renovacia_vstup_EUR: 13,
  Jednorazove_naklady_EUR: 14,
  Celkova_investicia_EUR: 15,
  Urokova_sadzba_p_a_percent: 16,
  Pocet_rokov_uveru: 17,
  Banka: 18,
  Datum_zaciatku_uveru: 19,
  Mesacna_splatka_uveru_EUR: 20,
  Druzstvo_EUR: 21,
  Elektrina_EUR: 22,
  Plyn_EUR: 23,
  Voda_EUR: 24,
  Internet_EUR: 25,
  Ostatne_naklady_EUR: 26,
  Celkove_mesacne_naklady_bez_uveru_EUR: 27,
  Najom_brutto_EUR: 28,
  Cashflow_mesacne_EUR: 29,
  Rocna_hruba_vynosnost_percent: 30,
  Najomnik_meno: 31,
  Najomnik_telefon: 32,
  Najomnik_email: 33,
  Zmluva_od: 34,
  Zmluva_do: 35,
  Vyska_depozitu_EUR: 36,
  Stav_platieb: 37,
  Poznamka: 38,
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

