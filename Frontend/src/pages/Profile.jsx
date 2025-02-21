import React, { useState } from 'react';
import {
    User,
    Camera,
    Mail,
    Phone,
    Loader
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

function Profile() {
    const { user, loading, uploadAvatar, updateUser } = useUserStore()
    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        mobile: user?.mobile || ''
    })

    const [avatar, setAvatar] = useState(user?.avatar || '',)

    function handleFormChange(e) {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }
    function handleFormSubmit(e) {
        e.preventDefault()
        updateUser(formData);
        if(image){            
            uploadAvatar(image);
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        const formData = new FormData();
        formData.append('avatar', file);
        setImage(formData);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <form className="max-w-3xl h-[80vh] mt-2" onSubmit={handleFormSubmit}>

            <div className="bg-white rounded-2xl shadow-sm p-4 mb-2">
                <h2 className="text-lg font-semibold mb-2">Profile Picture</h2>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-500" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>
                    <div>
                        <p className="font-medium mb-1">Upload new photo</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-6 mt-4" >
                <h2 className="text-lg font-semibold">Personal Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                name='name'
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                name='email'
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleFormChange}
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <div className="relative">
                            <input
                                name='mobile'
                                type="tel"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your phone number"
                                value={formData.mobile}
                                onChange={handleFormChange}
                            />
                            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                        {loading ? (
                            <Loader className='flex justify-center items-center w-full animate-spin' />
                        ) : "Save Changes"}
                    </button>


                </div>
            </div>
        </form>
    )
}

export default Profile