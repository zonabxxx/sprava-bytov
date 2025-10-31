import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Apartment, COLUMN_MAP, columnNumberToLetter, parseValue } from './types';

dotenv.config();

// Konfigurácia Google Sheets API
let credentials;

// Priorita: Base64 encoded credentials (funguje lepšie v Railway/Vercel)
if (process.env.GOOGLE_CREDENTIALS_BASE64) {
  const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString();
  credentials = JSON.parse(decoded);
} else {
  // Fallback: Samostatné premenné
  credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID || process.env.SPREADSHEET_ID; // Podporujeme obe názvy
const SHEET_NAME = 'bytovy_prehlad_sablona-2'; // Názov sheetu z Google Sheets

// Helper: konvertuje riadok z Google Sheets na objekt Apartment
function rowToApartment(row: any[]): Apartment {
  const keys = Object.keys(COLUMN_MAP) as (keyof Apartment)[];
  const apartment: any = {};
  
  keys.forEach((key) => {
    const colIndex = COLUMN_MAP[key];
    const value = row[colIndex];
    apartment[key] = parseValue(value);
  });
  
  return apartment as Apartment;
}

// Helper: konvertuje objekt Apartment na pole hodnôt pre Google Sheets
function apartmentToRow(apartment: Partial<Apartment>): any[] {
  const row: any[] = new Array(Object.keys(COLUMN_MAP).length).fill('');
  
  Object.entries(apartment).forEach(([key, value]) => {
    const colIndex = COLUMN_MAP[key as keyof Apartment];
    if (colIndex !== undefined) {
      row[colIndex] = value ?? '';
    }
  });
  
  return row;
}

// Vráti všetky byty z Google Sheets
export async function getRows(): Promise<Apartment[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2:Z`, // Začíname od riadku 2 (riadok 1 je header)
    });

    const rows = response.data.values || [];
    return rows.map(rowToApartment);
  } catch (error) {
    console.error('Chyba pri čítaní z Google Sheets:', error);
    throw new Error('Nepodarilo sa načítať dáta z Google Sheets');
  }
}

// Pridá nový byt do Google Sheets
export async function appendRow(apartment: Apartment): Promise<void> {
  try {
    const row = apartmentToRow(apartment);
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error('Chyba pri pridávaní riadku do Google Sheets:', error);
    throw new Error('Nepodarilo sa pridať byt do Google Sheets');
  }
}

// Aktualizuje konkrétnu bunku v Google Sheets
// rowIndex: číslo riadku (začína od 1, ale riadok 1 je header, takže prvý byt je 2)
// column: názov stĺpca z Apartment interface (napr. "Najom_brutto_EUR")
// value: nová hodnota
export async function updateCell(
  rowIndex: number,
  column: keyof Apartment,
  value: string | number
): Promise<void> {
  try {
    const colIndex = COLUMN_MAP[column];
    const colLetter = columnNumberToLetter(colIndex);
    const cellAddress = `${SHEET_NAME}!${colLetter}${rowIndex}`;
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: cellAddress,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[value]],
      },
    });
  } catch (error) {
    console.error('Chyba pri aktualizácii bunky v Google Sheets:', error);
    throw new Error('Nepodarilo sa aktualizovať bunku v Google Sheets');
  }
}

// Aktualizuje viacero buniek v jednom riadku
export async function updateRow(
  rowIndex: number,
  updates: Partial<Apartment>
): Promise<void> {
  try {
    // Pre každú aktualizáciu zavoláme updateCell
    const promises = Object.entries(updates).map(([key, value]) => {
      return updateCell(rowIndex, key as keyof Apartment, value as any);
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Chyba pri aktualizácii riadku v Google Sheets:', error);
    throw new Error('Nepodarilo sa aktualizovať riadok v Google Sheets');
  }
}

// Vráti základné informácie o Google Sheet
export async function getSheetMeta(): Promise<{
  sheetName: string;
  rowCount: number;
  columnCount: number;
}> {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const sheet = response.data.sheets?.[0];
    const properties = sheet?.properties;

    return {
      sheetName: properties?.title || SHEET_NAME,
      rowCount: properties?.gridProperties?.rowCount || 0,
      columnCount: properties?.gridProperties?.columnCount || 0,
    };
  } catch (error) {
    console.error('Chyba pri získavaní metadát Google Sheets:', error);
    throw new Error('Nepodarilo sa získať informácie o Google Sheets');
  }
}

// Helper: nájde index riadku podľa Byt_ID (vracia číslo riadku v Google Sheets - 2 = prvý byt)
export async function findRowIndexByBytId(bytId: string): Promise<number | null> {
  const apartments = await getRows();
  const index = apartments.findIndex(apt => apt.Byt_ID === bytId);
  
  if (index === -1) return null;
  
  // +2 pretože:
  // - index je 0-based
  // - riadok 1 je header
  return index + 2;
}

