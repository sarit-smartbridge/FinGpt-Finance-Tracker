import React from 'react';
import styled from 'styled-components';
import { FaWallet, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 28px 24px;
  color: var(--ink-500);

  .inner {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 850;
    color: var(--ink-900);
    font-size: 1.04rem;
  }
  .brand .logo {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: var(--brand-600);
    color: #fff;
    display: grid;
    place-items: center;
  }

  .socials { display: flex; gap: 10px; }
  .socials button {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    display: grid;
    place-items: center;
    background: var(--surface-2);
    color: var(--ink-500);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  }
  .socials button:hover {
    background: var(--brand-soft);
    color: var(--brand-700);
    border-color: #bfe0dc;
  }

  .copy { font-size: 0.9rem; }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="inner">
        <div className="brand">
          <span className="logo"><FaWallet /></span>
          FinGPT
        </div>
        <p className="copy" style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} FinGPT | Personal Expense Tracker
        </p>
        <div className="socials">
          <button type="button" aria-label="GitHub"><FaGithub /></button>
          <button type="button" aria-label="Twitter"><FaTwitter /></button>
          <button type="button" aria-label="LinkedIn"><FaLinkedin /></button>
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;
