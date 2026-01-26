import { useState } from 'react';
import { MapPin, Phone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../layout/BeforePymentStore';

export default function AddressPhoneFormModal() {
  const navigate = useNavigate();
  const { setContactInfo } = useOrderStore();

  const [formData, setFormData] = useState({
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setContactInfo({
      user_adress: formData.address,
      user_phone: formData.phone,
      notes: ''
    });

    navigate('/order');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">

        {/* Close */}
        <button
          onClick={() => navigate('/order')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            Contact Details
          </h2>
          <p className="text-gray-500">
            Required to complete your order
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, Apartment"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-3 rounded-2xl hover:opacity-90 transition"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
