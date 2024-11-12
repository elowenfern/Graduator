import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Courses,Fees,Photos,Description } from './Courses';
import Book from  '../Contact/Book';

const CollegeDetails = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/editcolleges/${id}/`);
        setCollege(response.data);
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
      <nav className="flex justify-center space-x-8 text-gray-700 font-bold">
        <a href="#photos" className="hover:underline">Photos</a>
        <a href="#description" className="hover:underline">Description</a>
        <a href="#fees" className="hover:underline">Fees</a>
        <a href="#courses" className="hover:underline">Courses</a>
        <a href="#book" className="hover:underline">Book Admission</a>
      </nav>


      <Photos 
        college={college} 
        openModal={openModal} 
        closeModal={closeModal} 
        selectedImageIndex={selectedImageIndex} 
        nextImage={nextImage} 
        prevImage={prevImage} 
      />
      <Description college={college} />
      <Fees college={college} />
      <Courses college={college} />
      <Book/>
      
           
    </div>
  );
};

export default CollegeDetails;

