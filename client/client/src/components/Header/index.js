import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaWallet, FaHome, FaChartLine, FaPlusCircle, FaSignOutAlt, FaSignInAlt, FaRobot, FaBullseye } from 'react-icons/fa';
import Cookies from 'js-cookies';

const Header = () => {
    const token = Cookies.getItem("jwtToken");
    const userName = Cookies.getItem("userName");

    const navigate = useNavigate();

    const onLogout = () => {
        const res = window.confirm("Are you sure you want to log out?");
        if (res) {
            Cookies.removeItem('jwtToken');
            navigate('/login');
        }
    };

    const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

    return (
        <Navbar className="et-navbar" fixed="top" expand="lg">
            <Navbar.Brand as={NavLink} to="/" className="et-brand">
                <span className="et-brand-logo"><FaWallet /></span>
                FinGPT
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarSupportedContent" />
            <Navbar.Collapse id="navbarSupportedContent">
                <Nav className="me-auto">
                    <NavLink to="/" className="nav-link"><FaHome /> Home</NavLink>
                    <NavLink to="/track" className="nav-link"><FaChartLine /> Track</NavLink>
                    <NavLink to="/addincome-or-expense" className="nav-link"><FaPlusCircle /> Add Transaction</NavLink>
                    <NavLink to="/budgets" className="nav-link"><FaBullseye /> Budgets</NavLink>
                    <NavLink to="/assistant" className="nav-link"><FaRobot /> Assistant</NavLink>
                </Nav>
                <Nav className="align-items-lg-center" style={{ gap: '10px' }}>
                    {!token ? (
                        <NavLink to="/login" className="btn btn-gradient">
                            <FaSignInAlt style={{ marginRight: 6 }} /> Login / Sign Up
                        </NavLink>
                    ) : (
                        <>
                            {userName && (
                                <span className="et-user-chip">
                                    <span>{userName}</span>
                                    <span className="et-user-avatar">{initial}</span>
                                </span>
                            )}
                            <button className="et-logout" onClick={onLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
