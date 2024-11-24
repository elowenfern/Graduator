import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import CollegeList from './user/Colleges/Colleges';
import Home from './user/Home/Home';
import Header from './user/Header/Header';
import Contact from './user/Contact/Contact';
import AdminLogin from './Admin/AdminLogin';
import ProtectedRoute from './Admin/ProjectRoute';
import Dashboard from './Admin/Dashboard';
import Layout from './Admin/Common/Layout';
import EditCollege from './Admin/Edit/EditCollege';
import { AddColleges } from './Admin/Add/Addcolleges';
import CollegeDetails from './user/Colleges/Collegedetial';
import { AddUniversity } from './Admin/Add/Adduniversity';
import AddCourse from './Admin/Add/Addcourse';
import CourseList from './Admin/Edit/Editcourses';
import CollegesPage from './Admin/Allcourses';
import CoursesPage from './Admin/Edit/Editcourses';
import AddFacility from './Admin/Add/Addfacilities';
import FilteredCoursename from './user/Filter/Filtercoursename';
import Filteredloc from './user/Filter/Filteredlocation';
import AddSectionForm from './Admin/Add/Addsection';
import Coursed from './user/Coursesd.jsx/Coursesd';
import AllUniversity from './Admin/Alluniversity';
import FilteredColleges from './user/Filter/Filtercoursename';
import Location from './user/CampusDetials/CollegeLocation';
import SearchResults from './user/Header/Result';

// Layout component to apply the Header for specific routes
const LayoutWithHeader = () => (
  <>
    <Header />  {/* This will render the Header component */}
    <Outlet />  {/* This renders the child route component */}
  </>
);

function App() {
 
  React.useEffect(() => {
    document.title = "Graduator's Academy";
  }, []);
  
  return (
    <div>
      <Router>
        <Routes>
          {/* Routes with Header */}
          <Route element={<LayoutWithHeader />}>
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/courses" element={<Coursed />} />
            <Route path="/locaion" element={<Location />} />
            <Route path="/colleges/:id" element={<CollegeDetails />} />
            <Route path="/collegee/:course" element={<FilteredColleges />} />
            <Route path="/location/:location" element={<Filteredloc />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collegesearch" element={<SearchResults />}/>
          </Route>

          {/* Admin route without Header */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit/:id" element={<EditCollege />} />
              <Route path="/addcollege" element={<AddColleges />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/addsection" element={<AddSectionForm />} />
              <Route path="/addfacility" element={<AddFacility />} />
              <Route path="/allcourse" element={<CollegesPage />} />
              <Route path="/university" element={<AllUniversity />} />
              <Route path="/courses/:collegeId" element={<CoursesPage />} />
              <Route path="/adduniversity" element={<AddUniversity />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
