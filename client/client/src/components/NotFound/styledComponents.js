import styled from 'styled-components'

export const NotFoundContainer = styled.div`
    min-height: 100vh;
    padding: 64px 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .nf-card {
        text-align: center;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.84) 100%);
        border: 1px solid rgba(255, 255, 255, 0.76);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-3d);
        padding: 52px 46px;
        max-width: 440px;
        backdrop-filter: blur(16px) saturate(160%);
        -webkit-backdrop-filter: blur(16px) saturate(160%);
    }
    .nf-icon {
        width: 64px; height: 64px;
        border-radius: var(--radius-lg);
        background: var(--brand-soft);
        color: var(--brand-600);
        border: 1px solid #bfe0dc;
        display: grid; place-items: center;
        font-size: 30px;
        margin: 0 auto 20px;
    }
    .nf-card h1 {
        font-size: 3.8rem;
        font-weight: 850;
        color: var(--brand-700);
        margin: 0;
        line-height: 1;
    }
    .nf-card h2 { font-size: 1.4rem; font-weight: 850; margin: 10px 0 8px; }
    .nf-card p { color: var(--ink-500); margin-bottom: 26px; }
`
