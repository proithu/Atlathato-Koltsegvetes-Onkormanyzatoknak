import * as XLSX from 'xlsx';
import config from '../config/config.json';

// Utility to clean up and parse a cell value as a number
const EZER = 1000;
const parseValue = (val) => {
    if (val === undefined || val === null || val === '-' || val === '') return 0;
    if (typeof val === 'number') return val * EZER;
    const num = Number(String(val).replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num * EZER;
};

/**
 * Excel struktúra (mindkét fájl):
 *
 * bevetel.xlsx — munkalap: "Alaptábla I."
 * ┌──────┬────────────────┬──────────────────┬─────────────┬──────────────┬─────────────┬──────────┬─────────────┬──────────────────────┐
 * │  Év  │ Összes bevétel │ Állami támogatás │ Közhatalmi  │ Iparűzési    │ Építményadó │ Telekadó │ Működési    │ Átvett pénzeszközök  │
 * │  (A) │     (B)        │      (C)         │    (D)      │    (E)       │    (F)      │   (G)    │    (H)      │        (I)           │
 * ├──────┼────────────────┼──────────────────┼─────────────┼──────────────┼─────────────┼──────────┼─────────────┼──────────────────────┤
 * │ 2019 │    ...         │     ...          │    ...      │    ...       │    ...      │   ...    │    ...      │        ...           │
 * │ 2026 │    ...         │     ...          │    ...      │    ...       │    ...      │   ...    │    ...      │        ...           │
 * └──────┴────────────────┴──────────────────┴─────────────┴──────────────┴─────────────┴──────────┴─────────────┴──────────────────────┘
 *
 * kiadas.xlsx — munkalap: "II. Alaptábla"
 * ┌──────┬────────────────┬─────────────┬──────────┬─────────┬────────────┬──────────┬──────────────────────────┐
 * │  Év  │ Összes kiadás  │ Személyi    │ Járulék  │ Dologi  │ Pénzbeni   │  Egyéb   │ Szolidaritási hozzájár.  │
 * │  (A) │     (B)        │    (C)      │   (D)    │   (E)   │    (F)     │   (G)    │          (H)             │
 * ├──────┼────────────────┼─────────────┼──────────┼─────────┼────────────┼──────────┼──────────────────────────┤
 * │ 2019 │    ...         │    ...      │   ...    │   ...   │    ...     │   ...    │          ...             │
 * │ 2026 │    ...         │    ...      │   ...    │   ...   │    ...     │   ...    │          ...             │
 * └──────┴────────────────┴─────────────┴──────────┴─────────┴────────────┴──────────┴──────────────────────────┘
 *
 * Az első sor fejléc. Az adatsorok A oszlopában az évszám áll.
 * A legutolsó év (config.alapEv) automatikusan "Terv"-ként jelenik meg.
 */

export const fetchAndParseData = async () => {
    try {
        const [bevRes, kiadRes] = await Promise.all([
            fetch('/data/bevetel.xlsx'),
            fetch('/data/kiadas.xlsx')
        ]);

        const bevBuffer = await bevRes.arrayBuffer();
        const kiadBuffer = await kiadRes.arrayBuffer();

        const bevObj = XLSX.read(bevBuffer, { type: 'array' });
        const kiadObj = XLSX.read(kiadBuffer, { type: 'array' });

        // Munkalapok keresése név alapján, fallback az első lapra
        const bevSheet = bevObj.Sheets['Alaptábla I.'] || bevObj.Sheets[bevObj.SheetNames[0]];
        const kiadSheet = kiadObj.Sheets['II. Alaptábla'] || kiadObj.Sheets[kiadObj.SheetNames[0]];

        const bevData = XLSX.utils.sheet_to_json(bevSheet, { header: 1 });
        const kiadData = XLSX.utils.sheet_to_json(kiadSheet, { header: 1 });

        const results = [];

        // Az első sort fejlécnek tekintjük, a többi sor = 1 év adata
        const isYearRow = (row) => row[0] && !isNaN(parseInt(String(row[0])));

        const bevRows = bevData.filter(isYearRow);
        const kiadRows = kiadData.filter(isYearRow);

        for (const bevRow of bevRows) {
            const year = parseInt(String(bevRow[0]));
            const kiadRow = kiadRows.find(r => parseInt(String(r[0])) === year);

            if (!kiadRow) {
                console.warn(`Nincs kiadási adat a(z) ${year}. évhez`);
                continue;
            }

            const isPlan = year === config.alapEv;

            // Bevételek — egyszerű, egymás utáni oszlopok (B-tól I-ig)
            const bevO     = bevRow[1];  // B: Összes bevétel
            const bevAllam = bevRow[2];  // C: Állami támogatás
            const bevK     = bevRow[3];  // D: Közhatalmi bevétel
            const bevIpa   = bevRow[4];  // E: Iparűzési adó
            const bevEpit  = bevRow[5];  // F: Építményadó
            const bevTelek = bevRow[6];  // G: Telekadó
            const bevM     = bevRow[7];  // H: Működési bevétel
            const bevA     = bevRow[8];  // I: Átvett pénzeszközök

            // Kiadások — egyszerű, egymás utáni oszlopok (B-tól H-ig)
            const kiadO            = kiadRow[1];  // B: Összes kiadás
            const kiadSz           = kiadRow[2];  // C: Személyi jellegű
            const kiadJ            = kiadRow[3];  // D: Munkaadói járulék
            const kiadD            = kiadRow[4];  // E: Dologi kiadás
            const kiadP            = kiadRow[5];  // F: Pénzbeni juttatás
            const kiadE            = kiadRow[6];  // G: Egyéb kiadás
            const kiadSzolidaritas = kiadRow[7];  // H: Szolidaritási hozzájárulás

            results.push({
                year,
                isPlan,
                income: {
                    total: parseValue(bevO),
                    kozh: parseValue(bevK),
                    ipa: parseValue(bevIpa),
                    epitmeny: parseValue(bevEpit),
                    telek: parseValue(bevTelek),
                    mukod: parseValue(bevM),
                    atvett: parseValue(bevA),
                    allam: parseValue(bevAllam),
                    sajat: parseValue(bevK) + parseValue(bevM) + parseValue(bevA)
                },
                expense: {
                    total: parseValue(kiadO),
                    szemelyi: parseValue(kiadSz),
                    jarulek: parseValue(kiadJ),
                    dologi: parseValue(kiadD),
                    penzbeni: parseValue(kiadP),
                    egyeb: parseValue(kiadE),
                    szolidaritas: parseValue(kiadSzolidaritas)
                },
                balance: parseValue(bevO) - parseValue(kiadO)
            });
        }

        // Évek szerinti rendezés
        results.sort((a, b) => a.year - b.year);

        // Éves növekedési százalékok (YoY) számítása
        for (let i = 0; i < results.length; i++) {
            const current = results[i];
            if (i === 0) {
                current.yoy = { incomeTotal: 0, expenseTotal: 0, taxTotal: 0, dologi: 0 };
            } else {
                const prev = results[i - 1];
                const currTax = current.income.ipa + current.income.epitmeny + current.income.telek;
                const prevTax = prev.income.ipa + prev.income.epitmeny + prev.income.telek;

                const calcGrowth = (currVal, prevVal) => prevVal > 0 ? ((currVal - prevVal) / prevVal) : 0;

                current.yoy = {
                    incomeTotal: calcGrowth(current.income.total, prev.income.total),
                    expenseTotal: calcGrowth(current.expense.total, prev.expense.total),
                    taxTotal: calcGrowth(currTax, prevTax),
                    ipa: calcGrowth(current.income.ipa, prev.income.ipa),
                    epitmeny: calcGrowth(current.income.epitmeny, prev.income.epitmeny),
                    telek: calcGrowth(current.income.telek, prev.income.telek),
                    dologi: calcGrowth(current.expense.dologi, prev.expense.dologi)
                };
            }
        }

        return results;
    } catch (error) {
        console.error("Hiba az Excel adatok betöltésekor: ", error);
        return [];
    }
};
