import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaBuilding, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const isLoginPage = location.pathname === '/login' || location.pathname === '/';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '1rem 2rem',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div className="flex-between" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <FaBuilding size={24} color="var(--secondary-color)" />
                        <span>BMS Pro</span>
                    </div>

                    {user && (
                        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaUserCircle />
                                <span>{user.name} ({user.role})</span>
                            </div>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '2rem',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto'
            }}>
                {children}
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: 'var(--card-bg)',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
            }}>
                <p>
                    Designed by <strong>Bijon Krishna Bairagi</strong> |
                    <a
                        href="https://bijon.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--secondary-color)', textDecoration: 'none', marginLeft: '5px' }}
                    >
                        bijon.me
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Layout;
