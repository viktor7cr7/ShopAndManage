import { useState, createContext, useContext } from 'react';
import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/DashboardAdmin';
import Navbar from '../components/NavbarAdmin';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import BigSidebar from '../components/BigSidebarAdmin';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/admin/current-user');
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect('/');
  }
};

const DashboardContext = createContext();

const DashboardLayout = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    await customFetch.get('/auth/logout');
    toast.success('successful logout');
    navigate('/');
  };

  return (
    <DashboardContext.Provider value={{ user, toggleSidebar, logoutUser, showSidebar }}>
      <Wrapper>
        <main className="dashboard">
          <BigSidebar></BigSidebar>
          <div>
            <Navbar></Navbar>
            <div className="dashboard-page">
              <Outlet context={{ user }}></Outlet>
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
