import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InquiryList = () => {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await axios.get('/api/inquiries/');
            setInquiries(response.data);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/api/inquiries/${id}/`, { is_read: true });
            fetchInquiries();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">New Inquiries</h2>
            {inquiries.length > 0 ? (
                <ul>
                    {inquiries.map((inquiry) => (
                        <li key={inquiry.id} className="border-b py-4">
                            <p><strong>Name:</strong> {inquiry.name}</p>
                            <p><strong>Email:</strong> {inquiry.email}</p>
                            <p><strong>Phone:</strong> {inquiry.phone}</p>
                            <p><strong>Message:</strong> {inquiry.message}</p>
                            <p><strong>Course:</strong> {inquiry.course}</p>
                            <p><strong>College:</strong> {inquiry.college}</p>
                            <p><strong>Received:</strong> {new Date(inquiry.created_at).toLocaleString()}</p>
                            {!inquiry.is_read && (
                                <button 
                                    className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
                                    onClick={() => markAsRead(inquiry.id)}
                                >
                                    Mark as Read
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No new inquiries</p>
            )}
        </div>
    );
};

export default InquiryList;
