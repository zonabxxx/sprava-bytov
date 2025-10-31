# Ukážkové dáta pre Google Sheets

Ak začínaš úplne od začiatku a nemáš ešte žiadne dáta v Google Sheets, tu sú ukážkové dáta, ktoré môžeš skopírovať.

## Riadok 1 - Header (názvy stĺpcov)

```
Byt_ID | Adresa_ulica | Mesto | PSC | Typ_bytu | Rozloha_m2 | Kupna_cena_EUR | Vlastne_zdroje_EUR | Uver_vyska_EUR | Urokova_sadzba | Pocet_rokov_uveru | Banka | Datum_zaciatku | Mesacna_splatka_EUR | Druzstvo_EUR | Elektrina_EUR | Plyn_EUR | Ostatne_naklady_EUR | Celkove_mesacne_naklady_EUR | Najom_brutto_EUR | Cashflow_mesacny_EUR | Rocna_hruba_vynosnost | Najomnik_meno | Najomnik_telefon | Najomnik_email
```

## Riadok 2 - Ukážkový byt 1

```
BYT-001 | Hlavná 123 | Bratislava | 81101 | 2-izbový | 55 | 120000 | 30000 | 90000 | 3.5 | 20 | Slovenská sporiteľňa | 01.01.2023 | 520 | 80 | 40 | 50 | 30 | 200 | 800 | 80 | 8.0 | Ján Novák | +421901234567 | jan.novak@example.com
```

## Riadok 3 - Ukážkový byt 2

```
BYT-002 | Školská 456 | Košice | 04001 | 1-izbový | 38 | 85000 | 20000 | 65000 | 3.8 | 15 | VÚB | 15.03.2023 | 450 | 60 | 30 | 40 | 20 | 150 | 550 | -50 | 7.8 | Eva Horvátová | +421905123456 | eva.horvatova@example.com
```

## Riadok 4 - Ukážkový byt 3

```
BYT-003 | Nová 789 | Žilina | 01001 | 3-izbový | 72 | 145000 | 40000 | 105000 | 3.2 | 25 | Tatra banka | 10.06.2022 | 490 | 100 | 50 | 60 | 40 | 250 | 950 | 210 | 7.9 | Peter Kováč | +421907654321 | peter.kovac@example.com
```

---

## Postup:

1. Otvor svoju Google Sheets tabuľku
2. Vytvor sheet s názvom **"Byty"**
3. Do prvého riadku (riadok 1) skopíruj header - názvy stĺpcov
4. Od druhého riadku (riadok 2) môžeš skopírovať ukážkové byty alebo pridať svoje vlastné dáta

---

## Poznámky k dátam:

- **Byt_ID**: Unikátne ID (formát: BYT-001, BYT-002, ...)
- **Dátumy**: Formát DD.MM.YYYY alebo ako máš nastavené v Google Sheets
- **Čísla**: Používaj bodku ako desatinný oddeľovač (nie čiarku)
- **Prázdne bunky**: Môžeš nechať prázdne, API to zoberie ako `null`

---

## CSV formát (pre import)

Ak chceš importovať dáta cez CSV súbor, vytvor súbor s týmto obsahom:

```csv
Byt_ID,Adresa_ulica,Mesto,PSC,Typ_bytu,Rozloha_m2,Kupna_cena_EUR,Vlastne_zdroje_EUR,Uver_vyska_EUR,Urokova_sadzba,Pocet_rokov_uveru,Banka,Datum_zaciatku,Mesacna_splatka_EUR,Druzstvo_EUR,Elektrina_EUR,Plyn_EUR,Ostatne_naklady_EUR,Celkove_mesacne_naklady_EUR,Najom_brutto_EUR,Cashflow_mesacny_EUR,Rocna_hruba_vynosnost,Najomnik_meno,Najomnik_telefon,Najomnik_email
BYT-001,Hlavná 123,Bratislava,81101,2-izbový,55,120000,30000,90000,3.5,20,Slovenská sporiteľňa,01.01.2023,520,80,40,50,30,200,800,80,8.0,Ján Novák,+421901234567,jan.novak@example.com
BYT-002,Školská 456,Košice,04001,1-izbový,38,85000,20000,65000,3.8,15,VÚB,15.03.2023,450,60,30,40,20,150,550,-50,7.8,Eva Horvátová,+421905123456,eva.horvatova@example.com
BYT-003,Nová 789,Žilina,01001,3-izbový,72,145000,40000,105000,3.2,25,Tatra banka,10.06.2022,490,100,50,60,40,250,950,210,7.9,Peter Kováč,+421907654321,peter.kovac@example.com
```

Potom v Google Sheets:
1. File → Import
2. Upload → vybereš CSV súbor
3. Import location: "Replace current sheet"
4. Separator type: "Comma"
5. Import data

