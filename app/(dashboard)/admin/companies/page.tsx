"use client";

import React, { useEffect, useState } from "react";
import { Building2, CheckCircle, XCircle, Clock, Search } from "lucide-react";

type Company = {
    _id: string;
    name: string;
    workEmail: string;
    industry: string;
    location: string;
    website: string;
    isVerified: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    user: {
        full_name: string;
        email: string;
    };
};

export default function CompaniesManagementPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, [activeTab, searchTerm]);

    async function fetchCompanies() {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                status: activeTab,
                search: searchTerm
            });
            const res = await fetch(`/api/admin/companies?${params}`);
            if (res.ok) {
                const data = await res.json();
                setCompanies(data.companies);
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(companyId: string) {
        if (!confirm("Are you sure you want to approve this company?")) return;

        try {
            const res = await fetch(`/api/admin/companies/${companyId}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                alert("Company approved successfully!");
                fetchCompanies();
            } else {
                const error = await res.json();
                alert(`Failed to approve company: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error approving company:", error);
            alert("Error approving company");
        }
    }

    async function handleReject() {
        if (!selectedCompany || !rejectionReason.trim()) {
            alert("Please provide a rejection reason");
            return;
        }

        try {
            const res = await fetch(`/api/admin/companies/${selectedCompany._id}/reject`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectionReason })
            });

            if (res.ok) {
                alert("Company rejected");
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedCompany(null);
                fetchCompanies();
            } else {
                alert("Failed to reject company");
            }
        } catch (error) {
            console.error("Error rejecting company:", error);
            alert("Error rejecting company");
        }
    }

    function getStatus(company: Company): 'pending' | 'approved' | 'rejected' {
        if (company.approvalStatus === 'rejected') return 'rejected';
        if (company.isVerified) return 'approved';
        return 'pending';
    }

    const tabs = [
        { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
        { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600' },
        { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' },
        { key: 'all', label: 'All', icon: Building2, color: 'text-gray-600' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    Companies Management
                </h1>
                <p className="text-gray-500 mt-2">Review and approve company registrations</p>
            </header>

            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === tab.key
                                    ? 'border-b-2 border-red-500 text-red-500'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Icon size={18} className={activeTab === tab.key ? tab.color : ''} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by company name, email, or industry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading companies...</div>
            ) : companies.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No companies found</div>
            ) : (
                <div className="bg-white dark:bg-[#1a2036] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {companies.map((company) => {
                                    const status = getStatus(company);
                                    return (
                                        <tr key={company._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
                                                    <div className="text-sm text-gray-500">{company.location}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm text-gray-900 dark:text-white">{company.user?.full_name}</div>
                                                    <div className="text-sm text-gray-500">{company.workEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{company.industry}</td>
                                            <td className="px-6 py-4">
                                                {status === 'pending' && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                        Pending
                                                    </span>
                                                )}
                                                {status === 'approved' && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        Approved
                                                    </span>
                                                )}
                                                {status === 'rejected' && (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(company.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(company._id)}
                                                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCompany(company);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {status === 'rejected' && company.rejectionReason && (
                                                    <div className="text-xs text-red-500">
                                                        Reason: {company.rejectionReason}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reject Company</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Please provide a reason for rejecting {selectedCompany?.name}:
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                            rows={4}
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedCompany(null);
                                }}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Reject Company
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
