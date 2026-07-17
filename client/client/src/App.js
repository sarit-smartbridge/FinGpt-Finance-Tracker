import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Redirect
import Header from './components/Header';
import Home from './components/Home';
import Track from './components/Track';
import NotFound from './components/NotFound';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/Login';
import Registration from './components/Registration';
import AddIncomeAndExpense from './components/AddIncomeAndExpense';
import BudgetAssistant from './components/BudgetAssistant';
import BudgetManager from './components/BudgetManager';
import AiLab from './components/AiLab';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './theme.css';

function App() {
  useEffect(() => {
    const root = document.documentElement;
    let frame;
    const move = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
        const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
        root.style.setProperty('--ambient-x', `${x * 28}px`);
        root.style.setProperty('--ambient-y', `${y * 20}px`);
        root.style.setProperty('--ambient-rx', `${-y * 7}deg`);
        root.style.setProperty('--ambient-ry', `${x * 9}deg`);
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <div className="App">
      <div className="ambient-background" aria-hidden="true">
        <span className="ambient-orb ambient-orb-gold" />
        <span className="ambient-orb ambient-orb-teal" />
        <span className="ambient-orb ambient-orb-blue" />
        <span className="ambient-ribbon ambient-ribbon-one" />
        <span className="ambient-ribbon ambient-ribbon-two" />
        <span className="ambient-grid" />
        <span className="ambient-3d-scene ambient-3d-left">
          <i className="ambient-coin ambient-coin-one" />
          <i className="ambient-coin ambient-coin-two" />
          <i className="ambient-glass-tile" />
        </span>
        <span className="ambient-3d-scene ambient-3d-right">
          <i className="ambient-chart-bar ambient-chart-bar-one" />
          <i className="ambient-chart-bar ambient-chart-bar-two" />
          <i className="ambient-chart-bar ambient-chart-bar-three" />
          <i className="ambient-orbit-ring" />
        </span>
        <span className="ambient-cube-stage">
          <i className="ambient-cube">
            <b className="cube-face cube-front"><em>₹</em><small>Cash flow</small></b>
            <b className="cube-face cube-back"><em>24%</em><small>Saved</small></b>
            <b className="cube-face cube-right"><em>↗</em><small>Growth</small></b>
            <b className="cube-face cube-left"><em>AI</em><small>Insights</small></b>
            <b className="cube-face cube-top" />
            <b className="cube-face cube-bottom" />
          </i>
          <i className="ambient-cube-shadow" />
        </span>
        <span className="ambient-grain" />
      </div>
      <div className="app-content">
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Header />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Registration />} />
            <Route path="/" element={<ProtectedRoute Component={Home}/>} />
            <Route path="/track" element={<ProtectedRoute Component={Track}/>} />
            <Route path="/addincome-or-expense" element={<ProtectedRoute Component={AddIncomeAndExpense}/>} />
            <Route path="/budgets" element={<ProtectedRoute Component={BudgetManager}/>} />
            <Route path="/assistant" element={<ProtectedRoute Component={BudgetAssistant}/>} />
            <Route path="/ai-lab" element={<ProtectedRoute Component={AiLab}/>} />
            <Route path="/not-found" element={<NotFound />} /> 
            <Route path="*" element={<Navigate to='/not-found' element={<NotFound/>} />} /> 
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
