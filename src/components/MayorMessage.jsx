import React from 'react';
import { Quote } from 'lucide-react';
import config from '../config/config.json';

export default function MayorMessage({ data }) {
    if (!data || data.year !== config.alapEv) return null;

    return (
        <div className="glass-panel" style={{
            padding: '2rem',
            marginBottom: '2rem',
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            borderLeft: '4px solid var(--brand-primary)',
            background: 'linear-gradient(135deg, rgba(3, 78, 129, 0.05) 0%, rgba(54, 129, 180, 0.05) 100%)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Quote size={32} color="var(--brand-primary)" style={{ opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>A {config.alapEv}-os elfogadott költségvetés – polgármesteri tájékoztató</h3>
            </div>

            <div style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--brand-primary)',
                    flexShrink: 0,
                    background: 'var(--surface)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <img
                        src={config.kepek.polgarmester}
                        alt={`${config.szovegek.polgarmesterNeve} polgármester`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback avatar ha nincs feltöltve kép azonos helyen */}
                    <div style={{
                        display: 'none',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--brand-primary)'
                    }}>{config.szovegek.polgarmesterNeve.split(' ').map(n => n[0]).join('')}</div>
                </div>

                <div style={{ flex: 1, minWidth: 'min(100%, 300px)' }}>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                        <strong style={{ color: 'var(--text-main)', fontStyle: 'normal' }}>{config.szovegek.polgarmesterNeve} (polgármester):</strong> <q dangerouslySetInnerHTML={{ __html: config.szovegek.polgarmesterKoszonto.replace('{alapEv}', config.alapEv).replace('{varosNeve}', config.varosNeve.split(' ')[0]) }} />
                    </p>
                </div>
            </div>
        </div>
    );
}
