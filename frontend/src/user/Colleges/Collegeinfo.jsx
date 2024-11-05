import React from 'react';
import { useParams } from 'react-router-dom';

// Example data for colleges
const colleges = [
  {
    id: 1,
    name: 'Harvard University',
    location: 'Cambridge, MA',
    image: 'https://example.com/harvard.jpg',
    courses: ['Computer Science', 'Business', 'Law'],
    feeStructure: '$50,000 per year',
    admissionDetails: 'SAT/ACT scores, letters of recommendation required.',
  },
  {
    id: 2,
    name: 'Stanford University',
    location: 'Stanford, CA',
    image: 'https://example.com/stanford.jpg',
    courses: ['Engineering', 'Biology', 'Psychology'],
    feeStructure: '$55,000 per year',
    admissionDetails: 'High school GPA, personal statement required.',
  },
  {
    id: 3,
    name: 'MIT',
    location: 'Cambridge, MA',
    image: 'https://example.com/mit.jpg',
    courses: ['Mathematics', 'Physics', 'Architecture'],
    feeStructure: '$53,000 per year',
    admissionDetails: 'Portfolio required for some programs.',
  },
];

const CollegeInfo = () => {
  const { id } = useParams(); // Get the college ID from the URL
  const college = colleges.find(col => col.id === parseInt(id)); // Find the college by ID

  if (!college) return <p>College not found</p>; // Handle case where college is not found

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-4">{college.name}</h1>
      <img src={college.image} alt={college.name} className="w-full h-60 object-cover mb-6" />
      <h2 className="text-2xl font-semibold mb-2">Location: {college.location}</h2>
      <h3 className="text-xl font-semibold mb-2">Courses Offered:</h3>
      <ul className="list-disc pl-5 mb-4">
        {college.courses.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
      <p className="mb-4"><strong>Fee Structure:</strong> {college.feeStructure}</p>
      <p><strong>Admission Process:</strong> {college.admissionDetails}</p>
    </div>
  );
};

export default CollegeInfo;
