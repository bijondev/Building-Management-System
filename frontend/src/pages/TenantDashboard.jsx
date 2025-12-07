import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const TenantDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [myBills, setMyBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {

                const res = await api.get('/bills');
                setMyBills(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBills();
    }, []);

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Tenant Dashboard</h1>
            </div>

            <div className="card">
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Bills</h2>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {myBills.map(bill => (
                        <li key={bill.id} style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{bill.category?.name}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Due: {bill.due_date}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${bill.amount}</div>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    backgroundColor: bill.status === 'paid' ? '#d1fae5' : (bill.status === 'overdue' ? '#fee2e2' : '#ffedd5'),
                                    color: bill.status === 'paid' ? '#059669' : (bill.status === 'overdue' ? '#dc2626' : '#ea580c'),
                                    marginTop: '0.2rem'
                                }}>
                                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                </span>
                            </div>
                        </li>
                    ))}
                    {myBills.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No bills found.</p>}
                </ul>
            </div>
        </div>
    );
};

export default TenantDashboard;
