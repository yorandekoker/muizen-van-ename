# De muizen van Ename — app

Eén kleine Node-server (geen pakketten nodig, Node 18 of nieuwer) die de website dient en de toestand van het spel bijhoudt.
De kiosk (Raspberry Pi) en de gsm van het gezin zien elke wijziging meteen.

## Starten
    node server.js                 # http://localhost:3000
    PORT=8080 HW_KEY=geheim node server.js

Pagina's
- `/` of `/phone.html`: de gsm (open bij echt gebruik via de QR-code)
- `/kiosk.html`: het scherm in het muizenhol, volledig scherm (bijvoorbeeld `chromium --kiosk http://…/kiosk.html`)
- `/demo.html`: beide schermen naast elkaar zonder server, met tijdelijke navigatie
- `/phone.html?test=1`: testpaneel onderaan om post 4 (afstand) en post 5 (beweging) te proberen zonder naar buiten te gaan

## Hoe het spel loopt
1. Kiosk toont Welkom. Een gezin scant de QR-code en tikt Verder op de gsm (of op de kiosk). Dat is één sessie; een tweede gsm krijgt "het muizenhol wordt gebruikt" tot de sessie 10 minuten stil is of klaar.
2. Verhaal op de kiosk, dan kiezen. Kiest iemand een voorwerp, dan zien kiosk en gsm de info. "Naar de opdracht": de kiosk gaat terug naar het overzicht, de gsm naar de opdracht.
3. Post 1 tot 3 melden zelf "gelukt" via de server, post 4 en 5 meldt de gsm zelf (locatie en beweging).
4. Het voorwerp komt op de NFC-lezer: de Pi meldt het, de kiosk toont "gevonden" en de legende licht dat voorwerp op.
5. Zijn alle vijf gevonden, dan volgt het einde.
Voorwerp n hoort bij post n.

## Instellen (`public/config.js`)
- `CODES`: de code die na post 4 en 5 getoond wordt.
- `POST4`: coördinaten van het voorwerp (lat, lng). Zolang die leeg zijn werkt post 4 alleen in testmodus.
- `POST5`: eindpunt van het pad en hoe streng "stil" is (`noiseMax`). Zonder eindpunt is de opdracht gelukt na 20 seconden stil lopen.

## Hardware (voorbeelden in `hardware/`, nog niet op echte onderdelen getest)
- Een post meldt: `POST /api/post/<1-3>/solved?key=<HW_KEY>` (of `failed`)
- De NFC-lezer meldt: `POST /api/detect?key=<HW_KEY>` met `{"item": 1..5}`
Zet `HW_KEY` op een geheim woord zodra de server online staat.

## Online zetten
Kies een host die Node draait en https geeft (bijvoorbeeld Render, Railway of Fly.io), met `node server.js` als startopdracht. https is nodig voor locatie en beweging op de gsm. De sessies staan in het geheugen: herstart de server en een lopend spel begint opnieuw.

## Tunnels
Een gratis Cloudflare-tunnel laat de live verbinding (SSE) niet door. De app haalt daarom ook elke 1,5 seconde de toestand op, dus het werkt ook via zo’n tunnel (met een kleine vertraging).

## Bekende beperkingen
- iPhone ondersteunt trillen niet; het scherm toont de balk wel.
- Eén gezin tegelijk op de kiosk (de posten kennen geen gezin).
- Alle teksten bij voorwerpen en opdrachten zijn placeholders; de namen en iconen van de voorwerpen zijn voorlopig.
