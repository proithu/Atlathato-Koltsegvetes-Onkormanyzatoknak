import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import config from '../config/config.json';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isPlan = data.isPlan;

        return (
            <div className="glass-panel" style={{ padding: '1rem', border: isPlan ? '1px solid var(--brand-primary)' : '' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{label} {isPlan && '(Tervezet)'}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {payload.map((entry, index) => (
                        <div key={index} style={{ color: entry.color, display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                            <span>{entry.name}:</span>
                            <strong>{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(entry.value)}</strong>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function BudgetChart({ data, onYearClick, selectedYear }) {
    // Map data to display format
    const chartData = data.map(item => ({
        name: item.year.toString(),
        "Működési bevétel": item.income.total,
        "Működési kiadás": item.expense.total,
        Egyenleg: item.balance,
        isPlan: item.isPlan,
        year: item.year
    }));

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '400px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>Költségvetési trendek (éves bontás)</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 30, right: 30, left: 20, bottom: 0 }}
                        onClick={(e) => {
                            if (e && e.activePayload) {
                                onYearClick(e.activePayload[0].payload.year);
                            }
                        }}
                    >
                        <defs>
                            <linearGradient id="colorBev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-income)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--accent-income)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorKiad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-expense)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--accent-expense)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)' }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value / 1e9).toLocaleString('hu-HU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mrd`}
                            width={65}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.15)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <ReferenceLine x={(config.alapEv - 1).toString()} stroke="var(--brand-primary)" strokeDasharray="3 3" label={{ position: 'top', value: 'Tény → Terv', fill: 'var(--brand-primary)', fontSize: 12 }} />

                        <Area
                            type="monotone"
                            dataKey="Működési bevétel"
                            stroke="var(--accent-income)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorBev)"
                            activeDot={{ r: 8, fill: 'var(--accent-income)', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Működési kiadás"
                            stroke="var(--accent-expense)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorKiad)"
                            activeDot={{ r: 8, fill: 'var(--accent-expense)', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
