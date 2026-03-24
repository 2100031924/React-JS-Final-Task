import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import BackToTop from './BackToTop';
import CursorGlow from './CursorGlow';
import FloatingShapes from './FloatingShapes';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('page-wrapper');
    const timeout = setTimeout(() => {
      document.body.classList.remove('page-wrapper');
    }, 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <FloatingShapes />
      <CursorGlow />
      <Navbar />
      <main key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <BackToTop />
    </>
  );
}
