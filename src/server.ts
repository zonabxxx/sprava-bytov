import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiKeyAuth } from './middleware';
import {
  getRows,
  appendRow,
  findRowIndexByBytId,
  updateRow,
  getSheetMeta,
  getColumnHeaders,
  addColumn,
  renameColumn,
  clearColumn,
} from './googleSheets';
import { Apartment, PartialApartment, StatsSummary, Tenant } from './types';
import { calcMonthlyCosts, calcMonthlyCashflow, calcAnnualYield } from './calculations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiKeyAuth); // Všetky endpointy vyžadujú API kľúč

// Health check endpoint (bez autentifikácie by bolo lepšie, ale pre jednoduchosť to necháme)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 1. GET /apartments - vráti všetky byty
app.get('/apartments', async (req: Request, res: Response) => {
  try {
    const apartments = await getRows();
    res.json({ count: apartments.length, data: apartments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /apartments/:id - vráti konkrétny byt podľa Byt_ID
app.get('/apartments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const apartments = await getRows();
    const apartment = apartments.find(apt => apt.Byt_ID === id);

    if (!apartment) {
      res.status(404).json({ error: `Byt s ID "${id}" nebol nájdený` });
      return;
    }

    res.json(apartment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /apartments - pridá nový byt
app.post('/apartments', async (req: Request, res: Response) => {
  try {
    const apartmentData: PartialApartment = req.body;

    // Ak chýba Byt_ID, vygenerujeme ho
    if (!apartmentData.Byt_ID) {
      const apartments = await getRows();
      const nextNumber = apartments.length + 1;
      apartmentData.Byt_ID = `BYT-${String(nextNumber).padStart(3, '0')}`;
    }

    // Vytvoríme kompletný objekt Apartment s defaultnými hodnotami
    const newApartment: Apartment = {
      Byt_ID: apartmentData.Byt_ID,
      Adresa_ulica: apartmentData.Adresa_ulica || '',
      Mesto: apartmentData.Mesto || '',
      PSC: apartmentData.PSC || '',
      Typ_bytu: apartmentData.Typ_bytu || '',
      Rozloha_m2: apartmentData.Rozloha_m2 ?? null,
      Kupna_cena_EUR: apartmentData.Kupna_cena_EUR ?? null,
      Vlastne_zdroje_EUR: apartmentData.Vlastne_zdroje_EUR ?? null,
      Uver_vyska_EUR: apartmentData.Uver_vyska_EUR ?? null,
      Znalec_EUR: apartmentData.Znalec_EUR ?? null,
      Pravnik_EUR: apartmentData.Pravnik_EUR ?? null,
      Dan_z_prevodu_EUR: apartmentData.Dan_z_prevodu_EUR ?? null,
      Realitna_provisia_EUR: apartmentData.Realitna_provisia_EUR ?? null,
      Renovacia_vstup_EUR: apartmentData.Renovacia_vstup_EUR ?? null,
      Jednorazove_naklady_EUR: apartmentData.Jednorazove_naklady_EUR ?? null,
      Celkova_investicia_EUR: apartmentData.Celkova_investicia_EUR ?? null,
      Urokova_sadzba_p_a_percent: apartmentData.Urokova_sadzba_p_a_percent ?? null,
      Pocet_rokov_uveru: apartmentData.Pocet_rokov_uveru ?? null,
      Banka: apartmentData.Banka || '',
      Datum_zaciatku_uveru: apartmentData.Datum_zaciatku_uveru || '',
      Mesacna_splatka_uveru_EUR: apartmentData.Mesacna_splatka_uveru_EUR ?? null,
      Druzstvo_EUR: apartmentData.Druzstvo_EUR ?? null,
      Elektrina_EUR: apartmentData.Elektrina_EUR ?? null,
      Plyn_EUR: apartmentData.Plyn_EUR ?? null,
      Voda_EUR: apartmentData.Voda_EUR ?? null,
      Internet_EUR: apartmentData.Internet_EUR ?? null,
      Ostatne_naklady_EUR: apartmentData.Ostatne_naklady_EUR ?? null,
      Celkove_mesacne_naklady_bez_uveru_EUR: apartmentData.Celkove_mesacne_naklady_bez_uveru_EUR ?? null,
      Najom_brutto_EUR: apartmentData.Najom_brutto_EUR ?? null,
      Cashflow_mesacne_EUR: apartmentData.Cashflow_mesacne_EUR ?? null,
      Rocna_hruba_vynosnost_percent: apartmentData.Rocna_hruba_vynosnost_percent ?? null,
      Najomnik_meno: apartmentData.Najomnik_meno || '',
      Najomnik_telefon: apartmentData.Najomnik_telefon || '',
      Najomnik_email: apartmentData.Najomnik_email || '',
      Zmluva_od: apartmentData.Zmluva_od || '',
      Zmluva_do: apartmentData.Zmluva_do || '',
      Vyska_depozitu_EUR: apartmentData.Vyska_depozitu_EUR ?? null,
      Stav_platieb: apartmentData.Stav_platieb || '',
      Poznamka: apartmentData.Poznamka || '',
    };

    await appendRow(newApartment);
    res.status(201).json({ 
      message: 'Byt bol úspešne pridaný',
      apartment: newApartment 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PATCH /apartments/:id - aktualizuje vybrané polia konkrétneho bytu
app.patch('/apartments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: PartialApartment = req.body;

    // Nájdeme index riadku v Google Sheets
    const rowIndex = await findRowIndexByBytId(id);

    if (!rowIndex) {
      res.status(404).json({ error: `Byt s ID "${id}" nebol nájdený` });
      return;
    }

    // Zabránime zmene Byt_ID
    if (updates.Byt_ID && updates.Byt_ID !== id) {
      res.status(400).json({ error: 'Nie je možné zmeniť Byt_ID' });
      return;
    }

    // Aktualizujeme riadok v Google Sheets
    await updateRow(rowIndex, updates);

    res.json({ 
      message: 'Byt bol úspešne aktualizovaný',
      updatedFields: Object.keys(updates)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET /stats/summary - vráti agregované štatistiky
app.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const apartments = await getRows();

    let totalPurchase = 0;
    let totalMonthlyCosts = 0;
    let totalMonthlyRent = 0;
    let totalMonthlyCashflow = 0;
    let yieldSum = 0;
    let yieldCount = 0;

    apartments.forEach(apt => {
      // Súčet kúpnych cien
      totalPurchase += apt.Kupna_cena_EUR ?? 0;

      // Súčet mesačných nákladov
      totalMonthlyCosts += calcMonthlyCosts(apt);

      // Súčet mesačného nájmu
      totalMonthlyRent += apt.Najom_brutto_EUR ?? 0;

      // Súčet mesačného cashflow
      totalMonthlyCashflow += calcMonthlyCashflow(apt);

      // Priemerná výnosnosť (len z bytov, kde je možné ju vypočítať)
      const yield_ = calcAnnualYield(apt);
      if (yield_ !== null) {
        yieldSum += yield_;
        yieldCount++;
      }
    });

    const summary: StatsSummary = {
      count: apartments.length,
      totalPurchase: Math.round(totalPurchase * 100) / 100,
      totalMonthlyCosts: Math.round(totalMonthlyCosts * 100) / 100,
      totalMonthlyRent: Math.round(totalMonthlyRent * 100) / 100,
      totalMonthlyCashflow: Math.round(totalMonthlyCashflow * 100) / 100,
      averageYield: yieldCount > 0 
        ? Math.round((yieldSum / yieldCount) * 10000) / 100 // výsledok v %
        : null,
    };

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. GET /tenants - vráti všetkých nájomcov
app.get('/tenants', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const apartments = await getRows();

    // Filtrujeme len byty, ktoré majú nájomníka
    const tenants: Tenant[] = apartments
      .filter(apt => apt.Najomnik_meno && apt.Najomnik_meno.trim() !== '')
      .map(apt => ({
        meno: apt.Najomnik_meno,
        telefon: apt.Najomnik_telefon,
        email: apt.Najomnik_email,
        byt_id: apt.Byt_ID,
        vyska_najomu: apt.Najom_brutto_EUR,
        mesacne_naklady_bytu: calcMonthlyCosts(apt),
      }));

    res.json({ count: tenants.length, data: tenants });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. GET /tenants/:name - vráti konkrétneho nájomníka (case-insensitive contains)
app.get('/tenants/:name', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const apartments = await getRows();

    // Hľadáme nájomníka podľa mena (case-insensitive contains)
    const searchName = name.toLowerCase();
    const matchingApartments = apartments.filter(apt => 
      apt.Najomnik_meno && 
      apt.Najomnik_meno.toLowerCase().includes(searchName)
    );

    if (matchingApartments.length === 0) {
      res.status(404).json({ error: `Nájomník s menom obsahujúcim "${name}" nebol nájdený` });
      return;
    }

    // Ak nájdeme viacerých, vrátime všetkých
    const tenants: Tenant[] = matchingApartments.map(apt => ({
      meno: apt.Najomnik_meno,
      telefon: apt.Najomnik_telefon,
      email: apt.Najomnik_email,
      byt_id: apt.Byt_ID,
      vyska_najomu: apt.Najom_brutto_EUR,
      mesacne_naklady_bytu: calcMonthlyCosts(apt),
    }));

    res.json({ count: tenants.length, data: tenants });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /meta - vráti metadata o Google Sheets tabuľke
app.get('/meta', async (req: Request, res: Response) => {
  try {
    const meta = await getSheetMeta();
    res.json(meta);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// ENDPOINTY PRE STĹPCE
// ========================================

// GET /columns - vráti zoznam všetkých stĺpcov (hlavičky) v tabuľke
app.get('/columns', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const headers = await getColumnHeaders();
    res.json({ 
      count: headers.length,
      columns: headers 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /columns - pridá nový stĺpec do tabuľky
app.post('/columns', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { columnName } = req.body;
    
    if (!columnName || typeof columnName !== 'string') {
      res.status(400).json({ error: 'Chýba parameter "columnName" (string)' });
      return;
    }
    
    await addColumn(columnName);
    
    res.status(201).json({ 
      message: `Stĺpec "${columnName}" bol úspešne pridaný`,
      columnName 
    });
  } catch (error: any) {
    if (error.message.includes('už existuje')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PATCH /columns/:oldName - premenuje existujúci stĺpec
app.patch('/columns/:oldName', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { oldName } = req.params;
    const { newName } = req.body;
    
    if (!newName || typeof newName !== 'string') {
      res.status(400).json({ error: 'Chýba parameter "newName" (string)' });
      return;
    }
    
    await renameColumn(oldName, newName);
    
    res.json({ 
      message: `Stĺpec "${oldName}" bol premenovaný na "${newName}"`,
      oldName,
      newName
    });
  } catch (error: any) {
    if (error.message.includes('neexistuje')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// DELETE /columns/:columnName - vymaže obsah stĺpca (ale nechá hlavičku)
app.delete('/columns/:columnName', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const { columnName } = req.params;
    
    await clearColumn(columnName);
    
    res.json({ 
      message: `Stĺpec "${columnName}" bol vymazaný`,
      columnName 
    });
  } catch (error: any) {
    if (error.message.includes('neexistuje')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Spustenie servera
app.listen(PORT, () => {
  console.log(`🚀 Server beží na http://localhost:${PORT}`);
  console.log(`📊 Google Sheets ID: ${process.env.GOOGLE_SHEET_ID}`);
  console.log(`🔐 API Key autentifikácia aktívna`);
});

