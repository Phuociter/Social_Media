import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword, Dashboard, Team, Form, UserManagement } from "./pages";
import Admin from "./admin/admin";

function Layout() {
  const { user } = useSelector((state) => state.user);
  

  const location = useLocation();
          // Kiểm tra toàn bộ object user

  return user ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  )
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
          <Route path='/admin' element={<Admin />} >
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='UserManagement' element={<UserManagement />} />
            <Route path='Team' element={<Team />} />
            <Route path='Form' element={<Form />} />
          </Route>
          
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
