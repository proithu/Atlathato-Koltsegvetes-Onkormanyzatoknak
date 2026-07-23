import React from 'react';
import { Banknote, Building2, ShieldCheck, Wallet } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import config from '../config/config.json';

const formatPercent = (val) => {
    return new Intl.NumberFormat('hu-HU', { style: 'percent', maximumFractionDigits: 1 }).format(val);
};

const formatCurrencyMio = (val) => {
    return new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0
    }).format(val);
};

const formatYoY = (val) => {
    if (!val) return null;
    const isPositive = val > 0;
    const color = isPositive ? 'var(--accent-income)' : 'var(--accent-expense)';

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: '0.75rem', fontWeight: 600, color: color,
            background: `rgba(${isPositive ? '16, 185, 129' : '239, 68, 68'}, 0.1)`,
            padding: '2px 6px', borderRadius: '12px', marginLeft: '6px'
        }}>
            {isPositive ? '▲' : '▼'} {Math.abs(val * 100).toFixed(1)}%
        </span>
    );
};


export default function KeyIndicators({ data, historicalData }) {
    if (!data) return null;

    // 1. Pénzügyi Autonómia (Saját bevételek vs Összes)
    const autonomyRate = data.income.sajat / data.income.total;

    // 2. Kiszolgáltatottság (Állami vs Összes)
    const stateDependencyRate = data.income.allam / data.income.total;

    // 3. Működési Biztonság (Kötelező fenntartás: Személyi + Dologi)
    const mandatoryExpenses = data.expense.szemelyi + data.expense.dologi + data.expense.jarulek;
    const operationSafetyRate = mandatoryExpenses / data.expense.total;

    // 4. Adóerősség
    const totalLocalTax = data.income.ipa + data.income.epitmeny + data.income.telek;
    const ipaRatio = totalLocalTax > 0 ? data.income.ipa / totalLocalTax : 0;
    const epitmenyTelekRatio = totalLocalTax > 0 ? (data.income.epitmeny + data.income.telek) / totalLocalTax : 0;

    // Trend data for autonomy
    const trendData = historicalData.map(d => ({
        year: d.year,
        Autonómia: (d.income.sajat / d.income.total) * 100,
        Függőség: (d.income.allam / d.income.total) * 100,
    }));

    // Trend data for local taxes
    const taxTrendData = historicalData.map(d => ({
        year: d.year,
        Iparűzési: d.income.ipa,
        "Építmény- és telekadó": d.income.epitmeny + d.income.telek
    }));

    // Trend for Solidarity Tax
    const solidarityTrend = historicalData.map(d => ({
        year: d.year,
        "Szolidaritási hozzájárulás": d.expense.szolidaritas || 0
    }));

    return (
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--brand-primary)" /> Kulcsindikátorok ({data.year})
            </h3>

            <div className="grid-cards">

                {/* Pénzügyi Autonómia */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #034E81' }}>
                    <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(3, 78, 129, 0.2)', borderRadius: '12px' }}>
                            <Wallet size={24} color="#034E81" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Pénzügyi autonómia</p>
                            <h2 style={{ fontSize: '1.8rem' }}>{formatPercent(autonomyRate)}</h2>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Saját bevételek (adók, működési bevételek, előző évi maradvány) aránya a teljes bevételből, levonva belőle a szolidaritási hozzájárulást. Magasabb érték nagyobb önállóságot jelent, de kiemelendő, hogy a saját bevételekből is elsősorban az önkormányzat kötelező feladatait kell finanszírozni, csak az ez után megmaradó rész fordítható önként vállalt feladatokra, fejlesztésre, tartalékképzésre.
                    </p>
                </div>

                {/* Állami Kiszolgáltatottság */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
                            <Banknote size={24} color="#f59e0b" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Állami finanszírozás</p>
                            <h2 style={{ fontSize: '1.8rem' }}>{formatPercent(stateDependencyRate)}</h2>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Államháztartáson belüli támogatások aránya. Normatív támogatás és pályázaton elnyert támogatások. Kiegészíti a puszta saját erőt.
                    </p>
                </div>

                {/* Működési Költség Biztonság */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ec4899' }}>
                    <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
                            <Building2 size={24} color="#ec4899" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Működtetési teher</p>
                            <h2 style={{ fontSize: '1.8rem' }}>{formatPercent(operationSafetyRate)}</h2>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Személyi és dologi kiadások, az intézmények finanszírozása (óvoda, önkormányzati hivatal) aránya az összkiadásból. Alacsonyabb érték = több pénz marad fejlesztésekre, tartalékképzésre.
                    </p>
                </div>

            </div>

            <div className="grid-charts" style={{ marginTop: '1.5rem' }}>

                {/* Trend of Autonomy */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Autonómia/állami finanszírozás trendje</h4>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                                <Tooltip
                                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    separator=": "
                                    formatter={(value) => new Intl.NumberFormat('hu-HU', { style: 'percent', maximumFractionDigits: 1 }).format(value / 100)}
                                />
                                <Area type="monotone" dataKey="Autonómia" stackId="1" stroke="#034E81" fill="#034E81" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Függőség" stackId="1" stroke="#3681B4" fill="#3681B4" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Helyi Adóerősség (Trend és Megoszlás) */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="responsive-header">
                        <div>
                            <h4 style={{ color: 'var(--text-muted)' }}>Helyi adók növekedése (M Ft)</h4>
                            {/* Ide írhatsz települési adópolitikai megjegyzést, ha van ilyen */}
                        </div>
                        <div className="responsive-stats">
                            <div className="responsive-stats-row">
                                IPA arány ({data.year}): {formatPercent(ipaRatio)}
                                {data.yoy && formatYoY(data.yoy.ipa)}
                            </div>
                            <div className="responsive-stats-row" style={{ marginBottom: 0 }}>
                                Építmény- és telekadó arány: {formatPercent(epitmenyTelekRatio)}
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={taxTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${(value / 1e6).toFixed(0)}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    separator=": "
                                    formatter={(value) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(value)}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }} />
                                <Bar dataKey="Iparűzési" stackId="a" fill="#034E81" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Építmény- és telekadó" stackId="a" fill="#00582A" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Szolidaritási Hozzájárulás — config.szekciok.szolidaritasiGrafikon */}
            {config.szekciok?.szolidaritasiGrafikon !== false && <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
                <div className="responsive-header" style={{ alignItems: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>Szolidaritási hozzájárulás</h4>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ef4444', textAlign: 'right' }}>
                        {formatCurrencyMio(data.expense.szolidaritas)} ({data.year})
                    </span>
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={solidarityTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                            <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `${(value / 1e6).toFixed(0)} M`}
                            />
                            <Tooltip
                                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)' }}
                                itemStyle={{ fontWeight: 'bold', color: '#ef4444' }}
                                separator=": "
                                formatter={(value) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(value)}
                            />
                            <Line type="monotone" dataKey="Szolidaritási hozzájárulás" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>}

        </div>
    );
}
