# 🏠 Byty Google Sheets API

REST API "telemost" medzi Google Sheets a AI (ChatGPT) pre správu bytov. Umožňuje čítať, pridávať a aktualizovať údaje o bytoch, sledovať nájomníkov a počítať finančné štatistiky.

## 📋 Obsah

- [Technológie](#technológie)
- [Inštalácia](#inštalácia)
- [Konfigurácia](#konfigurácia)
- [Spustenie](#spustenie)
- [API Endpointy](#api-endpointy)
- [Ukážky Requestov](#ukážky-requestov)
- [Integrácia s ChatGPT](#integrácia-s-chatgpt)

## 🛠 Technológie

- **Node.js** + **TypeScript**
- **Express.js** - REST API server
- **Google Sheets API** - integrácia s Google tabuľkami
- **dotenv** - správa environment premenných

## 📦 Inštalácia

```bash
# Nainštaluj závislosti
npm install
```

## ⚙️ Konfigurácia

### 1. Google Sheets API Setup

1. Vytvor projekt v [Google Cloud Console](https://console.cloud.google.com/)
2. Aktivuj Google Sheets API
3. Vytvor Service Account a stiahni JSON kľúč
4. Zdieľaj svoju Google Sheets tabuľku s emailom service accountu

### 2. Environment Variables

Skopíruj `.env.example` do `.env` a vyplň hodnoty:

```bash
cp .env.example .env
```

Vyplň tieto hodnoty v `.env`:

```env
# Google Sheets API konfigurácia
GOOGLE_SERVICE_ACCOUNT_EMAIL=vas-service-account@vas-projekt.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTvoj private key tu\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=tvoj_google_sheet_id

# Server konfigurácia
PORT=3000

# API bezpečnosť
API_KEY=tvoj_tajny_api_kluc
```

**Ako získať Google Sheet ID:**
- Otvor svoju tabuľku v Google Sheets
- URL vyzerá takto: `https://docs.google.com/spreadsheets/d/ABC123XYZ789/edit`
- ID je časť `ABC123XYZ789`

### 3. Štruktúra Google Sheets tabuľky

Tabuľka musí mať sheet s názvom **"Byty"** a tieto stĺpce (v tomto poradí):

| A | B | C | D | E | ... | Y |
|---|---|---|---|---|-----|---|
| Byt_ID | Adresa_ulica | Mesto | PSC | Typ_bytu | ... | Najomnik_email |

Kompletný zoznam stĺpcov:
1. Byt_ID
2. Adresa_ulica
3. Mesto
4. PSC
5. Typ_bytu
6. Rozloha_m2
7. Kupna_cena_EUR
8. Vlastne_zdroje_EUR
9. Uver_vyska_EUR
10. Urokova_sadzba
11. Pocet_rokov_uveru
12. Banka
13. Datum_zaciatku
14. Mesacna_splatka_EUR
15. Druzstvo_EUR
16. Elektrina_EUR
17. Plyn_EUR
18. Ostatne_naklady_EUR
19. Celkove_mesacne_naklady_EUR
20. Najom_brutto_EUR
21. Cashflow_mesacny_EUR
22. Rocna_hruba_vynosnost
23. Najomnik_meno
24. Najomnik_telefon
25. Najomnik_email

**Poznámka:** Riadok 1 je header (názvy stĺpcov), dáta začínajú od riadku 2.

## 🚀 Spustenie

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

Server bude bežať na `http://localhost:3000` (alebo na porte definovanom v `.env`).

## 📡 API Endpointy

Všetky endpointy vyžadujú API kľúč v hlavičke:
```
x-api-key: tvoj_tajny_api_kluc
```

### 1. **GET /apartments**
Vráti všetky byty z Google Sheets.

**Response:**
```json
{
  "count": 5,
  "data": [
    {
      "Byt_ID": "BYT-001",
      "Adresa_ulica": "Hlavná 123",
      "Mesto": "Bratislava",
      "Najom_brutto_EUR": 800,
      ...
    }
  ]
}
```

### 2. **GET /apartments/:id**
Vráti konkrétny byt podľa `Byt_ID`.

**Example:** `GET /apartments/BYT-001`

**Response:**
```json
{
  "Byt_ID": "BYT-001",
  "Adresa_ulica": "Hlavná 123",
  "Mesto": "Bratislava",
  ...
}
```

### 3. **POST /apartments**
Pridá nový byt do Google Sheets.

**Request Body:**
```json
{
  "Adresa_ulica": "Nová 456",
  "Mesto": "Košice",
  "PSC": "04001",
  "Typ_bytu": "2-izbový",
  "Rozloha_m2": 55,
  "Kupna_cena_EUR": 120000,
  "Najom_brutto_EUR": 650
}
```

**Response:**
```json
{
  "message": "Byt bol úspešne pridaný",
  "apartment": {
    "Byt_ID": "BYT-006",
    ...
  }
}
```

**Poznámka:** Ak neuvedieš `Byt_ID`, automaticky sa vygeneruje (napr. BYT-001, BYT-002...).

### 4. **PATCH /apartments/:id**
Aktualizuje vybrané polia konkrétneho bytu.

**Example:** `PATCH /apartments/BYT-001`

**Request Body:**
```json
{
  "Najom_brutto_EUR": 850,
  "Najomnik_telefon": "+421901234567"
}
```

**Response:**
```json
{
  "message": "Byt bol úspešne aktualizovaný",
  "updatedFields": ["Najom_brutto_EUR", "Najomnik_telefon"]
}
```

### 5. **GET /stats/summary**
Vráti agregované finančné štatistiky.

**Response:**
```json
{
  "count": 5,
  "totalPurchase": 600000,
  "totalMonthlyCosts": 850,
  "totalMonthlyRent": 3500,
  "totalMonthlyCashflow": 1200,
  "averageYield": 7.2
}
```

**Výpočty:**
- `totalPurchase` - súčet všetkých kúpnych cien
- `totalMonthlyCosts` - súčet mesačných nákladov (družstvo + el. + plyn + ostatné)
- `totalMonthlyRent` - súčet mesačných nájmov
- `totalMonthlyCashflow` - súčet mesačných cashflow (nájom - náklady - splátka)
- `averageYield` - priemerná ročná výnosnosť v % (len z bytov, kde je vypočítateľná)

### 6. **GET /tenants**
Vráti zoznam všetkých nájomníkov.

**Response:**
```json
{
  "count": 3,
  "data": [
    {
      "meno": "Ján Novák",
      "telefon": "+421901234567",
      "email": "jan.novak@example.com",
      "byt_id": "BYT-001",
      "vyska_najomu": 800,
      "mesacne_naklady_bytu": 170
    }
  ]
}
```

### 7. **GET /tenants/:name**
Vyhľadá nájomníka podľa mena (case-insensitive, contains).

**Example:** `GET /tenants/Novák`

**Response:**
```json
{
  "count": 1,
  "data": [
    {
      "meno": "Ján Novák",
      "telefon": "+421901234567",
      "email": "jan.novak@example.com",
      "byt_id": "BYT-001",
      "vyska_najomu": 800,
      "mesacne_naklady_bytu": 170
    }
  ]
}
```

### 8. **GET /meta**
Vráti metadata o Google Sheets tabuľke.

**Response:**
```json
{
  "sheetName": "Byty",
  "rowCount": 100,
  "columnCount": 26
}
```

### 9. **GET /health**
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-31T10:00:00.000Z"
}
```

## 🔍 Ukážky Requestov

### cURL

#### 1. Získať všetky byty
```bash
curl -X GET http://localhost:3000/apartments \
  -H "x-api-key: tvoj_tajny_api_kluc"
```

#### 2. Pridať nový byt
```bash
curl -X POST http://localhost:3000/apartments \
  -H "x-api-key: tvoj_tajny_api_kluc" \
  -H "Content-Type: application/json" \
  -d '{
    "Adresa_ulica": "Testovacia 789",
    "Mesto": "Žilina",
    "PSC": "01001",
    "Typ_bytu": "1-izbový",
    "Kupna_cena_EUR": 80000,
    "Najom_brutto_EUR": 500
  }'
```

#### 3. Aktualizovať byt
```bash
curl -X PATCH http://localhost:3000/apartments/BYT-001 \
  -H "x-api-key: tvoj_tajny_api_kluc" \
  -H "Content-Type: application/json" \
  -d '{
    "Najom_brutto_EUR": 850
  }'
```

#### 4. Získať štatistiky
```bash
curl -X GET http://localhost:3000/stats/summary \
  -H "x-api-key: tvoj_tajny_api_kluc"
```

#### 5. Vyhľadať nájomníka
```bash
curl -X GET http://localhost:3000/tenants/Novák \
  -H "x-api-key: tvoj_tajny_api_kluc"
```

### JavaScript (fetch)

```javascript
const API_KEY = 'tvoj_tajny_api_kluc';
const BASE_URL = 'http://localhost:3000';

// Získať všetky byty
async function getApartments() {
  const response = await fetch(`${BASE_URL}/apartments`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  const data = await response.json();
  console.log(data);
}

// Pridať nový byt
async function addApartment() {
  const response = await fetch(`${BASE_URL}/apartments`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Adresa_ulica: 'Testovacia 789',
      Mesto: 'Žilina',
      Kupna_cena_EUR: 80000,
      Najom_brutto_EUR: 500
    })
  });
  const data = await response.json();
  console.log(data);
}

// Získať štatistiky
async function getStats() {
  const response = await fetch(`${BASE_URL}/stats/summary`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  const data = await response.json();
  console.log(data);
}
```

## 🤖 Integrácia s ChatGPT

Tento server môžeš použiť ako backend pre ChatGPT Custom Actions. Vďaka tomu budeš môcť v ChatGPT písať príkazy ako:

- *"Zobraz mi všetky byty"*
- *"Pridaj nový byt na Hlavnej 123 v Bratislave"*
- *"Aký je celkový mesačný cashflow?"*
- *"Zmeň nájomníkovi telefón v byte BYT-001"*

### Postup integrácie:

1. **Nasaď server** na verejný hosting (napr. Heroku, Railway, DigitalOcean)
2. **Vytvor ChatGPT Action** v [platform.openai.com](https://platform.openai.com/)
3. **Nastav OpenAPI schema** pre tvoje endpointy
4. **Pridaj API key autentifikáciu**

### Ukážka OpenAPI schema (pre ChatGPT):

```yaml
openapi: 3.0.0
info:
  title: Byty API
  version: 1.0.0
servers:
  - url: https://tvoj-server.com
paths:
  /apartments:
    get:
      summary: Získať všetky byty
      operationId: getApartments
      security:
        - ApiKeyAuth: []
  /stats/summary:
    get:
      summary: Získať finančné štatistiky
      operationId: getStats
      security:
        - ApiKeyAuth: []
  # ... ďalšie endpointy
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
```

## 🔒 Bezpečnosť

- Všetky endpointy vyžadujú API kľúč v hlavičke `x-api-key`
- Nikdy nezdieľaj svoj `.env` súbor
- Pri nasadení na produkciu použij silný API kľúč
- Service account má prístup len k zdieľaným Google Sheets

## 📝 Poznámky

- Server načíta všetky dáta pri každom requeste (vhodné pre malé až stredné datasety)
- Pre veľké datasety zvážte cacheing alebo databázu
- Google Sheets API má rate limity (60 requestov/min pre read, 100/min pre write)

## 🐛 Riešenie problémov

### Chyba: "API kľúč nie je nakonfigurovaný"
- Skontroluj, či máš správne vyplnený `.env` súbor

### Chyba: "Nepodarilo sa načítať dáta z Google Sheets"
- Skontroluj, či je service account email zdieľaný v Google Sheets
- Overiť, či je GOOGLE_SHEET_ID správne
- Overiť, či existuje sheet s názvom "Byty"

### Chyba: "401 Unauthorized"
- Skontroluj, či posielaš správny API kľúč v hlavičke `x-api-key`

## 📄 Licencia

ISC

## 👨‍💻 Autor

Vytvorené pre správu bytov a integráciu s AI asistentmi.

