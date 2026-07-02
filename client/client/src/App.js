import './App.css';
import { Suspense, lazy } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute';
import './theme.css';

const GlobalFinanceBackdrop = lazy(() => import('./components/GlobalFinanceBackdrop'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <GlobalFinanceBackdrop />
      </Suspense>
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
            <Route path="/not-found" element={<NotFound />} /> 
            <Route path="*" element={<Navigate to='/not-found' element={<NotFound/>} />} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
