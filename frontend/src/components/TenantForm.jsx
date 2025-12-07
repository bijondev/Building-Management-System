import React, { useState, useEffect } from 'react';
import axios from '../api';

const TenantForm = ({ tenant, onSave, onCancel, isAdmin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        landlord_id: '',
    });
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                email: tenant.email || '',
                password: '',
                landlord_id: tenant.landlord_id || '',
            });
        }

        if (isAdmin) {
            axios.get('/owners')
                .then(res => setOwners(res.data))
                .catch(err => console.error('Error fetching owners:', err));
        }
    }, [tenant, isAdmin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl mb-4">{tenant ? 'Edit Tenant' : 'Add Tenant'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Password {tenant && '(Leave blank to keep)'}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            {...(!tenant && { required: true })}
                        />
                    </div>

                    {isAdmin && (
                        <div className="mb-4">
                            <label className="block mb-1">Owner</label>
                            <select
                                name="landlord_id"
                                value={formData.landlord_id}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Select Owner</option>
                                {owners.map(owner => (
                                    <option key={owner.id} value={owner.id}>{owner.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenantForm;
