import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User, Mail, MapPin, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../layout/UseauthStore'

export default function UserDetailsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['userDetails', user?._id],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/ido_shop_api/users/user-details/${user._id}`);
            
            console.log("Server Response:", response.data);
    
            // FIX: The server response IS the user object. 
            // Do not look for .data.data
            if (!response.data) {
                throw new Error("No data found in server response");
            }
    
            return response.data; // Return the object directly
        },
        enabled: !!user?._id,
    });

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    if (error) return <div className="text-center p-10 text-red-500">Failed to load profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-indigo-600 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={40} />
                        </div>
                        <h2 className="text-2xl font-bold">{data?.user_name}</h2>
                        <p className="text-indigo-100 text-sm">Customer Details</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <Mail className="text-indigo-500" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                <p className="text-gray-700">{data?.user_email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <MapPin className="text-indigo-500" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Address</p>
                                <p className="text-gray-700">{data?.user_adress || 'Not set'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <Phone className="text-indigo-500" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                <p className="text-gray-700">{data?.user_phone || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}