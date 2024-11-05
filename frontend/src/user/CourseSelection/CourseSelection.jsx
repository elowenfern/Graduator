import React from "react";

const courses = [
  { name: "Medical", icon: "🩺" },
  { name: "Engineering", icon: "⚙" },
  { name: "Management", icon: "📊" },
  { name: "Science", icon: "🔬" },
  { name: "Commerce", icon: "💵" },
  { name: "Arts", icon: "🖌" },
  { name: "Pharmacy", icon: "💊" },
  { name: "Law", icon: "⚖" }
];

const CourseSelection = () => {
  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-semibold mb-8">Choose Your Course</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-6 w-40 h-40 justify-center transition-transform transform hover:scale-105 hover:rounded-full" // Changed to rounded-full on hover
          >
            <div className="text-4xl mb-2">{course.icon}</div>
            <div className="text-lg font-semibold">{course.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;

