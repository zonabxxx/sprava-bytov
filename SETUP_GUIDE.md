# 🎯 SETUP GUIDE - Krok po kroku návod na spustenie

Tento návod ti pomôže rýchlo nastaviť a spustiť API server pre správu bytov.

## ✅ Rýchly Checklist

- [ ] Nainštalovať Node.js a npm
- [ ] Nainštalovať závislosti projektu
- [ ] Vytvoriť Google Cloud Service Account
- [ ] Zdieľať Google Sheets tabuľku
- [ ] Nakonfigurovať .env súbor
- [ ] Spustiť server
- [ ] Otestovať API

---

## 📝 Krok 1: Nainštaluj závislosti

```bash
npm install
```

---

## 🔑 Krok 2: Vytvor Google Service Account

### 2.1 Vytvor projekt v Google Cloud Console

1. Choď na https://console.cloud.google.com/
2. Klikni na dropdown projektu vľavo hore
3. Klikni "New Project"
4. Zadaj názov projektu (napr. "Byty API")
5. Klikni "Create"

### 2.2 Aktivuj Google Sheets API

1. V Google Cloud Console prejdi na: **APIs & Services** → **Library**
2. Vyhľadaj "Google Sheets API"
3. Klikni na ňu a stlač **Enable**

### 2.3 Vytvor Service Account

1. Prejdi na: **APIs & Services** → **Credentials**
2. Klikni **Create Credentials** → **Service Account**
3. Zadaj názov (napr. "byty-sheets-api")
4. Klikni **Create and Continue**
5. Skip role selection (klikni **Continue**)
6. Klikni **Done**

### 2.4 Vytvor a stiahni JSON kľúč

1. V zozname Service Accounts klikni na vytvorený account
2. Prejdi na záložku **Keys**
3. Klikni **Add Key** → **Create new key**
4. Vyber **JSON** formát
5. Klikni **Create**
6. Stiahne sa ti JSON súbor - **ULOŽ SI HO BEZPEČNE!**

---

## 📊 Krok 3: Zdieľaj Google Sheets tabuľku

### 3.1 Otvor JSON súbor a nájdi `client_email`

Bude vyzerať asi takto:
```
something-xyz@project-name-123456.iam.gserviceaccount.com
```

### 3.2 Zdieľaj tabuľku

1. Otvor svoju Google Sheets tabuľku: 
   https://docs.google.com/spreadsheets/d/176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k/edit

2. Klikni na tlačidlo **Share** vpravo hore

3. Vlož **client_email** zo service account JSON súboru

4. Nastav oprávnenia na **Editor**

5. **DÔLEŽITÉ:** Odškrtni "Notify people" (nechceme posielať email notifikáciu)

6. Klikni **Share**

---

## ⚙️ Krok 4: Nakonfiguruj .env súbor

### 4.1 Vytvor .env súbor

```bash
cp .env.example .env
```

Alebo použij setup skript:
```bash
./setup.sh
```

### 4.2 Vyplň hodnoty v .env

Otvor `.env` súbor v editore a vyplň:

#### A) GOOGLE_SERVICE_ACCOUNT_EMAIL
Skopíruj `client_email` z JSON súboru:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=something-xyz@project-name-123456.iam.gserviceaccount.com
```

#### B) GOOGLE_PRIVATE_KEY
Skopíruj `private_key` z JSON súboru (vrátane `-----BEGIN PRIVATE KEY-----` a `-----END PRIVATE KEY-----`):
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```

**POZOR:** Musí to byť v úvodzovkách a `\n` na nových riadkoch!

#### C) GOOGLE_SHEET_ID
Už je predvyplnené:
```env
GOOGLE_SHEET_ID=176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k
```

#### D) API_KEY
Vygeneruj si silný API kľúč (alebo použi tento generátor):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Vlož ho do .env:
```env
API_KEY=tvoj_vygenerovany_tajny_kluc_tu
```

#### E) PORT (voliteľné)
```env
PORT=3000
```

---

## 📋 Krok 5: Skontroluj štruktúru Google Sheets

### 5.1 Skontroluj názov sheetu

V tvojej Google Sheets tabuľke skontroluj, ako sa volá tab/sheet s bytmi.

Ak sa **nevolá** "Byty", musíš upraviť `src/googleSheets.ts`:

```typescript
// Nájdi tento riadok (približne riadok 14):
const SHEET_NAME = 'Byty';

// A zmeň na názov tvojho sheetu, napríklad:
const SHEET_NAME = 'Zoznam bytov';
```

### 5.2 Skontroluj hlavičku (prvý riadok)

Prvý riadok v tabuľke by mal obsahovať názvy stĺpcov presne v tomto poradí:

```
Byt_ID | Adresa_ulica | Mesto | PSC | Typ_bytu | Rozloha_m2 | ... | Najomnik_email
```

Ak máš iné názvy alebo poradie, môžeš:
- Buď upraviť tabuľku
- Alebo upraviť `src/types.ts` (COLUMN_MAP)

---

## 🚀 Krok 6: Spusti server

```bash
npm run dev
```

Mal by si vidieť:
```
🚀 Server beží na http://localhost:3000
📊 Google Sheets ID: 176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k
🔐 API Key autentifikácia aktívna
```

---

## 🧪 Krok 7: Otestuj API

### Test 1: Health check

```bash
curl -X GET http://localhost:3000/health \
  -H "x-api-key: tvoj_api_kluc"
```

Malo by vrátiť:
```json
{
  "status": "OK",
  "timestamp": "2025-10-31T..."
}
```

### Test 2: Získaj všetky byty

```bash
curl -X GET http://localhost:3000/apartments \
  -H "x-api-key: tvoj_api_kluc"
```

### Test 3: Získaj štatistiky

```bash
curl -X GET http://localhost:3000/stats/summary \
  -H "x-api-key: tvoj_api_kluc"
```

### Alebo použi VS Code REST Client

Otvor súbor `api-tests.http` a:
1. Uprav `@apiKey` na tvoj skutočný API kľúč
2. Klikni na "Send Request" pri ľubovoľnom requeste

---

## 🐛 Riešenie problémov

### Chyba: "API kľúč nie je nakonfigurovaný"
- Skontroluj, či máš `.env` súbor
- Skontroluj, či je v ňom `API_KEY=...`

### Chyba: "Nepodarilo sa načítať dáta z Google Sheets"

**Možné príčiny:**

1. **Service account nemá prístup**
   - Skontroluj, či si zdieľal tabuľku s `client_email`
   - Skontroluj, či má oprávnenia "Editor"

2. **Nesprávny SHEET_NAME**
   - Otvor Google Sheets a skontroluj názov tabu/sheetu
   - Updatuj `SHEET_NAME` v `src/googleSheets.ts`

3. **Nesprávny GOOGLE_SHEET_ID**
   - Skontroluj, či je ID v `.env` správne
   - ID by malo byť: `176UrB6SOf1-Do9aJxiOeerUsNAn9iilOZP71pYjLn2k`

4. **Nesprávny private key**
   - Skontroluj, či si skopíroval celý private key včetně `-----BEGIN` a `-----END`
   - Skontroluj, či je v úvodzovkách a obsahuje `\n`

### Chyba: "401 Unauthorized"
- Skontroluj, či posielaš správny API kľúč v hlavičke `x-api-key`

### Chyba: "Cannot find module..."
- Spusti znova `npm install`

---

## 📚 Ďalšie kroky

Po úspešnom spustení môžeš:

1. **Prečítať si README.md** - kompletná dokumentácia API
2. **Otvoriť api-tests.http** - ukážkové requesty
3. **Prečítať CHATGPT_INTEGRATION.md** - návod na integráciu s ChatGPT
4. **Nasadiť na produkciu** - Heroku, Railway, DigitalOcean, atď.

---

## 🎉 Hotovo!

Ak ti všetko funguje, môžeš začať používať API pre správu bytov!

Ukážkové príkazy:
- Získať všetky byty: `GET /apartments`
- Pridať nový byt: `POST /apartments`
- Získať štatistiky: `GET /stats/summary`
- Nájsť nájomníka: `GET /tenants/:name`

Enjoy! 🏠💰📊

