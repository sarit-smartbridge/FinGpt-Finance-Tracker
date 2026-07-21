import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaWallet, FaHome, FaChartLine, FaPlusCircle, FaSignOutAlt, FaSignInAlt, FaRobot, FaBullseye, FaBrain, FaBars, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookies';
import { toast } from 'react-toastify';

const links = [
    ['/', 'Home', FaHome], ['/track', 'Track', FaChartLine],
    ['/addincome-or-expense', 'Add', FaPlusCircle], ['/budgets', 'Budgets', FaBullseye],
    ['/assistant', 'Assistant', FaRobot], ['/ai-lab', 'AI Lab', FaBrain],
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const token = Cookies.getItem('jwtToken');
    const userName = Cookies.getItem('userName');
    const navigate = useNavigate();
    const onLogout = () => {
        const toastId = toast.info(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontWeight: 600 }}>Are you sure you want to log out?</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => {
                            toast.dismiss(toastId);
                            Cookies.removeItem('jwtToken', '/');
                            Cookies.removeItem('userId', '/');
                            Cookies.removeItem('userName', '/');
                            toast.success('You have been logged out. See you soon! 👋');
                            setTimeout(() => navigate('/login'), 1500);
                        }}
                        style={{
                            background: '#ef4444', color: '#fff', border: 'none',
                            borderRadius: '8px', padding: '6px 16px', fontWeight: 700,
                            cursor: 'pointer', flex: 1,
                        }}
                    >
                        Yes, Logout
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastId)}
                        style={{
                            background: '#e2e8f0', color: '#334155', border: 'none',
                            borderRadius: '8px', padding: '6px 16px', fontWeight: 700,
                            cursor: 'pointer', flex: 1,
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            { autoClose: false, closeButton: false, closeOnClick: false }
        );
    };
    const navClass = ({ isActive }) => `group relative flex items-center gap-2.5 overflow-hidden rounded-[14px] px-4 py-2.5 text-[15px] font-semibold tracking-[-.01em] transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-[#dceee9] to-[#edf7f4] text-[#075e57] shadow-[inset_0_0_0_1px_rgba(15,118,110,.14),0_10px_24px_rgba(15,118,110,.11)] after:absolute after:inset-x-4 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#0f766e]' : 'text-slate-500 hover:-translate-y-0.5 hover:bg-white/80 hover:text-slate-900 hover:shadow-[0_8px_18px_rgba(30,55,60,.07)]'}`;
    return <header className="fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-6">
        <div className="relative mx-auto max-w-[1480px] overflow-hidden rounded-[22px] border border-white/90 bg-white/78 shadow-[0_24px_70px_rgba(30,55,60,.15),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-2xl">
            <span className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <span className="pointer-events-none absolute -left-16 -top-20 size-48 rounded-full bg-[#d7b66d]/10 blur-3xl" />
            <span className="pointer-events-none absolute -right-12 -top-20 size-56 rounded-full bg-[#0f766e]/10 blur-3xl" />
            <div className="relative flex min-h-20 items-center px-4 sm:px-5">
                <NavLink to="/" className="mr-7 flex items-center gap-3 text-slate-900 no-underline">
                    <span className="relative grid size-12 place-items-center rounded-[15px] bg-gradient-to-br from-[#0f766e] via-[#126b66] to-[#234e78] text-lg text-white shadow-[0_14px_30px_rgba(15,118,110,.3),inset_0_1px_0_rgba(255,255,255,.3)] before:absolute before:inset-[5px] before:rounded-[10px] before:border before:border-white/15"><FaWallet className="relative" /></span>
                    <span className="font-[var(--font-display)] text-[22px] font-extrabold leading-none tracking-[-.035em] text-[#123d3a]">FinGPT</span>
                </NavLink>
                <nav className="hidden flex-1 items-center gap-1.5 xl:flex">{links.map(([to,name,Icon])=><NavLink end={to==='/'} key={to} to={to} className={navClass}><Icon className="relative text-[14px] opacity-75 transition-transform duration-300 group-hover:scale-110"/><span className="relative">{name}</span></NavLink>)}</nav>
                <div className="ml-auto hidden items-center gap-3 md:flex">
                    {!token ? <NavLink to="/login" className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#0f766e]/30 bg-gradient-to-br from-[#0d4f49] via-[#0f766e] to-[#1a6e65] px-6 py-[10px] text-[13.5px] font-bold tracking-wide text-white no-underline shadow-[0_8px_24px_rgba(15,118,110,.35),inset_0_1px_0_rgba(255,255,255,.18)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_32px_rgba(15,118,110,.45)] active:translate-y-0"><span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" /><FaSignInAlt className="text-[12px] opacity-80 transition-transform duration-300 group-hover:translate-x-[2px]" /><span>Login</span></NavLink> : <>
                        {userName&&<span className="flex items-center gap-3 rounded-full border border-white/90 bg-white/75 py-1.5 pl-4 pr-1.5 text-sm font-semibold tracking-[-.01em] text-slate-600 shadow-[0_8px_24px_rgba(30,55,60,.08),inset_0_1px_0_white]"><span>{userName}</span><span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#d9ece7] to-[#cce2dc] font-bold text-[#0f766e] shadow-inner">{userName[0].toUpperCase()}</span></span>}
                        <button onClick={onLogout} className="grid size-12 place-items-center rounded-[14px] border border-rose-200/80 bg-gradient-to-br from-rose-50 to-white text-rose-600 shadow-[0_8px_20px_rgba(190,18,60,.08)] transition hover:-translate-y-1 hover:border-rose-500 hover:bg-rose-600 hover:text-white hover:shadow-[0_14px_28px_rgba(190,18,60,.2)]" aria-label="Logout"><FaSignOutAlt/></button>
                    </>}
                </div>
                <button onClick={()=>setOpen(!open)} className="ml-auto grid size-12 place-items-center rounded-[14px] border border-slate-200 bg-white/80 text-slate-700 shadow-sm xl:hidden" aria-label="Toggle navigation">{open?<FaTimes/>:<FaBars/>}</button>
            </div>
            {open&&<div className="relative grid gap-1.5 border-t border-slate-200/70 bg-white/40 p-4 xl:hidden">{links.map(([to,name,Icon])=><NavLink onClick={()=>setOpen(false)} end={to==='/'} key={to} to={to} className={navClass}><Icon/>{name}</NavLink>)}<div className="mt-2 border-t border-slate-200 pt-3 md:hidden">{!token?<NavLink onClick={()=>setOpen(false)} to="/login" className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#0d4f49] via-[#0f766e] to-[#1a6e65] px-4 py-3 text-[13.5px] font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(15,118,110,.35),inset_0_1px_0_rgba(255,255,255,.15)]"><FaSignInAlt className="text-[12px] opacity-80" /> Login / Sign Up</NavLink>:<button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 font-bold text-rose-700"><FaSignOutAlt/> Logout</button>}</div></div>}
        </div>
    </header>;
};
export default Header;
