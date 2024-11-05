import React from 'react'
import Hero from '../Hero/Hero'
import BestCities from '../BestCities/BestCities'
import CampusDetails from '../CampusDetials/CampusDetials'
import Contact from '../Contact/Contact'
import Footer from '../Footer/Footer'
import CourseSelection from '../CourseSelection/CourseSelection'
import GettoUS from '../Contact/GettoUs'
import BestCourses from '../Best Courses/BestCourses'
function Home() {
  return (
    <div>
      <Hero/>
      <CampusDetails/>
      <BestCourses/>
      <CourseSelection/>
      <BestCities/>
      <GettoUS/>
      <Footer/>
    </div>
  )
}

export default Home
