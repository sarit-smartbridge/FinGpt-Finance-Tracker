import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlus, FaChartPie, FaWallet, FaShieldAlt, FaUniversity, FaCheck, FaPiggyBank, FaMagic } from 'react-icons/fa';
import './index.css';

const benefits = [
  { icon:FaWallet, color:'mint', title:'Have complete control', text:'over cash expenses, accounts, monthly income and every part of your financial life.' },
  { icon:FaChartPie, color:'pink', title:'Get a quick overview', text:'of your spending habits, savings progress, and important changes in one clear place.' },
  { icon:FaPiggyBank, color:'blue', title:'Use smart budgets', text:'to plan confidently for your goals without losing sight of everyday spending.' },
];

const steps = [
  { no:'01', title:'Track your cash flow', points:['Add income and expenses in seconds.','Organize transactions with intelligent categories.','Keep every month in one structured ledger.'], icon:FaWallet },
  { no:'02', title:'Understand your habits', points:['See where your money goes at a glance.','Spot unusual spending and recurring costs.','Turn charts into plain-language explanations.'], icon:FaChartPie },
  { no:'03', title:'Make spending stress-free', points:['Build realistic category budgets.','Forecast upcoming expenses and savings.','Plan goals with practical monthly targets.'], icon:FaShieldAlt },
];

const Home = () => <main className="sp-home">
  <section className="sp-hero">
    <div className="sp-shape sp-shape-main"/><div className="sp-shape sp-shape-line"/><div className="sp-shape sp-shape-pink"/>
    <div className="sp-hero-inner">
      <div className="sp-hero-copy">
        <span className="sp-overline"><FaMagic/> Personal finance, made clear</span>
        <h1><span>The finance app that</span><strong>gets your money<br/>into shape</strong></h1>
        <p>Track, understand, and improve your money from one beautifully simple workspace.</p>
        <div className="sp-actions"><Link to="/track" className="sp-primary">Open dashboard <FaArrowRight/></Link><Link to="/addincome-or-expense" className="sp-secondary"><FaPlus/> Add transaction</Link></div>
      </div>

      <div className="sp-product-visual" aria-label="FinGPT dashboard preview">
        <div className="sp-device sp-device-back">
          <div className="sp-device-bar"><i/><i/><i/></div><small>Monthly cash flow</small>
          <div className="sp-mini-bars">{[38,64,44,82,56,92,70].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>
        </div>
        <div className="sp-device sp-device-front">
          <div className="sp-phone-top"><span>FinGPT</span><FaWallet/></div>
          <p className="sp-balance-label">Total expenses</p><strong className="sp-balance">₹22,480</strong>
          <div className="sp-donut"><span>64%<small>on plan</small></span></div>
          <div className="sp-phone-stats"><span><b>₹48k</b><small>Income</small></span><span><b>₹25.5k</b><small>Saved</small></span></div>
          <div className="sp-phone-row"><i className="food">●</i><span><b>Food & dining</b><small>12 transactions</small></span><strong>₹4,280</strong></div>
          <div className="sp-phone-row"><i className="rent">●</i><span><b>Rent</b><small>Monthly payment</small></span><strong>₹12,000</strong></div>
        </div>
        <div className="sp-float-card sp-float-saving"><span>Savings rate</span><strong>53.1%</strong><small>↑ 8% this month</small></div>
        <div className="sp-float-card sp-float-ai"><FaMagic/><span><b>AI insight</b><small>Dining spend is down 12%</small></span></div>
      </div>
    </div>
  </section>

  <section className="sp-trust"><span><FaUniversity/> Secure data</span><span><FaMagic/> Grounded AI</span><span><FaChartPie/> Clear reports</span></section>

  <section className="sp-benefits">
    {benefits.map(({icon:Icon,color,title,text})=><article key={title}><span className={`sp-benefit-icon ${color}`}><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}
  </section>

  <section className="sp-process">
    <header><span>How it works</span><h2>Get your <strong>money into shape</strong></h2><p>Three simple steps turn everyday financial data into useful decisions.</p></header>
    <div className="sp-steps">
      {steps.map(({no,title,points,icon:Icon},index)=><article className={index%2?'reverse':''} key={title}>
        <div className="sp-step-copy"><span className="sp-step-no">Step {no}</span><h3>{title}</h3><ul>{points.map(point=><li key={point}><FaCheck/>{point}</li>)}</ul><Link to={index===0?'/addincome-or-expense':index===1?'/track':'/budgets'}>Explore this step <FaArrowRight/></Link></div>
        <div className={`sp-step-art art-${index+1}`}><span className="sp-art-orbit"/><div className="sp-art-card"><span className="sp-art-icon"><Icon/></span><small>{index===0?'Current balance':index===1?'Monthly overview':'Budget progress'}</small><strong>{index===0?'₹25,520':index===1?'64% saved':'₹18k / ₹24k'}</strong><div className="sp-art-track"><i/></div></div></div>
      </article>)}
    </div>
  </section>
</main>;
export default Home;
