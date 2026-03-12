import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS_INCOME = ['#00582A', '#3681B4', '#034E81', '#5A94B8'];
const COLORS_EXPENSE = ['#F87171', '#EF4444', '#DC2626', '#B91C1C', '#7F1D1D'];

const formatCurrency = (value) =>
    new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(value);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{data.name}</p>
                <p style={{ color: payload[0].color, fontSize: '1.2rem', fontWeight: 700 }}>
                    {formatCurrency(data.value)}
                </p>
            </div>
        );
    }
    return null;
};

export default function CategoryBreakdown({ data, type }) {
    if (!data) return null;

    let chartData = [];
    let colors = [];
    let title = '';

    if (type === 'income') {
        title = 'Működési költségvetési bevételek';
        colors = COLORS_INCOME;
        chartData = [
            { name: 'Közhatalmi bevétel', value: data.income.kozh },
            { name: 'Működési bevétel', value: data.income.mukod },
            { name: 'Átvett pénzeszköz', value: data.income.atvett },
            // Other calculation (maradék ha van)
            { name: 'Egyéb támogatás/bevétel', value: Math.max(0, data.income.total - (data.income.kozh + data.income.mukod + data.income.atvett)) }
        ];
    } else {
        title = 'Működési költségvetési kiadások';
        colors = COLORS_EXPENSE;
        chartData = [
            { name: 'Személyi', value: data.expense.szemelyi },
            { name: 'Járulék', value: data.expense.jarulek },
            { name: 'Dologi', value: data.expense.dologi },
            { name: 'Pénzbeni juttatás', value: data.expense.penzbeni },
            { name: 'Egyéb', value: data.expense.egyeb },
        ];
    }

    // szures, hogy csak a nullanal nagyobb vagy 0-nal nagyobb ertekeket mutassuk
    chartData = chartData.filter(item => item.value > 0);

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '400px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{title} ({data.year})</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
