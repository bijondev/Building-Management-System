import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [owners, setOwners] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'owner',
        landlord_id: ''
    });
    const [editingUser, setEditingUser] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const ownersRes = await api.get('/users?role=owner');
            setOwners(ownersRes.data);
            const tenantsRes = await api.get('/users?role=tenant');
            setTenants(tenantsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            if (editingUser) {

                const payload = { ...formData };
                if (!payload.password) delete payload.password;

                await api.put(`/users/${editingUser.id}`, payload);
                setMsg('User updated successfully');
                setEditingUser(null);
            } else {

                await api.post('/users', formData);
                setMsg('User created successfully');
            }

            setFormData({ name: '', email: '', password: '', role: 'owner', landlord_id: '' });
            fetchUsers();
        } catch (err) {
            setMsg('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEditClick = (u) => {
        setEditingUser(u);
        setFormData({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
            landlord_id: u.landlord_id || ''
        });
        setMsg('');
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'owner', landlord_id: '' });
        setMsg('');
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to delete user');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={logout} className="secondary">Logout</button>
            </div>
            <p>Welcome, {user?.name} (Admin)</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Form Section */}
                <div className="card">
                    <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
                    {msg && <p style={{ color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
                    <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            placeholder={editingUser ? "Password (leave blank to keep)" : "Password"}
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            {...(!editingUser && { required: true })}
                        />
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            disabled={!!editingUser}
                        >
                            <option value="owner">House Owner</option>
                            <option value="tenant">Tenant</option>
                        </select>

                        {formData.role === 'tenant' && (
                            <select
                                value={formData.landlord_id}
                                onChange={e => setFormData({ ...formData, landlord_id: e.target.value })}
                            >
                                <option value="">Select Owner (Optional)</option>
                                {owners.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="primary">{editingUser ? 'Update User' : 'Create User'}</button>
                            {editingUser && (
                                <button type="button" onClick={handleCancelEdit} style={{ background: '#94a3b8' }}>Cancel</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div>
                    <h2>Data Overview</h2>
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3>House Owners</h3>
                        <ul className="list-none p-0">
                            {owners.map(u => (
                                <li key={u.id} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                    <span>{u.name} ({u.email})</span>
                                    <div>
                                        <button onClick={() => handleEditClick(u)} className="icon-btn edit" style={{ marginRight: '5px' }}><FaEdit /></button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="icon-btn delete"><FaTrash /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <h3>Tenants</h3>
                        <ul className="list-none p-0">
                            {tenants.map(u => (
                                <li key={u.id} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <div>{u.name} ({u.email})</div>
                                        {u.landlord_id && (
                                            <div style={{ fontSize: '0.8em', color: 'gray' }}>
                                                Owner: {owners.find(o => o.id === u.landlord_id)?.name || 'Unknown'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button onClick={() => handleEditClick(u)} className="icon-btn edit" style={{ marginRight: '5px' }}><FaEdit /></button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="icon-btn delete"><FaTrash /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
