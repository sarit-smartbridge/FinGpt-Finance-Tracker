import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HomeContainer = styled.section`
    padding: 128px 24px 84px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(247, 248, 250, 0.68) 100%);
    border-bottom: 1px solid var(--line);

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(232, 245, 243, 0.92);
        color: var(--brand-700);
        font-weight: 800;
        font-size: 0.82rem;
        padding: 7px 14px;
        border-radius: 999px;
        border: 1px solid rgba(15, 118, 110, 0.2);
        margin-bottom: 20px;
        box-shadow: 0 10px 24px rgba(15, 118, 110, 0.1);
    }
    .eyebrow svg { color: var(--brand-600); }

    h1 {
        font-size: clamp(2.35rem, 5.2vw, 4.2rem);
        font-weight: 850;
        line-height: 1.02;
        max-width: 930px;
        margin: 0 0 18px;
        text-wrap: balance;
    }

    h1 .grad {
        color: transparent;
        background: linear-gradient(135deg, var(--brand-700) 0%, #2563eb 100%);
        -webkit-background-clip: text;
        background-clip: text;
    }

    p.lead {
        font-size: 1.08rem;
        color: var(--ink-500);
        max-width: 670px;
        margin: 0 0 30px;
        line-height: 1.65;
    }

    .cta-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 26px;
    }

    .hero-visual {
        width: min(100%, 920px);
        min-height: 390px;
        margin: 12px auto 32px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.76);
        border-radius: var(--radius-lg);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(247, 252, 251, 0.8) 100%);
        backdrop-filter: blur(16px) saturate(160%);
        -webkit-backdrop-filter: blur(16px) saturate(160%);
        box-shadow: var(--shadow-3d);
        overflow: hidden;
    }

    .hero-visual::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
            radial-gradient(circle at 22% 18%, rgba(15, 118, 110, 0.12), transparent 28%),
            radial-gradient(circle at 78% 26%, rgba(37, 99, 235, 0.12), transparent 24%);
        pointer-events: none;
        z-index: 0;
    }

    .hero-visual::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.92),
            inset 0 0 0 1px rgba(15, 118, 110, 0.08);
        pointer-events: none;
        z-index: 3;
    }

    .finance-scene {
        width: 100%;
        height: 390px;
        cursor: grab;
        position: relative;
        z-index: 1;
    }

    .finance-scene canvas {
        display: block;
        width: 100%;
        height: 100%;
    }

    .scene-loading {
        background: #fbfcfd;
    }

    .metric-strip {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 16px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        pointer-events: none;
        z-index: 2;
    }

    .metric-strip span {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 10px 12px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.92);
        color: var(--ink-700);
        font-size: 0.86rem;
        font-weight: 800;
        text-align: left;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
    }

    .metric-strip strong {
        color: var(--ink-500);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    @media (max-width: 720px) {
        padding: 112px 16px 56px;

        .hero-visual {
            min-height: 290px;
            margin-bottom: 26px;
        }

        .finance-scene {
            height: 290px;
        }

        .metric-strip {
            position: static;
            grid-template-columns: 1fr;
            padding: 0 12px 12px;
        }

        .metric-strip span {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
`;

export const Button = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    background: linear-gradient(135deg, var(--brand-600) 0%, #1d4ed8 100%);
    color: #fff;
    border-radius: var(--radius-sm);
    font-weight: 800;
    font-size: 0.98rem;
    box-shadow: 0 16px 32px rgba(15, 118, 110, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.24);
    transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        color: #fff;
        background: linear-gradient(135deg, var(--brand-700) 0%, #1e40af 100%);
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(15, 118, 110, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.24);
    }
`;

export const GhostButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.82);
    color: var(--ink-700);
    border: 1px solid rgba(208, 213, 221, 0.92);
    border-radius: var(--radius-sm);
    font-weight: 800;
    font-size: 0.98rem;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(12px) saturate(150%);
    -webkit-backdrop-filter: blur(12px) saturate(150%);
    transition: background 0.15s ease, transform 0.15s ease, border-color 0.15s ease;

    &:hover {
        color: var(--brand-700);
        background: var(--brand-soft);
        border-color: #bfe0dc;
        transform: translateY(-2px);
        box-shadow: 0 18px 34px rgba(15, 118, 110, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.82);
    }
`;

export const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 18px;
    max-width: 1080px;
    width: 100%;
    margin: 48px auto 0;

    .feature {
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: var(--radius-lg);
        padding: 24px 22px;
        text-align: left;
        box-shadow: var(--shadow-3d);
        backdrop-filter: blur(14px) saturate(150%);
        -webkit-backdrop-filter: blur(14px) saturate(150%);
        transition: transform 0.18s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }
    .feature:hover {
        transform: translateY(-4px);
        border-color: rgba(15, 118, 110, 0.2);
        box-shadow: 0 28px 74px rgba(15, 23, 42, 0.16), 0 1px 0 rgba(255, 255, 255, 0.86) inset;
    }
    .feature .icon {
        width: 46px;
        height: 46px;
        border-radius: var(--radius-sm);
        display: grid;
        place-items: center;
        font-size: 20px;
        margin-bottom: 16px;
        box-shadow: inset 0 0 0 1px rgba(16, 24, 40, 0.04);
    }
    .feature h3 {
        font-size: 1.02rem;
        font-weight: 800;
        margin-bottom: 8px;
        color: var(--ink-900);
    }
    .feature p {
        color: var(--ink-500);
        font-size: 0.92rem;
        margin: 0;
        line-height: 1.6;
    }
`;

export const StatsBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px 22px;
    margin-top: 28px;

    .stat {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--ink-500);
        font-weight: 700;
        font-size: 0.92rem;
    }
    .stat svg { color: var(--income); }
`;
