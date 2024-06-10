import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home"
import Navbar from "./components/Common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp"
import ForgetPassword from "./Pages/ForgetPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Dashboard from "./Pages/Dashboard"
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constant";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./Pages/Catalog";
import Error from "./Pages/Error";
import CourseDetails from "./Pages/CourseDetails";
import Cart from "./components/core/Dashboard/Cart";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/Instructor";
function App() {
  const {user }=useSelector((state)=>state.profile)
 return(
  <div  className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
  <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path ="/contact" element={<Contact/>}/>
      <Route path="catalog/:catalogName" element={<Catalog />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />
      <Route path="login" element={
        <OpenRoute>
          <Login/>
        </OpenRoute>
          
        
      }/>
      <Route path="signup" element={
          <OpenRoute>
             <SignUp/>
          </OpenRoute>
      }/>
      <Route path="forgot-password" element={
        <OpenRoute>
          <ForgetPassword/>
        </OpenRoute>
      }/>
      <Route path="update-password/:id" element={
        <OpenRoute>
          <UpdatePassword/>
        </OpenRoute>
      }/>
      <Route path="verify-email" element={
        <OpenRoute>
          <VerifyEmail/>
        </OpenRoute>
      }/>
      <Route element={
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      }>
        <Route path="dashboard/my-profile" element={<MyProfile/>}/>
        <Route path="dashboard/Settings" element={<Settings/>}/>
        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              
            <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        {
          user?.accountType ===ACCOUNT_TYPE.STUDENT &&(
            <>
              <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )
        }
        <Route path="dashboard/settings" element={<Settings />} />
        
      </Route>
      <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails/>}
              />
            </>
          )}
        </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  </div>
 )
}

export default App;
