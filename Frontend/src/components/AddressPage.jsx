import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@mantine/core';
import { MapPin, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { locationData } from '../utils/location.js';
import useMobile from "../Hooks/useMobile.jsx"
import toast from 'react-hot-toast';
import { useAddressStore } from '../stores/useAddressStore.js';
import { useLocation } from 'react-router-dom';

const AddressPage = ({selectedAddress, setSelectedAddress}) => {
    const { Address, getAddress, addAddress, editAddress, deleteAddress } = useAddressStore();
    const location = useLocation()

    const [modalOpened, setModalOpened] = useState(false);
    const [confirmModalOpened, setConfirmModalOpened] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const [editingAddress, setEditingAddress] = useState(null);
    const [isMobile] = useMobile(1024)
    const [formValues, setFormValues] = useState({
        recipient_name: '',
        address_line: '',
        city: '',
        mobile: '',
        province: '',
        district: '',
        localPlace: '',
    });

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedLocalPlace, setSelectedLocalPlace] = useState('');

    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [localPlaces, setLocalPlaces] = useState([]);

    useEffect(() => {
        getAddress();
    },[])

    useEffect(() => {
        if (selectedProvince && districts.length === 0) {
            setDistricts(Object.keys(locationData[selectedProvince] || {}));
        }
    }, [selectedProvince]);
    
    useEffect(() => {
        if (selectedProvince && selectedDistrict && cities.length === 0) {
            setCities(Object.keys(locationData[selectedProvince]?.[selectedDistrict] || {}));
        }
    }, [selectedProvince, selectedDistrict]);
    
    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedCity && localPlaces.length === 0) {
            setLocalPlaces(locationData[selectedProvince]?.[selectedDistrict]?.[selectedCity] || []);
        }
    }, [selectedProvince, selectedDistrict, selectedCity]);
    

const handleModalClose = () => {
    setModalOpened(false);
    setEditingAddress(null);
    setFormValues({
        recipient_name: '',
        address_line: '',
        city: '',
        mobile: '',
        province: '',
        district: '',
        localPlace: '',
    });
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedCity('');
    setSelectedLocalPlace('');

    setDistricts([]);
    setCities([]);
    setLocalPlaces([]);
};


    const handleEditClick = (address) => {
        setEditingAddress(address);
        setFormValues(address);
        setSelectedProvince(address.province);
        setSelectedDistrict(address.district);
        setSelectedCity(address.city);
        setSelectedLocalPlace(address.localPlace);
        setModalOpened(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { mobile, } = formValues;
        
        if (!/^98\d{8}$/.test(mobile)) {
           return toast.error("Invalid mobile number");
        } 

        if (editingAddress) {
            editAddress(formValues)
            handleModalClose();
            setSelectedAddress(prev =>
                prev?.id === editingAddress.id ? { ...prev, ...formValues } : prev
            );
            handleModalClose();
        } else {
            addAddress(formValues)
            handleModalClose();
        }
    };
    
    const handleConfirmDelete = () => {
        deleteAddress(addressToDelete); 
        setConfirmModalOpened(false); 
        setAddressToDelete(null); 
    };

    const handleDeleteClick = (_id) => {
        setAddressToDelete(_id);
        setConfirmModalOpened(true); 
    };

    const SelectWrapper = ({ label, value, onChange, options, placeholder, disabled }) => (
        <div className="">
            <label className="block font-semibold mb-1">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-8 text-gray-900 focus:border-blue-500 focus:ring-blue-500 appearance-none"
                    disabled={disabled}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );

    return (       
        <div>
            <div className={`bg-white shadow-sm rounded-lg p-2 lg:p-4 border lg:h-[78vh] mb-2 mt-2 ${location.pathname == "/dashboard/address" && 'h-[78vh]'}`}>
                <div className="flex justify-between items-center mb-3 lg:mb-6">
                    <h2 className="text-lg lg:text-2xl font-semibold">Delivery Address</h2>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-3 lg:px-4 py-3 rounded-md flex items-center lg:gap-2"
                        onClick={() => setModalOpened(true)}
                    >
                        <Plus size={15} />
                        Add New Address
                    </button>
                </div>

                <div>
                    {Address.length == 0 ? (
                        <div className="bg-gray-50 border p-6 rounded-lg text-center text-gray-500">
                            No addresses saved. Please add a new address.
                        </div>
                    ) : (
                        <div className='lg:max-h-[64vh] overflow-auto pr-3'>
                            {Address.map((address) => (
                                <div
                                key={address._id}
                                className={`border p-1 cursor-pointer lg:p-3 rounded-lg mb-2 lg:mb-4 transition-all duration-200 hover:shadow-md ${selectedAddress?.id === address.id
                                    ? 'border-blue-500 shadow-sm'
                                    : 'border-gray-200'
                                }`}
                                    onClick={() => setSelectedAddress(address)}
                                    >
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="radio"
                                            value={address._id}
                                            checked={selectedAddress?._id === address._id}
                                            onChange={() => setSelectedAddress(address)}
                                            className="mt-2"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 lg:mb-1">
                                                <MapPin size={16} className="text-blue-600" />
                                                <span className="font-semibold text-lg">
                                                    {address.address_line}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 lg:mb-1">
                                            {address.localPlace}, {address.city}, {address.district}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Mobile: {address.mobile}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-700"
                                                onClick={() => handleEditClick(address)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteClick(address._id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={handleModalClose}
                centered
                size={isMobile ? 'md' : "xl"}
                padding={isMobile ? 'md' : "lg"}
                radius="md"
                title={editingAddress ? <p className='font-semibold'>Edit Address</p> : <p className='font-semibold'>Add New Address</p>}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 text-sm lg:text-base">
                        <div className="lg:col-span-1">
                            <label className="block font-semibold mb-1">Recipient's Name</label>
                            <input
                                type="text"
                                placeholder="Enter the real name"
                                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                value={formValues.recipient_name}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, recipient_name: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block font-semibold mb-1">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                value={formValues.mobile}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, mobile: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <SelectWrapper
                                label="Province"
                                value={selectedProvince}
                                onChange={(value) => {
                                    setSelectedProvince(value);
                                    setFormValues({ ...formValues, province: value });
                                }}
                                options={Object.keys(locationData)}
                                placeholder="Select Province"
                                disabled={false}
                            />
                        </div>
                        <div className={`lg:col-span-1 ${!selectedProvince ? "pointer-events-none opacity-50" : ""}`}>
                            <SelectWrapper
                                label="District"
                                value={selectedDistrict}
                                onChange={(value) => {
                                    setSelectedDistrict(value);
                                    setFormValues({ ...formValues, district: value });
                                }}
                                options={districts}
                                placeholder="Select District"
                                disabled={!selectedProvince}
                            />
                        </div>
                        <div className={`lg:col-span-1 ${!selectedDistrict ? "pointer-events-none opacity-50" : ""}`}>
                            <SelectWrapper
                                label="City"
                                value={selectedCity}
                                onChange={(value) => {
                                    setSelectedCity(value);
                                    setFormValues({ ...formValues, city: value });
                                }}
                                options={cities}
                                placeholder="Select City"
                                disabled={!selectedDistrict}
                            />
                        </div>
                        <div className={`lg:col-span-1 ${!selectedCity ? "pointer-events-none opacity-50" : ""}`}>
                            <SelectWrapper
                                label="Local Area"
                                value={selectedLocalPlace}
                                onChange={(value) => {
                                    setSelectedLocalPlace(value);
                                    setFormValues({ ...formValues, localPlace: value });
                                }}
                                options={localPlaces}
                                placeholder="Select Local Area"
                                disabled={!selectedCity}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block font-semibold mb-1">Address</label>
                            <input
                                type="text"
                                placeholder="Add additional info like building/street/area"
                                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                value={formValues.address_line}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, address_line: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                </form>
            </Modal>
            
            {/* Delete Confirmation Modal */}
            <Modal
                opened={confirmModalOpened}
                onClose={() => setConfirmModalOpened(false)}
                centered
                size="sm"
                title="Confirm Deletion"
            >
                <p className="mb-4">Are you sure you want to delete this address?</p>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setConfirmModalOpened(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AddressPage;