import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Courses, Fees, Description, Photos } from './Courses';
import Book from '../Contact/Book';
import UniversityDetail from './UniversityDetial';
import config from '../../config';
import BookAdmissionForm from '../Contact/Sidebook';
import PopularCoursesSection from './PopularCourse';
import TopColleges from './Topcolleges';

const CollegeDetails = () => {
  const [college, setCollege] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('photos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { slug } = useParams(); // Get the slug from the URL
  const baseURL = config.API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchCollegeDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/colleges/slug/${slug}/`);
        setCollege(response.data);
        
        if (response.data.university) {
          const universityResponse = await axios.get(
            `${baseURL}/api/universities/${response.data.university}/`
          );
          setUniversity(universityResponse.data);
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < (college?.images?.length ?? 0) - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <div className="relative">
      {/* Hero Section with Fixed Background & Logo */}
      <div
        style={{
          backgroundImage: college?.images?.[0]?.image
            ? `url('${college.images[0].image}')`
            : 'url("https://source.unsplash.com/random/1920x1080")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          backgroundRepeat: 'no-repeat',
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-md">
              <img
                src={college?.logo || 'https://via.placeholder.com/150'}
                alt="College Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold text-white">{college?.name || 'College Name'}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-[70%] bg-white shadow-md p-6 rounded-lg">
            <nav className="flex flex-wrap justify-center space-x-6 text-blue-600 font-semibold mb-4">
              <a
                href="#photos"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('photos')}
              >
                Photos
              </a>
              <a
                href="#description"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('description')}
              >
                Description
              </a>
              <a
                href="#university"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('university')}
              >
                University
              </a>
              <a
                href="#fees"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('fees')}
              >
                Fees
              </a>
              <a
                href="#courses"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('courses')}
              >
                Courses
              </a>
              <a
                href="#book"
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => setSelectedSection('book')}
              >
                Book Admission
              </a>
            </nav>

            {/* Content Sections */}
            <div className={`${selectedSection === 'photos' ? 'block' : 'hidden'}`}>
              <Photos college={college} openModal={openModal} />
              <Description college={college} />
              <UniversityDetail university={university || {}} />
              <Fees college={college} />
              <Courses college={college} />
            </div>
            <div className={`${selectedSection === 'description' ? 'block' : 'hidden'}`}>
              <Description college={college} />
            </div>
            <div className={`${selectedSection === 'university' ? 'block' : 'hidden'}`}>
              <UniversityDetail university={university || {}} />
            </div>
            <div className={`${selectedSection === 'fees' ? 'block' : 'hidden'}`}>
              <Fees college={college} />
            </div>
            <div className={`${selectedSection === 'courses' ? 'block' : 'hidden'}`}>
              <Courses college={college} />
            </div>
            <div className={`${selectedSection === 'book' ? 'block' : 'hidden'}`}>
              <Book />
            </div>
          </div>

          {/* Right Section: Book Admission & Popular Courses */}
          <div className="flex flex-col gap-6 bg-white shadow-md p-4 rounded-lg w-full lg:w-[30%]">
            <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
              <BookAdmissionForm />
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
              <TopColleges />
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-md shadow-sm">
              <PopularCoursesSection />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative p-2 rounded-md shadow-md max-w-full max-h-screen overflow-hidden">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 z-50"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 z-50"
              onClick={handlePrevious}
              disabled={currentImageIndex <= 0}
            >
              Previous
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 z-50"
              onClick={handleNext}
              disabled={currentImageIndex >= (college?.images?.length ?? 0) - 1}
            >
              Next
            </button>
            <img
              src={college?.images?.[currentImageIndex]?.image || 'https://via.placeholder.com/1920x1080'}
              alt="College Preview"
              className="max-w-screen max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetails;
