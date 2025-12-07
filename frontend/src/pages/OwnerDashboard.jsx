import React, { useEffect, useState } from 'react';
import api from '../api';

import TenantList from '../components/TenantList';
import TenantForm from '../components/TenantForm';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const OwnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [flats, setFlats] = useState([]);
    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tenants, setTenants] = useState([]); // New state for tenants.
    const [showTenantForm, setShowTenantForm] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);

    // Forms state
    const [newFlat, setNewFlat] = useState({ number: '', tenant_id: '' });
    const [newBill, setNewBill] = useState({ flat_id: '', category_id: '', amount: '', due_date: '' });
    const [newCategory, setNewCategory] = useState({ name: '' });
    // removed duplicate tenants state

    // Editing states
    const [editingFlat, setEditingFlat] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingBill, setEditingBill] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [flatsRes, billsRes, catsRes, tenantsRes] = await Promise.all([
                api.get('/flats'),
                api.get('/bills'),
                api.get('/bill-categories'),
                api.get('/users?role=tenant')

            ]);

            setFlats(flatsRes.data);
            setBills(billsRes.data);
            setCategories(catsRes.data);
            setTenants(tenantsRes.data);
        } catch (err) {
            console.error(err);
        }
    };


    const handleCreateFlat = async (e) => {
        e.preventDefault();
        try {
            if (editingFlat) {
                await api.put(`/flats/${editingFlat.id}`, newFlat);
                setEditingFlat(null);
            } else {
                await api.post('/flats', newFlat);
            }
            setNewFlat({ number: '', tenant_id: '' });
            fetchData();
        } catch (error) {
            console.error("Flat operation failed", error);
        }
    };

    const handleEditFlat = (flat) => {
        setEditingFlat(flat);
        setNewFlat({ number: flat.number, tenant_id: flat.tenant_id || '' });
    };

    const handleDeleteFlat = async (id) => {
        if (!window.confirm("Delete this flat?")) return;
        try {
            await api.delete(`/flats/${id}`);
            fetchData();
        } catch (error) {
            console.error("Delete flat failed", error);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/bill-categories/${editingCategory.id}`, newCategory);
                setEditingCategory(null);
            } else {
                await api.post('/bill-categories', newCategory);
            }
            setNewCategory({ name: '' });
            fetchData();
        } catch (error) {
            console.error("Category operation failed", error);
        }
    };

    const handleEditCategory = (cat) => {
        setEditingCategory(cat);
        setNewCategory({ name: cat.name });
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await api.delete(`/bill-categories/${id}`);
            fetchData();
        } catch (error) {
            console.error("Delete category failed", error);
        }
    };

    const handleCreateBill = async (e) => {
        e.preventDefault();
        try {
            if (editingBill) {
                await api.put(`/bills/${editingBill.id}`, newBill);
                setEditingBill(null);
            } else {
                await api.post('/bills', newBill);
            }
            setNewBill({ flat_id: '', category_id: '', amount: '', due_date: '' });
            fetchData();
        } catch (error) {
            console.error("Bill operation failed", error);
        }
    };

    const handleEditBill = (bill) => {
        setEditingBill(bill);
        setNewBill({
            flat_id: bill.flat_id,
            category_id: bill.category_id,
            amount: bill.amount,
            due_date: bill.due_date.split('T')[0]
        });
    };

    const handleDeleteBill = async (id) => {
        if (!window.confirm("Delete this bill?")) return;
        try {
            await api.delete(`/bills/${id}`);
            fetchData();
        } catch (error) {
            console.error("Delete bill failed", error);
        }
    };

    const handleUpdateBillStatus = async (bill, newStatus) => {
        try {
            await api.put(`/bills/${bill.id}`, { ...bill, status: newStatus });
            fetchData();
        } catch (error) {
            console.error("Update status failed", error);
        }
    };

    const openAddTenant = () => {
        setEditingTenant(null);
        setShowTenantForm(true);
    };

    const openEditTenant = (tenant) => {
        setEditingTenant(tenant);
        setShowTenantForm(true);
    };

    const handleSaveTenant = async (tenantData) => {
        try {
            if (editingTenant) {
                await api.put(`/users/${editingTenant.id}`, tenantData);
            } else {
                await api.post('/users', { ...tenantData, role: 'tenant' });
            }
            setShowTenantForm(false);
            setEditingTenant(null);
            fetchData();
        } catch (error) {
            console.error("Tenant save failed", error);
            alert("Failed to save tenant. Please check inputs.");
        }
    };

    const handleDeleteTenant = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tenant?")) return;
        try {
            await api.delete(`/users/${id}`);
            fetchData();
        } catch (error) {
            console.error("Delete tenant failed", error);
            alert("Failed to delete tenant.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Owner Dashboard</h1>

            </div>

            <div className="grid-3">
                {/* Flats Section */}
                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Flats</h2>
                    </div>

                    <form onSubmit={handleCreateFlat} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                            placeholder="Flat Number"
                            value={newFlat.number}
                            onChange={e => setNewFlat({ ...newFlat, number: e.target.value })}
                            required
                            style={{ flex: 1, minWidth: '120px', marginBottom: 0 }}
                        />
                        <select
                            value={newFlat.tenant_id}
                            onChange={e => setNewFlat({ ...newFlat, tenant_id: e.target.value })}
                            style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}
                        >
                            <option value="">Select Tenant</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="primary" style={{ marginBottom: 0 }}>
                            {editingFlat ? <FaCheck /> : <FaPlus />}
                            {editingFlat ? '' : ''}
                        </button>
                        {editingFlat && (
                            <button
                                type="button"
                                onClick={() => { setEditingFlat(null); setNewFlat({ number: '', tenant_id: '' }); }}
                                style={{ background: '#94a3b8', color: 'white', marginBottom: 0 }}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </form>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {flats.map(f => (
                            <li key={f.id} className="flex-between" style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '0.95rem'
                            }}>
                                <div>
                                    <strong>{f.number}</strong>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {f.tenant ? f.tenant.name : 'Vacant'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEditFlat(f)} className="icon-btn edit" title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteFlat(f.id)} className="icon-btn delete" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories Section */}
                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Bill Categories</h2>
                    </div>

                    <form onSubmit={handleCreateCategory} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                        <input
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                            style={{ marginBottom: 0 }}
                        />
                        <button type="submit" className="primary" style={{ marginBottom: 0 }}>
                            {editingCategory ? <FaCheck /> : <FaPlus />}
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={() => { setEditingCategory(null); setNewCategory({ name: '' }); }}
                                style={{ background: '#94a3b8', color: 'white', marginBottom: 0 }}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </form>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {categories.map(c => (
                            <li key={c.id} className="flex-between" style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid var(--border-color)',
                                fontSize: '0.95rem'
                            }}>
                                <span>{c.name}</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEditCategory(c)} className="icon-btn edit" title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(c.id)} className="icon-btn delete" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Tenants</h2>
                        <button onClick={openAddTenant} className="primary" style={{ marginBottom: 0 }}>
                            <FaPlus /> Add Tenant
                        </button>
                    </div>

                    <TenantList
                        tenants={tenants}
                        onEdit={openEditTenant}
                        onDelete={handleDeleteTenant}
                    />

                    {showTenantForm && (
                        <TenantForm
                            tenant={editingTenant}
                            onSave={handleSaveTenant}
                            onCancel={() => setShowTenantForm(false)}
                            isAdmin={false}
                        />
                    )}
                </div>
            </div>

            <div className="card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Bills</h2>
                </div>

                <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                            value={newBill.flat_id}
                            onChange={e => setNewBill({ ...newBill, flat_id: e.target.value })}
                            required
                            style={{ marginBottom: 0 }}
                        >
                            <option value="">Select Flat</option>
                            {flats.map(f => <option key={f.id} value={f.id}>{f.number}</option>)}
                        </select>
                        <select
                            value={newBill.category_id}
                            onChange={e => setNewBill({ ...newBill, category_id: e.target.value })}
                            required
                            style={{ marginBottom: 0 }}
                        >
                            <option value="">Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            placeholder="Amount"
                            type="number"
                            value={newBill.amount}
                            onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                            required
                            style={{ marginBottom: 0 }}
                        />
                        <input
                            type="date"
                            value={newBill.due_date}
                            onChange={e => setNewBill({ ...newBill, due_date: e.target.value })}
                            required
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="primary" style={{ flex: 1, justifyContent: 'center' }}>
                            {editingBill ? 'Update Bill' : 'Generate Bill'}
                        </button>
                        {editingBill && (
                            <button
                                type="button"
                                onClick={() => { setEditingBill(null); setNewBill({ flat_id: '', category_id: '', amount: '', due_date: '' }); }}
                                style={{ background: '#94a3b8', color: 'white' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '400px', overflowY: 'auto' }}>
                    {bills.map(b => (
                        <li key={b.id} style={{
                            padding: '0.75rem',
                            borderBottom: '1px solid var(--border-color)',
                            fontSize: '0.9rem'
                        }}>
                            <div className="flex-between" style={{ marginBottom: '5px' }}>
                                <strong>{b.category?.name} - Flat {b.flat?.number}</strong>
                                <span style={{ fontWeight: 'bold' }}>${b.amount}</span>
                            </div>
                            <div className="flex-between">
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Due: {b.due_date}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <select
                                        value={b.status}
                                        onChange={(e) => handleUpdateBillStatus(b, e.target.value)}
                                        style={{
                                            marginBottom: 0,
                                            padding: '2px 5px',
                                            fontSize: '0.8rem',
                                            border: '1px solid',
                                            borderColor: b.status === 'paid' ? 'var(--accent-color)' : (b.status === 'overdue' ? 'var(--danger-color)' : 'orange'),
                                            color: b.status === 'paid' ? 'var(--accent-color)' : (b.status === 'overdue' ? 'var(--danger-color)' : 'orange'),
                                            width: 'auto',
                                            height: 'auto'
                                        }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                    <button onClick={() => handleEditBill(b)} className="icon-btn edit" title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteBill(b.id)} className="icon-btn delete" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default OwnerDashboard;
