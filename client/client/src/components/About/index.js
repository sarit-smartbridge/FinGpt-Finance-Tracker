import React from 'react';
import styled from 'styled-components';
import { FaPiggyBank } from 'react-icons/fa';

const AboutSection = styled.section`
  max-width: 1080px;
  margin: 0 auto 64px;
  padding: 42px 32px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink-700);
  text-align: center;
  box-shadow: var(--shadow-sm);

  .badge-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-sm);
    background: var(--brand-600);
    display: grid;
    place-items: center;
    margin: 0 auto 18px;
    font-size: 22px;
    color: #fff;
  }

  h2 {
    color: var(--ink-900);
    font-size: 1.45rem;
    font-weight: 850;
    margin-bottom: 12px;
  }

  p {
    max-width: 680px;
    margin: 0 auto 10px;
    color: var(--ink-700);
    line-height: 1.7;
    font-size: 1rem;
  }
`;

const About = () => {
  return (
    <AboutSection>
      <div className="badge-icon"><FaPiggyBank /></div>
      <h2>About FinGPT</h2>
      <p>
        FinGPT is a focused personal finance app for logging income, tracking expenses,
        reviewing monthly savings, and understanding spending patterns in one organized place.
      </p>
      <p style={{ color: 'var(--brand-700)', fontWeight: 800 }}>
        Built for people who want practical control over everyday money decisions.
      </p>
    </AboutSection>
  );
};

export default About;
