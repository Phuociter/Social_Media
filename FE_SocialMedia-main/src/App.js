import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword, Dashboard, UserManagement, PostManagement } from "./pages";
import Admin from "./admin/admin";
import {PrivateRoute, PrivateRouteAdmin, PrivateRouteUser}  from "./pages/PrivateRoute";



function Layout() {
  const { user } = useSelector((state) => state.user);
  

  const location = useLocation();
          // Kiểm tra toàn bộ object user

//   return user ? (
//     <Outlet />
//   ) : (
//     <Navigate to='/login' state={{ from: location }} replace />
//   )
  }

function App() {  
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
      <Route>
        <Route path="/login" element={<PrivateRouteUser />}>
          <Route path="" element={<Login />} />
        </Route>
        <Route path="/register" element={<PrivateRouteUser />} />
          <Route path="" element={<Register />} />
        </Route>
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/profile/:id?' element={<Profile />} />
          {/* kiẻm tra xem có phải admin hay không */}
            <Route element={<PrivateRouteAdmin />}> 
              <Route path='/admin' element={<Admin />} >
                <Route index element={<Navigate to='dashboard' replace />} />
                <Route path='dashboard' element={<Dashboard />} />  
                <Route path='UserManagement' element={<UserManagement />} />
                <Route path='PostManagement' element={<PostManagement />} />
              </Route>
            </Route>
          </Route>
      </Routes>   
    </div>
  );
}

export default App;
  