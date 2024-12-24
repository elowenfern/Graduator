import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import config from '../../config';

function NotificationPanel() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/inquiries/`)
      .then((response) => response.json())
      .then((data) => {
        setInquiries(data);
      });
  }, []);



  
  const markAsRead = async (id) => {
    try {
      console.log('Marking as read:', id);  // Debug log
      const response = await fetch(`${config.API_URL}/api/inquiries/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });
  
      console.log('Response:', response);  // Debug log
  
      if (response.ok) {
        console.log('Marked as read successfully');
        setInquiries((prevInquiries) =>
          prevInquiries.map((inquiry) =>
            inquiry.id === id ? { ...inquiry, is_read: true } : inquiry
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to mark as read:', errorData);
      }
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Inquiries</h1>

      {inquiries.length > 0 ? (
        inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="p-4 mb-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => markAsRead(inquiry.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{inquiry.name}</h2>
                <p className="text-sm text-gray-500">
                  {inquiry.course} at {inquiry.college}
                </p>
                <p className="text-sm text-gray-700">Email: {inquiry.email}</p>
                <p className="text-sm text-gray-700">Phone: {inquiry.phone}</p>
                <p className="mt-2 text-sm">{inquiry.message || 'No message'}</p>
              </div>
              {!inquiry.is_read && (
                <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
                  Unread
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No inquiries found.</p>
      )}
    </div>
  );
}

export default NotificationPanel;
