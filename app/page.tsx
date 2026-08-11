'use client';

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import Api from './__apis/api';
import './globals.css';
import { usePathname } from 'next/navigation';



export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
      Api.health().catch(console.error);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      const authenticated = Boolean(token && user);
      setIsAuthenticated(authenticated);

      if (pathname === '/' && isAuthenticated) {
        router.push('/dashboard');
        } else if (pathname === '/' && !isAuthenticated) {
            router.push('/login');
        }
    }, [router, pathname]);


    

    return null;
}