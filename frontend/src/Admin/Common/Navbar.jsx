import React, { useState, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  // Fetch data and update unread count
  const fetchInquiries = () => {
    fetch(`${config.API_URL}/api/inquiries/`)
      .then((response) => response.json())
      .then((data) => {
        setInquiries(data);
        const unread = data.filter((inquiry) => !inquiry.is_read).length;
        setUnreadCount(unread);
      })
      .catch((error) => console.error('Error fetching inquiries:', error));
  };

  useEffect(() => {
    fetchInquiries(); // Fetch initial data

    // Set interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchInquiries, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Manually trigger refresh
  const handleRefresh = () => {
    fetchInquiries(); // Trigger a manual refresh
  };

  const handleNavigate = () => {
    navigate('/notification');
  };

  return (
    <div className="relative flex justify-end items-center w-full pr-6"> {/* Align to the right */}
      <button onClick={handleNavigate} className="p-1.5 relative rounded-sm hover:bg-gray-100">
        <HiOutlineBell fontSize={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Manual Refresh Button (optional) */}
      <button onClick={handleRefresh} className="ml-2 text-sm text-blue-500 hover:underline">
        Refresh
      </button>
    </div>
  );
}

export default NotificationBell;
