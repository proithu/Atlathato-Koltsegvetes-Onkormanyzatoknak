import React from 'react';
import { ArrowUpRight, ArrowDownRight, Scale, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import config from '../config/config.json';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0
    }).format(value);
};

const formatYoY = (val) => {
    if (!val) return null;
    const isPositive = val > 0;
    const color = isPositive ? 'var(--accent-income)' : 'var(--accent-expense)';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.8rem', fontWeight: 600, color: color,
            background: `rgba(${isPositive ? '16, 185, 129' : '239, 68, 68'}, 0.1)`,
            padding: '2px 8px', borderRadius: '12px', marginLeft: '8px'
        }}>
            <Icon size={12} />
            {isPositive ? '+' : ''}{(val * 100).toFixed(1)}%
        </span>
    );
};

export default function StatCards({ data }) {
    if (!data) return null;

    const isPositiveBalance = data.balance >= 0;

    return (
        <div className="grid-cards">
            {/* Költségvetési Bevétel */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-income)' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                            Költségvetési bevétel ({data.year})
                            {data.yoy && formatYoY(data.yoy.incomeTotal)}
                        </p>
                        <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{formatCurrency(data.income.total)}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--accent-income-glow)', borderRadius: '50%' }}>
                        <ArrowDownRight size={28} className="text-income" />
                    </div>
                </div>
            </div>

            {/* Költségvetési Kiadás */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-expense)' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                            Működési költségvetési kiadás ({data.year})
                            {data.yoy && formatYoY(data.yoy.expenseTotal)}
                        </p>
                        <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{formatCurrency(data.expense.total)}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--accent-expense-glow)', borderRadius: '50%' }}>
                        <ArrowUpRight size={28} className="text-expense" />
                    </div>
                </div>
            </div>

            {/* Egyenleg */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: isPositiveBalance ? '4px solid var(--accent-income)' : '4px solid var(--accent-expense)' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Működési költségvetési egyenleg ({data.year})
                        </p>
                        <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: isPositiveBalance ? 'var(--accent-income)' : 'var(--accent-expense)' }}>
                            {formatCurrency(data.balance)}
                        </h2>
                    </div>
                    <div style={{ padding: '1rem', background: isPositiveBalance ? 'var(--accent-income-glow)' : 'var(--accent-expense-glow)', borderRadius: '50%' }}>
                        <Scale size={28} color={isPositiveBalance ? 'var(--accent-income)' : 'var(--accent-expense)'} />
                    </div>
                </div>
            </div>

            {/* Opcionális figyelmeztetés a negatív egyenlegre a tervezett évben */}
            {data.year === config.alapEv && (
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(202, 138, 4, 0.1)',
                    border: '1px solid rgba(202, 138, 4, 0.4)',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: '#CA8A04',
                    marginTop: '0.5rem'
                }}>
                    <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--text-muted)', margin: 0 }}>
                        <strong style={{ color: '#CA8A04' }}>Figyelem:</strong> Összköltségvetési szinten nem keletkezik valós hiány, mivel azt az előző évi maradvány fedezi. Ez egy teljesen normális tervezési folyamat.
                    </p>
                </div>
            )}
        </div>
    );
}
