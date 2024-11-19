import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Courses, Fees, Photos, Description } from './Courses';
import Book from '../Contact/Book';
import UniversityDetail from './UniversityDetial'; // Import UniversityDetail

const CollegeDetails = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [university, setUniversity] = useState(null);
   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState('photos'); // Track selected section

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/colleges/${id}/`);
        setCollege(response.data); // Set college data
        console.log('College Data:', response.data); // Log the entire response data for debugging

        // Fetch the university data if it exists
        if (response.data.university) {
          const universityResponse = await axios.get(`http://localhost:8000/api/universities/${response.data.university}/`);
          setUniversity(universityResponse.data); // Set the university data
        }
        if (response.data.university) {
          const universityResponse = await axios.get(`http://localhost:8000/api/universities/${response.data.university}/`);
          setUniversity(universityResponse.data); // Set university data
        }

        

      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('College not found');
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id]);


  // Modal open/close functionality
  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % college.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + college.images.length) % college.images.length
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <nav className="flex justify-center space-x-8 text-green-500 font-bold">
        <a
          href="#photos"
          className="hover:underline"
          onClick={() => setSelectedSection('photos')}
        >
          Photos
        </a>
        <a
          href="#description"
          className="hover:underline"
          onClick={() => setSelectedSection('description')}
        >
          Description
        </a>
        <a
          href="#university"
          className="hover:underline"
          onClick={() => setSelectedSection('university')}
        >
          University
        </a>
        <a
          href="#fees"
          className="hover:underline"
          onClick={() => setSelectedSection('fees')}
        >
          Fees
        </a>
        <a
          href="#courses"
          className="hover:underline"
          onClick={() => setSelectedSection('courses')}
        >
          Courses
        </a>
        <a
          href="#book"
          className="hover:underline"
          onClick={() => setSelectedSection('book')}
        >
          Book Admission
        </a>
      </nav>

      {/* University Details */}
      {selectedSection === 'university' && university && (
        <UniversityDetail university={university} />
      )}

      {/* Conditional Rendering of Sections */}
      {selectedSection === 'photos' && (
        <div>
          <Photos
            college={college}
            openModal={openModal}
            closeModal={closeModal}
            selectedImageIndex={selectedImageIndex}
            nextImage={nextImage}
            prevImage={prevImage}
          />
          <Description college={college} />
        </div>
      )}

      {selectedSection === 'description' && <Description college={college} />}
      {selectedSection === 'fees' && <Fees college={college} />}
      {selectedSection === 'courses' && <Courses college={college} />}
      {selectedSection === 'book' && <Book />}
    </div>
  );
};

export default CollegeDetails;
