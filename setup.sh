#!/bin/bash

# Tento skript vytvorí .env súbor z .env.example, ak ešte neexistuje

if [ -f .env ]; then
    echo "⚠️  Súbor .env už existuje. Nechcem ho prepísať."
    exit 0
fi

echo "📝 Vytváram .env súbor z .env.example..."
cp .env.example .env

echo ""
echo "✅ Súbor .env bol vytvorený!"
echo ""
echo "⚠️  DÔLEŽITÉ: Teraz musíš vyplniť tieto hodnoty v .env súbore:"
echo ""
echo "  1. GOOGLE_SERVICE_ACCOUNT_EMAIL"
echo "  2. GOOGLE_PRIVATE_KEY"
echo "  3. GOOGLE_SHEET_ID"
echo "  4. API_KEY (vygeneruj si silný kľúč)"
echo ""
echo "Otvor .env súbor a vyplň všetky hodnoty, potom spusti:"
echo "  npm install"
echo "  npm run dev"
echo ""

