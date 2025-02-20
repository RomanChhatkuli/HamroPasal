import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../stores/useOrderStore';

const PaymentStatusPage = () => {
    const { addOrders } = useOrderStore();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const transactionId = queryParams.get('transactionId')
    const orderProcessed = useRef(false); // Prevent duplicate calls

    useEffect(() => {
        if (!orderProcessed.current) {
            if (status === 'success') { 
                addOrders(transactionId);
            }
            orderProcessed.current = true; // Mark as processed
        }

        const redirectTimer = setTimeout(() => {
            navigate('/')
        }, 200);

        return () => clearTimeout(redirectTimer);
    }, [status, navigate, addOrders]); // Dependencies

    return null;
};

export default PaymentStatusPage;

