"use client";

import React, { useEffect, useState } from "react";
import { Search, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

type PaginationInfo = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });

    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search,
                role: roleFilter,
                page: page.toString(),
                limit: limit.toString()
            }).toString();

            const res = await fetch(`/api/admin/users?${query}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset to page 1 when search or filter changes
        setPage(1);
    }, [search, roleFilter, limit]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, roleFilter, page, limit]);

    const toggleUserStatus = async (userId: string, currentStatus: boolean, name: string) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'restore' : 'deactivate'} ${name}?`)) return;

        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isDeleted: !currentStatus })
            });

            if (res.ok) {
                setUsers(users.map(u => u._id === userId ? { ...u, isDeleted: !currentStatus } : u));
            } else {
                alert('Failed to update user status');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 text-sm">Manage platform users and access.</p>
                </div>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#1a2036] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 ring-red-500/50 outline-none text-gray-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 ring-red-500/50 outline-none text-gray-900 dark:text-white"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 ring-red-500/50 outline-none text-gray-900 dark:text-white"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a2036] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 font-medium">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(limit)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">{user.full_name || 'N/A'}</span>
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    user.role === 'mentor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        user.role === 'company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
                                      `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isDeleted ? (
                                                <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                                                    <Ban size={14} /> Deactivated
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-500 text-sm font-medium">
                                                    <CheckCircle size={14} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                disabled={actionLoading === user._id}
                                                onClick={() => toggleUserStatus(user._id, user.isDeleted, user.full_name)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.isDeleted
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    } ${actionLoading === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {actionLoading === user._id ? 'Processing...' : user.isDeleted ? 'Restore' : 'Soft Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && users.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
                            </button>

                            {/* Page numbers */}
                            <div className="flex gap-1">
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.totalPages ||
                                        (pageNum >= page - 1 && pageNum <= page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${pageNum === page
                                                        ? 'bg-red-500 text-white'
                                                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                                        return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
