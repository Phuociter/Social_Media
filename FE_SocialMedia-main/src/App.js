import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  console.log("User:", user);          // Kiểm tra toàn bộ object user
  console.log("User token:", user?.token); //
  return user ?
   <Outlet />
    : 
    <Navigate to='/login' state={{ from: location }} replace />;

}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/Home' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
