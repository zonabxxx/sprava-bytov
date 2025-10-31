# 🎉 QUICK START - Rýchly štart za 5 minút

## 📦 Čo máš v projekte

```
sprava bytov/
├── 📄 README.md                    # Hlavná dokumentácia API
├── 📄 SETUP_GUIDE.md              # Detailný setup návod (ZAČNI TU!)
├── 📄 CHATGPT_INTEGRATION.md      # Návod na ChatGPT integráciu
├── 📄 SAMPLE_DATA.md              # Ukážkové dáta pre Google Sheets
├── 📄 api-tests.http              # Testovacie HTTP requesty
├── 📄 package.json                # NPM dependencies
├── 📄 tsconfig.json               # TypeScript konfigurácia
├── 🔧 setup.sh                    # Setup skript
├── 🔧 .env.example                # Príklad .env súboru
└── 📁 src/
    ├── server.ts                  # Express API server
    ├── googleSheets.ts            # Google Sheets integrácia
    ├── calculations.ts            # Výpočty (cashflow, výnosnosť)
    ├── middleware.ts              # API key autentifikácia
    └── types.ts                   # TypeScript typy
```

## ⚡ Rýchly štart (5 minút)

### 1️⃣ Nainštaluj závislosti
```bash
npm install
```

### 2️⃣ Nastav Google Service Account

**Prečo to potrebuješ:**
API server potrebuje prístup k tvojej Google Sheets tabuľke. Service Account je ako "robot používateľ", ktorý má oprávnenia čítať a zapisovať do tabuľky.

**Postup:**
1. Choď na https://console.cloud.google.com/
2. Vytvor nový projekt
3. Aktivuj "Google Sheets API"
4. Vytvor Service Account
5. Stiahni JSON kľúč
6. **DÔLEŽITÉ:** Zdieľaj svoju tabuľku s emailom zo service accountu!

👉 **Detailný návod je v `SETUP_GUIDE.md`**

### 3️⃣ Vytvor .env súbor

```bash
cp .env.example .env
```

Otvor `.env` a vyplň:

```env
# Email z JSON súboru service accountu
GOOGLE_SERVICE_ACCOUNT_EMAIL=tvoj-service-account@projekt.iam.gserviceaccount.com

# Private key z JSON súboru (celý, vrátane BEGIN/END)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Tvoje Google Sheet ID (UŽ VYPLNENÉ!)
GOOGLE_SHEET_ID=176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k

# Port servera
PORT=3000

# Vygeneruj silný API kľúč
API_KEY=tvoj_tajny_api_kluc_tu
```

💡 **Tip na generovanie API kľúča:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Skontroluj Google Sheets

Otvor svoju tabuľku:
https://docs.google.com/spreadsheets/d/176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k/edit

**Skontroluj:**
- ✅ Je tabuľka zdieľaná so service account emailom?
- ✅ Má service account oprávnenia "Editor"?
- ✅ Ako sa volá sheet/tab? (Predpoklad: "Byty")
- ✅ Prvý riadok obsahuje názvy stĺpcov?

Ak sa sheet NEvolá "Byty", uprav `src/googleSheets.ts` riadok 14:
```typescript
const SHEET_NAME = 'tvoj_nazov_sheetu';
```

### 5️⃣ Spusti server

```bash
npm run dev
```

Malo by sa zobraziť:
```
🚀 Server beží na http://localhost:3000
📊 Google Sheets ID: 176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k
🔐 API Key autentifikácia aktívna
```

### 6️⃣ Otestuj API

**V novom termináli:**

```bash
# Zmeň "tvoj_api_kluc" na tvoj skutočný kľúč z .env
curl -X GET http://localhost:3000/health \
  -H "x-api-key: tvoj_api_kluc"
```

**Alebo:**
- Otvor `api-tests.http` vo VS Code
- Uprav `@apiKey` na tvoj API kľúč
- Klikni "Send Request"

---

## 📚 Dokumentácia

| Súbor | Popis |
|-------|-------|
| **SETUP_GUIDE.md** | Detailný setup návod krok po kroku |
| **README.md** | Kompletná API dokumentácia |
| **CHATGPT_INTEGRATION.md** | Návod na integráciu s ChatGPT |
| **SAMPLE_DATA.md** | Ukážkové dáta pre tabuľku |
| **api-tests.http** | Testovacie HTTP requesty |

---

## 🎯 API Endpointy

Po spustení servera máš k dispozícii:

| Endpoint | Metóda | Popis |
|----------|--------|-------|
| `/apartments` | GET | Všetky byty |
| `/apartments/:id` | GET | Detail bytu |
| `/apartments` | POST | Pridať nový byt |
| `/apartments/:id` | PATCH | Aktualizovať byt |
| `/stats/summary` | GET | Finančné štatistiky |
| `/tenants` | GET | Všetci nájomníci |
| `/tenants/:name` | GET | Vyhľadať nájomníka |
| `/meta` | GET | Metadata tabuľky |
| `/health` | GET | Health check |

**Všetky endpointy vyžadujú hlavičku:**
```
x-api-key: tvoj_api_kluc
```

---

## 🧪 Príklady použitia

### Získať všetky byty
```bash
curl http://localhost:3000/apartments \
  -H "x-api-key: tvoj_api_kluc"
```

### Pridať nový byt
```bash
curl -X POST http://localhost:3000/apartments \
  -H "x-api-key: tvoj_api_kluc" \
  -H "Content-Type: application/json" \
  -d '{
    "Adresa_ulica": "Nová 123",
    "Mesto": "Bratislava",
    "Kupna_cena_EUR": 100000,
    "Najom_brutto_EUR": 700
  }'
```

### Získať štatistiky
```bash
curl http://localhost:3000/stats/summary \
  -H "x-api-key: tvoj_api_kluc"
```

---

## 🤖 Použitie s ChatGPT

Po nastavení môžeš:

1. **Nasadiť server na internet** (Heroku, Railway, DigitalOcean)
2. **Vytvoriť ChatGPT Custom GPT** s týmto API
3. **Hovoriť s AI o bytoch:**
   - "Zobraz mi všetky byty"
   - "Pridaj nový byt"
   - "Aký je môj celkový cashflow?"
   - "Kto býva v byte BYT-001?"

👉 Návod v `CHATGPT_INTEGRATION.md`

---

## 🆘 Pomoc

### Server sa nespustí?
- Skontroluj, či máš `.env` súbor
- Skontroluj, či sú vyplnené všetky premenné v `.env`
- Spusti `npm install` znova

### Chyba s Google Sheets?
- Skontroluj, či je tabuľka zdieľaná so service accountom
- Skontroluj názov sheetu v `src/googleSheets.ts`
- Skontroluj, či je Sheet ID správne: `176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k`

### 401 Unauthorized?
- Skontroluj, či posielaš správny API kľúč v hlavičke `x-api-key`

---

## 🎓 Čo ďalej?

✅ **Server funguje lokálne?** Skvelé!

Ďalšie kroky:
1. 📖 Prečítaj si `README.md` pre detailnú dokumentáciu
2. 🧪 Otestuj všetky endpointy cez `api-tests.http`
3. 🤖 Integruj s ChatGPT (návod v `CHATGPT_INTEGRATION.md`)
4. 🚀 Nasaď na produkciu (Heroku, Railway, DigitalOcean)

---

**Potrebuješ pomoc?** Detailný návod je v `SETUP_GUIDE.md` 📖

**Hotovo!** Teraz máš REST API server, ktorý funguje ako "telemost" medzi Google Sheets a AI! 🎉

