# Átlátható Önkormányzati Költségvetés — Nyílt Forráskódú Sablon

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Ez az alkalmazás egy **ingyenes, nyílt forráskódú sablon**, amelynek segítségével **bármelyik magyar önkormányzat** 
létrehozhatja a saját településének látványos, átlátható költségvetési weboldalát.

---

## Funkciók

- **Interaktív grafikonok** — Bevételek és kiadások vizuálisan, évenként összehasonlítva (2019–2026)
- **Polgármesteri köszöntő** — Személyes bevezető szöveg a település vezetőjétől
- **Pénzügyi mutatók** — Pénzügyi autonómia, állami függőség, működési biztonság, adóerő automatikusan számolva
- **Tervezett beruházások** — Kiemelt fejlesztések látványos kártyákon
- **Reszponzív dizájn** — Mobilon, tableten és asztali gépen is tökéletesen néz ki
- **Testreszabható színek** — A település arculatához igazítható egyetlen JSON fájl szerkesztésével
- **Gyors** — Vite + React, modern böngészőkre optimalizálva

---

## Mappaszerkezet

```
├── public/
│   ├── data/
│   │   ├── bevetel.xlsx          # Bevételi Excel adatok (Alaptábla I.)
│   │   └── kiadas.xlsx           # Kiadási Excel adatok (II. Alaptábla)
│   ├── cimer.svg                 # Település címere (SVG vagy PNG)
│   └── mayor.svg                 # Polgármester fotója (SVG vagy PNG)
├── src/
│   ├── App.jsx                   # Fő alkalmazás komponens
│   ├── index.css                 # Globális stílusok (dark glass theme)
│   ├── main.jsx                  # React belépési pont
│   ├── components/
│   │   ├── BudgetChart.jsx       # Fő bevétel/kiadás oszlopdiagram (Recharts)
│   │   ├── BudgetExplanation.jsx # Költségvetési kisokos (kötelező vs önkéntes)
│   │   ├── CategoryBreakdown.jsx # Bevétel/kiadás kategória megoszlás (pie chart)
│   │   ├── KeyIndicators.jsx     # Pénzügyi mutatók (autonómia, adóerő, stb.)
│   │   ├── MayorMessage.jsx      # Polgármesteri köszöntő blokk
│   │   ├── PlannedInvestments.jsx# Tervezett beruházások kártyák
│   │   └── StatCards.jsx         # Összesítő statisztika kártyák (bevétel/kiadás/egyenleg)
│   ├── config/
│   │   ├── config.json           # FŐ KONFIGURÁCIÓS FÁJL (szövegek, színek, képek)
│   │   └── investments.json      # Tervezett beruházások adatai
│   └── utils/
│       └── excelParser.js        # Excel fájlok feldolgozása (XLSX → JSON)
├── index.html                    # HTML belépési pont
├── package.json                  # NPM függőségek
├── vite.config.js                # Vite konfiguráció
└── firebase.json                 # Firebase Hosting konfig (opcionális)
```

---

## Gyorsindítás — Készítsd el a saját városodét! (Programozói tudás NEM kell)

### 1. lépés: Projekt másolása (Fork)

1. Regisztrálj egy ingyenes fiókot a [GitHub.com](https://github.com/)-on
2. Nyisd meg ezt a repót, és a jobb felső sarokban kattints a **"Fork"** gombra
3. Ezzel létrejön egy saját másolat a te fiókodban

### 2. lépés: Település adatainak beállítása (`config.json`)

Navigálj a `src/config/config.json` fájlhoz a GitHub felületén, és kattints a ceruza ikonra (szerkesztés).

| Mező | Leírás | Példa |
|------|--------|-------|
| `varosNeve` | A település hivatalos neve | `"Példaváros Önkormányzata"` |
| `alapEv` | A legfrissebb terv-év | `2026` |
| `szinek.elsodleges` | Fő szín (hex kód) — fejléc, gombok | `"#034E81"` |
| `szinek.masodlagos` | Másodlagos szín — bevételi grafikonok | `"#00582A"` |
| `szinek.harmadlagos` | Kiegészítő szín — kiemelések | `"#3681B4"` |
| `elerhetoseg.cim` | Önkormányzat postacíme | `"1234 Példaváros, Fő u. 1."` |
| `elerhetoseg.weboldal` | Hivatalos weboldal URL | `"https://peldavaros.hu"` |
| `szovegek.polgarmesterNeve` | Polgármester neve | `"Dr. Példa János"` |
| `szovegek.polgarmesterKoszonto` | Köszöntő szöveg (HTML tagek is használhatók: `<strong>`, `<br>`) | Lásd a fájlban |
| `kepek.cimer` | Címer fájl elérési útja | `"/cimer.svg"` |
| `kepek.polgarmester` | Polgármester fotó elérési útja | `"/mayor.svg"` |

> **Tipp:** A szövegekben használhatsz `{varosNeve}` és `{alapEv}` változókat, amiket az alkalmazás automatikusan behelyettesít!

#### Szekciók ki/bekapcsolása

A `config.json` `szekciok` blokkjában egyszerű `true`/`false` kapcsolókkal szabályozhatod, mely szekciók jelenjenek meg az oldalon:

```json
"szekciok": {
    "polgarmesteriUzenet": true,       // Polgármesteri köszöntő blokk
    "beruhazasok": true,               // Tervezett beruházások kártyák
    "kulcsindikatorok": true,          // Pénzügyi mutatók (autonómia, adóerő)
    "szolidaritasiGrafikon": true,     // Szolidaritási hozzájárulás vonalgraf
    "koltsegvetesiKisokos": true,      // "Hogyan épül fel a költségvetés?" kisokos
    "bevetelMegoszlas": true,          // Bevétel kategória megoszlás (pie chart)
    "kiadasMegoszlas": true            // Kiadás kategória megoszlás (pie chart)
}
```

> Például ha nincs szükséged a szolidaritási grafikonra: `"szolidaritasiGrafikon": false`

### 3. lépés: Excel adatok feltöltése

A grafikonok a `public/data/` mappában lévő két Excel fájlból nyerik az adatokat. A sablon fájlok már készen várnak — csak töltsd ki a saját adataiddal!

| Fájl | Tartalom | Munkalap neve |
|------|----------|---------------|
| `bevetel.xlsx` | Működési bevételek | `Alaptábla I.` |
| `kiadas.xlsx` | Működési kiadások | `II. Alaptábla` |

**Az Excel fájlok szerkezete nagyon egyszerű — soronként 1 év:**

**Bevételek (`bevetel.xlsx`):**
| Oszlop | Fejléc | Tartalom |
|--------|--------|----------|
| **A** | Év | Az évszám (pl. `2019`, `2026`) |
| **B** | Összes bevétel (eFt) | Az összes működési bevétel, ezer forintban |
| **C** | Állami támogatás (eFt) | Központi költségvetésből kapott támogatás |
| **D** | Közhatalmi bevétel (eFt) | Közhatalmi jellegű bevételek |
| **E** | Iparűzési adó (eFt) | Helyi iparűzési adó |
| **F** | Építményadó (eFt) | Építményadó |
| **G** | Telekadó (eFt) | Telekadó |
| **H** | Működési bevétel (eFt) | Egyéb működési bevételek |
| **I** | Átvett pénzeszközök (eFt) | Más szervezetektől átvett pénzeszközök |

**Kiadások (`kiadas.xlsx`):**
| Oszlop | Fejléc | Tartalom |
|--------|--------|----------|
| **A** | Év | Az évszám (pl. `2019`, `2026`) |
| **B** | Összes kiadás (eFt) | Az összes működési kiadás, ezer forintban |
| **C** | Személyi jellegű (eFt) | Személyi jellegű kiadások (bérek) |
| **D** | Munkaadói járulék (eFt) | Munkaadókat terhelő járulékok |
| **E** | Dologi kiadás (eFt) | Dologi jellegű kiadások |
| **F** | Pénzbeni juttatás (eFt) | Pénzbeni és természetbeni juttatások |
| **G** | Egyéb kiadás (eFt) | Egyéb működési kiadások |
| **H** | Szolidaritási hozzájárulás (eFt) | Szolidaritási hozzájárulás (ha van) |

> **Az első sor fejléc** (a sablon már tartalmazza), utána jönnek az adatsorok évenként.
>
> A `config.json`-ban megadott `alapEv` évszámú sor automatikusan **"Terv"**-ként, az összes korábbi év **"Tény"**-ként jelenik meg.
>
> **Az évek száma és tartománya teljesen rugalmas!** Csak azok az évek jelennek meg, amelyekhez van adat mindkét fájlban. Ha pl. csak 2021–2026 közötti adataid vannak, egyszerűen töröld a 2019-es és 2020-as sorokat az Excelből — az oldal automatikusan alkalmazkodik.

### 4. lépés: Képek cseréje

A `public/` mappába töltsd fel:

| Fájl | Leírás | Javasolt méret |
|------|--------|----------------|
| `cimer.svg` vagy `cimer.png` | Település címere | SVG ajánlott (skálázható) |
| `mayor.svg` vagy `mayor.png` | Polgármester portréfotója | ~400×500px, átlátszó háttérrel ideális |

> Ha más fájlnevet vagy kiterjesztést használsz, ne felejtsd el a `config.json` `kepek` szekciójában is frissíteni az elérési útvonalakat!

### 5. lépés: Tervezett beruházások (opcionális)

A `src/config/investments.json` fájlban szerkesztheted a kiemelt beruházásokat. Ezek kártyaként jelennek meg az oldalon.

**Új kártya hozzáadása** — egyszerűen adj hozzá egy új `{ }` blokkot a listához:

```json
[
  {
    "icon": "Building2",
    "colorRef": "elsodleges",
    "title": "Iskola felújítás",
    "amount": "150 millió Ft",
    "desc": "A Kossuth Lajos Általános Iskola teljes energetikai korszerűsítése."
  },
  {
    "icon": "Route",
    "colorRef": "masodlagos",
    "title": "Petőfi utca felújítás",
    "amount": "45 millió Ft",
    "desc": "Teljes burkolatcsere és járda építés."
  }
]
```

| Mező | Leírás | Kötelező? |
|------|--------|-----------|
| `icon` | Ikon neve a Lucide könyvtárból | Igen |
| `colorRef` | Szín hivatkozás: `elsodleges`, `masodlagos`, vagy `harmadlagos` | Igen |
| `title` | A beruházás neve | Igen |
| `amount` | Összeg vagy szöveges állapot (pl. `"Tervezési fázis"`) | Igen |
| `desc` | Rövid, 1-2 mondatos leírás | Igen |

> **Kártya törlése:** Egyszerűen töröld a `{ }` blokkot a fájlból.
> **Összes kártya elrejtése:** Állítsd `false`-ra a `config.json`-ban: `"beruhazasok": false`

**Népszerű ikonok** (a [Lucide Icons](https://lucide.dev/icons/) könyvtárból):
`Building2` (épület), `Route` (út), `MapPin` (helyszín), `Bus` (közlekedés), `GraduationCap` (oktatás), `Stethoscope` (egészségügy), `TreePine` (zöldterület), `Droplets` (víz), `Zap` (energia), `Home` (lakás), `Heart` (szociális), `Shield` (biztonság), `Landmark` (intézmény), `Smile` (gyerek/játszótér), `Dog` (állatvédelem)

---

## Ingyenes közzététel

### Vercel

1. Regisztrálj a [Vercel](https://vercel.com/)-re a GitHub fiókoddal
2. Kattints az **"Add New Project"** gombra
3. Importáld a forkolt repódat
4. A Framework Preset legyen **Vite**
5. Kattints a **Deploy** gombra

1 percen belül él az oldalad, kapsz hozzá egy ingyenes linket (pl. `koltsegvetes-peldavaros.vercel.app`)

### Netlify (Alternatíva)

1. Regisztrálj a [Netlify](https://netlify.com/)-re
2. "Add new site" → "Import an existing project"
3. Build command: `npm run build`
4. Publish directory: `dist`

### Firebase Hosting

A projektben található `firebase.json` már előkonfigurált:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # Válaszd a "dist" mappát
npm run build
firebase deploy
```

### Saját szerver / egyedi domain

```bash
npm i && npm run build
```
A `dist/` mappa tartalmát másold fel bármelyik statikus hosting szolgáltatásra (Apache, Nginx, stb.).

---

## Fejlesztőknek

### Előfeltételek
- [Node.js](https://nodejs.org/) 18+ (LTS ajánlott)
- npm (a Node.js-sel együtt települ)

### Telepítés és indítás

```bash
# 1. Repó klónozása
git clone https://github.com/TE-FELHASZNALONEVED/koltsegvetes.git
cd koltsegvetes

# 2. Függőségek telepítése
npm install

# 3. Fejlesztői szerver indítása (hot reload)
npm run dev
# → Megnyílik: http://localhost:5173

# 4. Éles build készítése
npm run build
# → A kész fájlok a dist/ mappába kerülnek

# 5. Éles build lokális tesztelése
npm run preview
```

### Használt technológiák

| Technológia | Verzió | Leírás |
|-------------|--------|--------|
| [React](https://react.dev/) | 18.3 | UI keretrendszer |
| [Vite](https://vite.dev/) | 5.4 | Build eszköz és dev szerver |
| [Recharts](https://recharts.org/) | 3.7 | Interaktív SVG grafikonok |
| [Lucide React](https://lucide.dev/) | 0.575 | Modern ikon könyvtár |
| [SheetJS (xlsx)](https://sheetjs.com/) | 0.18 | Excel fájlok olvasása a böngészőben |

### Az `excelParser.js` testreszabása

Az alap sablon Excel fájlokat a legtöbb önkormányzat változtatás nélkül használhatja. Ha mégis más oszlopelrendezésre van szükséged:

1. Az `src/utils/excelParser.js` fájl tetején megtalálod a részletes oszloptérképet (ASCII tábla formájában)
2. A `bevRow[1]`, `bevRow[2]`, stb. indexek az Excel oszlopainak felelnek meg (0 = A, 1 = B, 2 = C, ...)
3. Új oszlop hozzáadásához: add hozzá az indexet a parserben, és bővítsd a `results.push(...)` objektumot
4. A `config.json` `alapEv` mezője határozza meg, melyik év lesz "Terv" — nem kell kódot módosítani ehhez!

---

## Gyakran Ismételt Kérdések (FAQ)

**K: Szükségem van programozói tudásra?**
V: Nem! Ha csak a szövegeket, színeket és adatokat módosítod, elég a GitHub webes felülete. Minden beállítás a `config.json` és `investments.json` fájlokban van.

**K: Mennyibe kerül az üzemeltetés?**
V: Semennyibe. A Vercel és Netlify ingyenes csomagjai bőven elegendőek egy önkormányzati oldalhoz.

**K: Más formátumú Excelt is tudok használni?**
V: Igen, de az `excelParser.js` fájlt módosítani kell, hogy az oszlopindexek megegyezzenek a te táblázatoddal.

**K: Hogyan frissítsem az adatokat évente?**
V: Egyszerűen cseréld le a `public/data/` mappában lévő Excel fájlokat, adj hozzá új sort az új évvel, és frissítsd az `alapEv` értéket a `config.json`-ban.

**K: Használhatok egyedi domaint?**
V: Igen! A Vercel, Netlify és Firebase is támogatja az egyedi domain hozzárendelést az ingyenes csomagban.

**K: Hogyan rejtsek el egy szekciót az oldalról?**
V: A `config.json`-ban a `szekciok` blokkban állítsd `false`-ra a megfelelő kulcsot. Például polgármesteri üzenet elrejtése: `"polgarmesteriUzenet": false`.

**K: Kevesebb évet szeretnék mutatni (pl. csak az utolsó 4-5 évet). Hogyan?**
V: Az oldalon annyi év jelenik meg, amennyi az Excelben szerepel. Egyszerűen töröld a felesleges sorokat az Excel fájlokból, és az oldal automatikusan alkalmazkodik.

**K: Hogyan adjak hozzá vagy töröljem a beruházás-kártyákat?**
V: Az `investments.json` fájlban egyszerűen adj hozzá vagy törölj egy `{ }` blokkot. Ha az összes kártyát el akarod rejteni, állítsd `"beruhazasok": false`-ra a `config.json`-ban.

---

## Licenc

Ez a projekt MIT licenc alatt áll — szabadon felhasználható, módosítható és terjeszthető, akár kereskedelmi célra is.

**Készült a magyar települési transzparencia előmozdítására.**
