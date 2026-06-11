import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User, Mail, MapPin, Phone, Loader2, ArrowLeft, Pencil, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../layout/UseauthStore';
import Swal from 'sweetalert2';

export default function UserDetailsPage() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ user_adress: '', user_phone: '' });

    // ── Fetch user details ──────────────────────────────────────────────
    const { data, isLoading, error } = useQuery({
        queryKey: ['userDetails', user?._id],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/user-details/${user._id}`
            );
            if (!response.data) throw new Error('No data found in server response');
            return response.data;
        },
        enabled: !!user?._id,
    });

    // ── Save address + phone ────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/update-contact`,
                {
                    user_id: user._id,
                    user_adress: form.user_adress,
                    user_phone: form.user_phone,
                }
            );
            return response.data;
        },
        onSuccess: () => {
            // 1. Sync Zustand so BeforePymentPage picks up new values immediately
            updateUser({ user_adress: form.user_adress, user_phone: form.user_phone });
            // 2. Refresh the profile query
            queryClient.invalidateQueries(['userDetails', user?._id]);
            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Your address and phone have been updated.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
            });
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update contact info. Please try again.', 'error');
        },
    });

    const handleEditClick = () => {
        setForm({
            user_adress: data?.user_adress || '',
            user_phone: data?.user_phone || '',
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!form.user_adress.trim()) {
            Swal.fire('Required', 'Address cannot be empty.', 'warning');
            return;
        }
        if (!form.user_phone.trim()) {
            Swal.fire('Required', 'Phone number cannot be empty.', 'warning');
            return;
        }
        updateMutation.mutate();
    };

    // ── Loading / error states ──────────────────────────────────────────
    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    if (error) return (
        <div className="text-center p-10 text-red-500">Failed to load profile.</div>
    );

    // ── UI ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-md mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* ── Profile header ─────────────────────────────── */}
                    <div className="bg-indigo-600 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-bold">{data?.user_name}</h2>
                        <p className="text-indigo-100 text-sm">Customer Details</p>
                    </div>

                    {/* ── Fields ─────────────────────────────────────── */}
                    <div className="p-6 space-y-4">

                        {/* Email — always read-only */}
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <Mail className="text-indigo-500 flex-shrink-0" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                <p className="text-gray-700">{data?.user_email}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                            <MapPin className="text-indigo-500 flex-shrink-0 mt-1" size={20} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Address</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={form.user_adress}
                                        onChange={e => setForm(f => ({ ...f, user_adress: e.target.value }))}
                                        className="w-full px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm"
                                        placeholder="Street, City, Apartment"
                                    />
                                ) : (
                                    <p className="text-gray-700">{data?.user_adress || 'Not set'}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                            <Phone className="text-indigo-500 flex-shrink-0 mt-1" size={20} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Phone</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={form.user_phone}
                                        onChange={e => setForm(f => ({ ...f, user_phone: e.target.value }))}
                                        className="w-full px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                ) : (
                                    <p className="text-gray-700">{data?.user_phone || 'Not set'}</p>
                                )}
                            </div>
                        </div>

                        {/* ── Action buttons ──────────────────────────── */}
                        {isEditing ? (
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-60"
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <><Check size={18} /> Save Changes</>
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-all"
                                >
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="w-full flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold py-2.5 rounded-xl transition-all"
                            >
                                <Pencil size={18} /> Edit Address &amp; Phone
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
