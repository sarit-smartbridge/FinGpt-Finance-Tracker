import { NavLink } from 'react-router-dom';
import { FaWallet, FaGithub, FaTwitter, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const Footer = () => <footer className="relative mt-auto overflow-hidden border-t border-white/80 bg-[#e7efeb]/90 px-5 py-12 backdrop-blur-2xl">
  <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full border-[55px] border-[#0f766e]/5" />
  <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_.8fr_.8fr]">
    <div><div className="mb-4 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#123d3a] text-white shadow-xl"><FaWallet/></span><span className="font-[var(--font-display)] text-2xl font-bold text-slate-900">FinGPT</span></div><p className="max-w-sm text-sm leading-6 text-slate-500">A calm, intelligent workspace for understanding spending, building better habits, and planning what comes next.</p></div>
    <div><h3 className="mb-4 text-xs font-black uppercase tracking-[.16em] text-[#0f766e]">Workspace</h3><div className="grid gap-2 text-sm font-semibold text-slate-600"><NavLink to="/track">Track finances</NavLink><NavLink to="/budgets">Plan budgets</NavLink><NavLink to="/ai-lab" className="flex items-center gap-2">Explore AI Lab <FaArrowRight className="text-[10px]"/></NavLink></div></div>
    <div><h3 className="mb-4 text-xs font-black uppercase tracking-[.16em] text-[#0f766e]">Connect</h3><div className="flex gap-2">{[[FaGithub,'GitHub'],[FaTwitter,'Twitter'],[FaLinkedin,'LinkedIn']].map(([Icon,name])=><button key={name} aria-label={name} className="grid size-10 place-items-center rounded-xl border border-white bg-white/65 text-slate-500 shadow-sm transition hover:-translate-y-1 hover:bg-[#123d3a] hover:text-white"><Icon/></button>)}</div></div>
  </div>
  <div className="relative mx-auto mt-10 max-w-6xl border-t border-slate-300/60 pt-5 text-xs text-slate-500">© {new Date().getFullYear()} FinGPT · Personal Expense Tracker</div>
</footer>;
export default Footer;
