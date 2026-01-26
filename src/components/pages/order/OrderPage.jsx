import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart ,ArrowLeft} from 'lucide-react';
import { useCartStore } from '../../layout/cartStore'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { useOrderStore } from '../../layout/BeforePymentStore';
export default function OrderPage() {
    const navigate = useNavigate()
    const { cartItems, updateQuantity, removeFromCart } = useCartStore();
    const { setOrderItems } = useOrderStore()

    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.qty) || 0;
        return sum + (price * qty);
    }, 0);




    const handlePayment = () => {
        // 1. Validation: Don't proceed if cart is empty
        if (cartItems.length === 0) return;
    
        Swal.fire({
            title: 'Proceeding to Checkout',
            text: `Total amount: $${totalPrice.toFixed(2)}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#9333ea',
            confirmButtonText: 'Yes, checkout',
        }).then((result) => {
            if (result.isConfirmed) {
                // 2. CRITICAL: Save data to OrderStore before leaving
                // Ensure you pass the correct user ID here
                setOrderItems(cartItems, totalPrice); 
    
                Swal.fire({
                    title: 'Redirecting...',
                    timer: 1000,
                    didOpen: () => Swal.showLoading(),
                    willClose: () => {
                        navigate('/order'); // This matches your route to OrderSummary
                    }
                });
            }
        });
    };
    // 1. Add this handler function inside your component
    const handleDelete = (cartItemId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#9333ea", // Matches your purple-600
            cancelButtonColor: "#ef4444", // Red
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(cartItemId);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your item has been removed.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleProceed = () => {
        // 1. MUST set the data in the store FIRST
        setOrderItems(cartItems, user.id);

        // 2. THEN navigate
        navigate('/order');
    };  // 2. Update the button in your JSX map function:

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                
                {/* Back to Products Button */}
                <button 
                    onClick={() => navigate('/products')} // Adjust path to your products route
                    className="group flex items-center gap-2 text-purple-600 font-bold mb-6 hover:text-pink-600 transition-colors"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Products</span>
                </button>
    
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="text-white" size={32} />
                                <h1 className="text-3xl font-bold text-white">Your Order</h1>
                            </div>
                            {/* Alternative placement for the button inside the header */}
                            <button 
                                onClick={() => navigate('/products')}
                                className="hidden md:block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
    
                    <div className="p-6">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                                {/* Return button specifically for empty state */}
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-4 px-2 font-semibold text-gray-700">Product</th>
                                            <th className="text-center py-4 px-2 font-semibold text-gray-700">Price</th>
                                            <th className="text-center py-4 px-2 font-semibold text-gray-700">Quantity</th>
                                            <th className="text-right py-4 px-2 font-semibold text-gray-700">Total</th>
                                            <th className="text-center py-4 px-2 font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.cartItemId} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item.title}</p>
                                                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center py-4 px-2">${item.price.toFixed(2)}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, -1)}
                                                            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center disabled:opacity-50"
                                                            disabled={item.qty <= 1}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-12 text-center font-semibold">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, 1)}
                                                            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center disabled:opacity-50"
                                                            disabled={item.qty >= item.stock}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-right py-4 px-2 font-semibold">
                                                    ${(item.price * item.qty).toFixed(2)}
                                                </td>
                                                <td className="text-center py-4 px-2">
                                                    <button
                                                        onClick={() => handleDelete(item.cartItemId)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
    
                        {cartItems.length > 0 && (
                            <div className="mt-8 border-t-2 border-gray-200 pt-6 text-right">
                                <p className="text-gray-600 text-lg">Total Amount:</p>
                                <p className="text-4xl font-bold text-purple-600 mb-6">${totalPrice.toFixed(2)}</p>
                                <div className="flex flex-col md:flex-row justify-end gap-4">
                                    {/* Secondary back button next to checkout */}
                                    {/*  */}
                                    <button
                                        onClick={handlePayment}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}