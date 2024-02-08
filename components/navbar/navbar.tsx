'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';



export default function Navbar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  //const [isUserLoggedIn, setIsUserLoggedIn] = useState(localStorage.getItem('isUserLoggedIn') === 'true');

  /*const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('isUserLoggedIn') === 'true' : false
  );*/

  useEffect(() => {
    setIsUserLoggedIn(localStorage.getItem('isUserLoggedIn') === 'true');
    setUserRole(localStorage.getItem('userRole') || '');
  }, []);

  /*useEffect(() => {
    const checkLoginStatus = () => {
      console.log("Checking login status...");
      const storedValue = localStorage.getItem('isUserLoggedIn');
      console.log('Stored value:', storedValue);
      setIsUserLoggedIn(!!localStorage.getItem('isUserLoggedIn'));
    };

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);*/

  const handleLogout = () => {
    localStorage.setItem('isUserLoggedIn', 'false');
    //setIsUserLoggedIn(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }

  };

  /*const handleLogout = async () => {
    await new Promise(resolve => {
      localStorage.setItem('isUserLoggedIn', 'false');
      window.addEventListener('storage', () => {
        resolve(null);
      });
    });

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };*/

  const getDashboardLink = () => {
    switch (userRole) {
      case 'superadmin':
        return '/superUser/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  }
  return (
    <div className='p-4 flex justify-between items-center'>
      <Link href="/">D.A.E.M App</Link>

      <div className='flex'>
        {isUserLoggedIn ? (
          <>
            <Link href={getDashboardLink()} className='mr-4'>
              <h1>Dashboard</h1>
            </Link>
            <Link href="/myaccount" className='mr-4'>
              <h1>My Account</h1>
            </Link>
            <button onClick={handleLogout}>
              <h1>Logout</h1>
            </button>
          </>
        ) : (
          <Link href="/auth/login">
            <h1>Login</h1>
          </Link>
        )}
      </div>
    </div>
  )
}