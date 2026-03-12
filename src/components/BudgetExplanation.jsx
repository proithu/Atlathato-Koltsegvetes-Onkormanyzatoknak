import React from 'react';
import { BookOpen, CalendarHeart, Settings, TrendingUp, HandCoins } from 'lucide-react';
import config from '../config/config.json';

export default function BudgetExplanation() {
    return (
        <div className="glass-panel" style={{
            marginTop: '3rem',
            marginBottom: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--brand-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                    <BookOpen size={28} /> Kisokos: Hogyan épül fel a költségvetés?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                    Egy önkormányzat költségvetésének megértése kulcsfontosságú a transzparens városvezetéshez.
                    Az alábbi rövid útmutató segít eligazodni abban, honnan lesz pénze a városnak és hogyan tervezi meg a jövőt.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                {/* 1. Tervezési folyamat */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', color: '#6366f1' }}>
                            <CalendarHeart size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>1. A tervezési folyamat</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        A következő év költségvetésének tervezése már az előző év őszén elkezdődik. Először a <strong>kötelező feladatokat</strong> ({config.szovegek.kisokosPeldak.kotelezo}) kell biztosítani. Miután ezek megvannak, a fennmaradó keretet a képviselő-testület a <strong>{config.szovegek.kisokosPeldak.onkentes}</strong> (önként vállalt feladatok) csoportosítja.
                    </p>
                </div>

                {/* 2. Működési vs Felhalmozási */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px', color: '#ef4444' }}>
                            <Settings size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>2. Működési kiadások</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        A város mindennapos túléléséhez szükséges pénzek. Ide tartoznak a bérköltségek (személyi juttatások), a közműdíjak és külsős szolgáltatások (dologi kiadások),
                        valamint az <strong>állam felé fizetendő, kötelező szolidaritási hozzájárulás</strong> (ami a tehetősebb településektől elvont pénz a szegényebbek javára).
                    </p>
                </div>

                {/* 3. Fejlesztések */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', color: '#3b82f6' }}>
                            <TrendingUp size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>3. Beruházások (felhalmozás)</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        Ezekből a forrásokból épülnek az új utak, óvodák, egészségügyi intézmények és újulnak meg a közterek.
                        A beruházásokhoz az önkormányzat <strong>saját forrást</strong>, illetve (ha van rá lehetőség) <strong>hazai vagy EU-s pályázati támogatásokat</strong> használ fel.
                        Ezek alkotják a város vagyonának növekedését.
                    </p>
                </div>

                {/* 4. Bevételek és Helyi Adók */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: '#10b981' }}>
                            <HandCoins size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>4. Honnan van a pénz?</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        A költségvetés gerincét a központi állami támogatások (amik a lakosság számától és feladatoktól függenek) és a <strong>helyi adók</strong> (iparűzési adó – IPA, építményadó) adják.
                        Minél stabilabb a helyi gazdaság és minél több vállalkozás működik a városban, annál több jut utána fejlesztésekre (ezt hívjuk <i>pénzügyi autonómiának</i>).
                    </p>
                </div>

            </div>

            <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(0, 0, 0, 0.03)', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                <h5 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Eredeti előirányzat vs. zárszámadás</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Fontos fogalmak! Az adott év elején elfogadott tervet hívjuk <strong>költségvetési tervezetnek / eredeti előirányzatnak</strong> (pl. a {config.alapEv}. évi adatok).
                    Azonban év közben történhetnek változások (pl. az önkormányzat nyer egy 1 milliárdos pályázatot, amit bele kell írni).
                    Az év végén, a ténylegesen elköltött összegeket tartalmazó végleges listát hívjuk <strong>zárszámadásnak (tényadatoknak)</strong>. Az átláthatóság érdekében {config.alapEv - 1}-ig már a valós tényadatokat láthatja a görbéken!
                </p>
            </div>

        </div>
    );
}
