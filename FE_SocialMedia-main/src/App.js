import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Home, Login, Profile, Register, ResetPassword, Dashboard, UserManagement, PostManagement,EditProfilePage } from "./pages";
import Admin from "./admin/admin";
import {PrivateRoute, PrivateRouteAdmin, PublicRoute}  from "./pages/PrivateRoute";

function Layout() {
  const {user} = useSelector((state) => state.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }
  return <Outlet />;
}

function App() {  
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route>
          <Route path="/login" element={<PublicRoute />}>
            <Route path="" element={<Login />} />
          </Route>
          <Route path="/register" element={<PublicRoute />}>
            <Route path="" element={<Register />} />
          </Route>

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path="/posts/:postId" element={<Home />} />
              <Route path='/profile/:id?' element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
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
        </Route>
      </Routes>   
    </div>
  );
}

export default App;
