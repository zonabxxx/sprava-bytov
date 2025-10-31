# Ukážkový OpenAPI Schema pre ChatGPT Actions

Tento súbor môžeš nahrať do ChatGPT Actions na vytvorenie vlastného GPT pre správu bytov.

## Postup:

1. Choď na https://chat.openai.com/gpts/editor
2. Vytvor nový GPT
3. V sekcii "Actions" klikni na "Create new action"
4. Skopíruj OpenAPI schema nižšie
5. Nastav Authentication na "API Key" s header `x-api-key`

---

```yaml
openapi: 3.0.0
info:
  title: Správa Bytov API
  description: REST API pre správu bytov, nájomníkov a finančných štatistík cez Google Sheets
  version: 1.0.0

servers:
  - url: http://localhost:3000
    description: Lokálny development server
  # Po nasadení zmeň na production URL:
  # - url: https://tvoj-server.herokuapp.com

paths:
  /apartments:
    get:
      summary: Získať všetky byty
      description: Vráti zoznam všetkých bytov z Google Sheets
      operationId: getApartments
      security:
        - ApiKeyAuth: []
      responses:
        '200':
          description: Zoznam bytov
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Apartment'
    post:
      summary: Pridať nový byt
      description: Pridá nový byt do Google Sheets
      operationId: addApartment
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ApartmentInput'
      responses:
        '201':
          description: Byt úspešne pridaný

  /apartments/{id}:
    get:
      summary: Získať konkrétny byt
      description: Vráti detail bytu podľa Byt_ID
      operationId: getApartmentById
      security:
        - ApiKeyAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: ID bytu (napr. BYT-001)
      responses:
        '200':
          description: Detail bytu
        '404':
          description: Byt nenájdený
    patch:
      summary: Aktualizovať byt
      description: Aktualizuje vybrané polia konkrétneho bytu
      operationId: updateApartment
      security:
        - ApiKeyAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ApartmentUpdate'
      responses:
        '200':
          description: Byt úspešne aktualizovaný

  /stats/summary:
    get:
      summary: Získať finančné štatistiky
      description: Vráti agregované štatistiky všetkých bytov (cashflow, výnosnosť, náklady)
      operationId: getStatsSummary
      security:
        - ApiKeyAuth: []
      responses:
        '200':
          description: Finančné štatistiky
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StatsSummary'

  /tenants:
    get:
      summary: Získať všetkých nájomníkov
      description: Vráti zoznam všetkých nájomníkov s informáciami o byte
      operationId: getTenants
      security:
        - ApiKeyAuth: []
      responses:
        '200':
          description: Zoznam nájomníkov
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Tenant'

  /tenants/{name}:
    get:
      summary: Vyhľadať nájomníka
      description: Vyhľadá nájomníka podľa mena (case-insensitive)
      operationId: searchTenant
      security:
        - ApiKeyAuth: []
      parameters:
        - name: name
          in: path
          required: true
          schema:
            type: string
          description: Meno alebo časť mena nájomníka
      responses:
        '200':
          description: Nájdený nájomník/nájomníci
        '404':
          description: Nájomník nenájdený

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key

  schemas:
    Apartment:
      type: object
      properties:
        Byt_ID:
          type: string
          description: Unikátne ID bytu (napr. BYT-001)
        Adresa_ulica:
          type: string
        Mesto:
          type: string
        PSC:
          type: string
        Typ_bytu:
          type: string
        Rozloha_m2:
          type: number
          nullable: true
        Kupna_cena_EUR:
          type: number
          nullable: true
        Najom_brutto_EUR:
          type: number
          nullable: true
        Najomnik_meno:
          type: string
        Najomnik_telefon:
          type: string
        Najomnik_email:
          type: string

    ApartmentInput:
      type: object
      properties:
        Adresa_ulica:
          type: string
        Mesto:
          type: string
        PSC:
          type: string
        Typ_bytu:
          type: string
        Rozloha_m2:
          type: number
        Kupna_cena_EUR:
          type: number
        Najom_brutto_EUR:
          type: number
        Najomnik_meno:
          type: string

    ApartmentUpdate:
      type: object
      properties:
        Najom_brutto_EUR:
          type: number
        Najomnik_meno:
          type: string
        Najomnik_telefon:
          type: string
        Najomnik_email:
          type: string

    StatsSummary:
      type: object
      properties:
        count:
          type: integer
          description: Počet bytov
        totalPurchase:
          type: number
          description: Súčet kúpnych cien
        totalMonthlyCosts:
          type: number
          description: Súčet mesačných nákladov
        totalMonthlyRent:
          type: number
          description: Súčet mesačných nájmov
        totalMonthlyCashflow:
          type: number
          description: Súčet mesačného cashflow
        averageYield:
          type: number
          nullable: true
          description: Priemerná ročná výnosnosť v %

    Tenant:
      type: object
      properties:
        meno:
          type: string
        telefon:
          type: string
        email:
          type: string
        byt_id:
          type: string
        vyska_najomu:
          type: number
        mesacne_naklady_bytu:
          type: number
```

---

## Ukážkové inštrukcie pre ChatGPT:

Po vytvorení GPT s týmto API môžeš do "Instructions" pridať:

```
Si asistent pre správu bytov. Máš prístup k API, ktoré je pripojené na Google Sheets s údajmi o bytoch.

Môžeš:
- Zobrazovať zoznam bytov a ich detaily
- Pridávať nové byty do evidencie
- Aktualizovať informácie o bytoch (nájom, nájomníci, atď.)
- Zobrazovať finančné štatistiky (cashflow, výnosnosť)
- Vyhľadávať nájomníkov a ich kontaktné údaje

Pri odpovediach:
- Formátuj finančné údaje prehľadne s menou EUR
- Pri štatistikách zobraz aj percento výnosnosti
- Pri pridávaní bytu sa opýtaj na základné údaje (adresa, mesto, cena, nájom)
- Buď priateľský a pomáhaj užívateľovi s rozhodovaniami o investíciách

Ukážkové otázky, na ktoré vieš odpovedať:
- "Aké byty mám v evidencii?"
- "Pridaj nový byt na Hlavnej 123 v Bratislave za 120 000 EUR"
- "Zmeň nájom v byte BYT-001 na 850 EUR"
- "Aký mám celkový mesačný cashflow?"
- "Kto býva v byte BYT-003?"
```

---

## Testovanie:

Po nastavení ChatGPT Actions môžeš testovať s otázkami ako:

- "Zobraz mi všetky byty"
- "Aké sú moje finančné štatistiky?"
- "Pridaj nový byt"
- "Kto je nájomník v byte BYT-001?"
- "Zmeň telefón nájomníkovi v byte BYT-002"

