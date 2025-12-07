import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TenantList = ({ tenants, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tenant.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(tenant)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <FaEdit size={16} />
                                </button>
                                <button onClick={() => onDelete(tenant.id)} className="text-red-600 hover:text-red-900">
                                    <FaTrash size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {tenants.length === 0 && (
                        <tr>
                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No tenants found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TenantList;
