import React from 'react';

const CollegeDetails = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* College Overview */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">Dr. N.S.A.M. First Grade College</h1>
        <p className="mt-2 text-gray-600">
          The Dr. N.S.A.M. First Grade College is recognized by the University Grants Commission (UGC). 
          It is affiliated with Bengaluru City University. The college offers Bachelor's programs in Commerce, Management, Arts, and Computer Applications.
        </p>
        <p className="mt-4 text-gray-600">
          The college has been accredited by the National Assessment and Accreditation Council (NAAC) and provides well-equipped facilities to help students develop their skills.
        </p>
      </div>

      {/* Facilities and Infrastructure */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Facilities and Infrastructure</h2>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="text-center">
            <img src="/path/to/boy-hostel-icon.png" alt="Boys Hostel" className="mx-auto" />
            <p className="mt-2 text-gray-600">Boys Hostel</p>
          </div>
          <div className="text-center">
            <img src="/path/to/girls-hostel-icon.png" alt="Girls Hostel" className="mx-auto" />
            <p className="mt-2 text-gray-600">Girls Hostel</p>
          </div>
          <div className="text-center">
            <img src="/path/to/cafeteria-icon.png" alt="Cafeteria" className="mx-auto" />
            <p className="mt-2 text-gray-600">Cafeteria</p>
          </div>
          <div className="text-center">
            <img src="/path/to/sports-icon.png" alt="Sports" className="mx-auto" />
            <p className="mt-2 text-gray-600">Sports</p>
          </div>
          <div className="text-center">
            <img src="/path/to/lab-icon.png" alt="Lab" className="mx-auto" />
            <p className="mt-2 text-gray-600">Lab</p>
          </div>
          <div className="text-center">
            <img src="/path/to/library-icon.png" alt="Library" className="mx-auto" />
            <p className="mt-2 text-gray-600">Library</p>
          </div>
          <div className="text-center">
            <img src="/path/to/wifi-icon.png" alt="WiFi" className="mx-auto" />
            <p className="mt-2 text-gray-600">WiFi</p>
          </div>
          <div className="text-center">
            <img src="/path/to/transportation-icon.png" alt="Transportation" className="mx-auto" />
            <p className="mt-2 text-gray-600">Transportation</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Location</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Dr. N.S.A.M. First Grade College is located at Krishnarajapura Village, Hesaraghatta Hobli, Bengaluru, Karnataka.
          </p>
          <iframe
            className="w-full h-64 mt-4"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
            allowFullScreen=""
            loading="lazy"
            title="College Location"
          ></iframe>
        </div>
      </div>

      {/* WhatsApp Contact */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center"
        >
          <img src="/path/to/whatsapp-icon.png" alt="WhatsApp" className="w-6 h-6 mr-2" />
          Contact on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CollegeDetails;