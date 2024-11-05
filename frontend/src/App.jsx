import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import CollegeList from './user/Colleges/Colleges';
import Home from './user/Home/Home';
import Header from './user/Header/Header';
import CollegeInfo from './user/Colleges/Collegeinfo';
import Contact from './user/Contact/Contact';
import AdminLogin from './Admin/AdminLogin';
import ProtectedRoute from './Admin/ProjectRoute';
import Dashboard from './Admin/Dashboard';
import Layout from './Admin/Common/Layout';
import EditCollege from './Admin/EditCollege';
import { AddColleges } from './Admin/Addcolleges';





// Layout component to apply the Header for specific routes
const LayoutWithHeader = () => (
  <>
    <Header />  {/* This will render the Header component */}
    <Outlet />  {/* This renders the child route component */}
  </>
);

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Routes with Header */}
          <Route element={<LayoutWithHeader />}>
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/colleges/:id" element={<CollegeInfo />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin route without Header */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditCollege/>} />
          <Route path="/addcollege" element={<AddColleges/>} />
          </Route>
        </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
