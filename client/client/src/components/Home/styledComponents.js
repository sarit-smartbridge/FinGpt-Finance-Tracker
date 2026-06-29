import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HomeContainer = styled.section`
    padding: 132px 24px 78px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background:
        linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%);
    border-bottom: 1px solid var(--line);

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--brand-soft);
        color: var(--brand-700);
        font-weight: 800;
        font-size: 0.82rem;
        padding: 7px 14px;
        border-radius: 999px;
        border: 1px solid #bfe0dc;
        margin-bottom: 20px;
    }
    .eyebrow svg { color: var(--brand-600); }

    h1 {
        font-size: clamp(2.2rem, 4.8vw, 3.7rem);
        font-weight: 850;
        line-height: 1.08;
        max-width: 870px;
        margin: 0 0 18px;
    }

    h1 .grad {
        color: var(--brand-700);
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
        margin-bottom: 28px;
    }

    @media (max-width: 720px) {
        padding: 112px 16px 56px;
    }
`;

export const Button = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    background: var(--brand-600);
    color: #fff;
    border-radius: var(--radius-sm);
    font-weight: 800;
    font-size: 0.98rem;
    box-shadow: var(--shadow-sm);
    transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        color: #fff;
        background: var(--brand-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow);
    }
`;

export const GhostButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: var(--surface);
    color: var(--ink-700);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    font-weight: 800;
    font-size: 0.98rem;
    box-shadow: var(--shadow-sm);
    transition: background 0.15s ease, transform 0.15s ease, border-color 0.15s ease;

    &:hover {
        color: var(--brand-700);
        background: var(--brand-soft);
        border-color: #bfe0dc;
        transform: translateY(-1px);
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
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        padding: 24px 22px;
        text-align: left;
        box-shadow: var(--shadow-sm);
        transition: transform 0.18s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    }
    .feature:hover {
        transform: translateY(-2px);
        border-color: var(--line-strong);
        box-shadow: var(--shadow);
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
