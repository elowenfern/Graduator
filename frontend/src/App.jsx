import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import React from 'react';
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

import CoursesPage from './Admin/Allcourses';
import CollegePage from './Admin/coursetocollege';
import BlogPage from './user/Blog/Blog';

import Filteredloc from './user/Filter/Filteredlocation';
import AddSectionForm from './Admin/Add/Addsection';
import Coursed from './user/Coursesd.jsx/Coursesd';
import AllUniversity from './Admin/Alluniversity';
import FilteredColleges from './user/Filter/Filtercoursename';
import Location from './user/CampusDetials/CollegeLocation';
import SearchResults from './user/Header/Result';
import PopularCoursesSection from './user/Colleges/PopularCourse';
import CourseDetail from './user/Coursesd.jsx/CourseDetial';
import EditCollegeDetail from './Admin/Edit/CollegeandCourse';
import AddBlog from './Admin/Add/AddBlog';
import DisplayBlogs from './Admin/Edit/Editblog';

import NotificationPanel from './Admin/Common/Notification';

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
            
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/courses" element={<Coursed />} />
            <Route path="/popular" element={<PopularCoursesSection />} />
            <Route path="/course-details/:courseName" element={< CourseDetail />} />
            <Route path="/locaion" element={<Location />} />
            <Route path="/colleges/:slug" element={<CollegeDetails />} />
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

              <Route path="/notification" element={<NotificationPanel />} />


              <Route path="/edit/:id" element={<EditCollege />} />
              <Route path="/addcollege" element={<AddColleges />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/addsection" element={<AddSectionForm />} />
              <Route path="/addblog" element={<AddBlog />} />
              <Route path="/editblog" element={<DisplayBlogs/>}/>
              <Route path="/allcourse" element={<CoursesPage />} />

              <Route path="/courseto" element={<CollegePage/>} />
              <Route path="/college/:collegeId" element={<EditCollegeDetail/>}/>
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
