import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { Slug } from "../../utils";
import BookAdmissionForm from "../Contact/Sidebook";
import TopColleges from "../Colleges/Topcolleges";
import PopularCoursesSection from "../Colleges/PopularCourse";

const CourseDetail = () => {
  const { courseName } = useParams();
  const [course, setCourse] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCollegeClick = (collegeName) => {
    const slug = Slug(collegeName);
    navigate(`/colleges/${slug}`); // Navigate to the college's page
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (courseName) {
      const decodedCourseName = decodeURIComponent(courseName);

      fetch(`${config.API_URL}/api/courses?name=${decodedCourseName}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.length > 0) {
            const courseDetails = data[0];
            setCourse(courseDetails);
            fetchColleges(courseDetails.name);
          } else {
            setError("No course found.");
          }
        })
        .catch((error) => {
          console.error("Error loading course data: ", error);
          setError("Failed to load course details.");
        });
    }
  }, [courseName]);

  const fetchColleges = (courseName) => {
    fetch(`${config.API_URL}/api/colleges?course_name=${encodeURIComponent(courseName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setColleges(data);
      })
      .catch((error) => {
        console.error("Error loading colleges data: ", error);
        setError("No colleges found for this course.");
      });
  };

  return (
    <div className="relative min-h-screen bg-gray-100 text-black">
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}

      {/* Background Image Section */}
      {course && (
        <div
          className="relative bg-cover bg-center bg-no-repeat h-[60vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]"
          style={{
            backgroundImage: `url(${course.image})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-4 left-4 text-white font-bold text-4xl sm:text-2xl md:text-3xl lg:text-4xl z-10">
            {course.name}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col md:flex-row mt-4 w-full">
        {/* Left Section */}
        <div className="flex-1 bg-white p-6 shadow-md rounded-lg md:mr-4 lg:w-2/3">
          <p className="text-lg md:text-xl leading-relaxed text-black">
            {course?.description || "No description available."}
          </p>
          <div className="mt-8">
            {colleges.length > 0 ? (
              <div className="overflow-hidden bg-gray-100 py-4">
                <div className="flex animate-college-scroll space-x-4 overflow-x-auto">
                  {colleges.map((college, index) => (
                    <div
                      key={`${college.id}-${index}`}
                      className="min-w-[200px] h-64 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-300"
                      onClick={() => handleCollegeClick(college.name)} // Trigger navigate on click
                    >
                      <img
                        src={college.images[0]?.image}
                        alt={college.name}
                        className="w-full h-3/4 object-cover rounded-t-lg"
                      />
                      <p className="text-sm text-center mt-2 px-2">{college.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-center">No Colleges Found</p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[300px] bg-white shadow-md rounded-lg mt-6 md:mt-0">
          <div>
            <BookAdmissionForm />
          </div>
          <div>
            <PopularCoursesSection />
          </div>
          <div>
            <TopColleges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
