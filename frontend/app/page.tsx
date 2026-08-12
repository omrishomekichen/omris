'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import './globals.css';
import { usePathname } from 'next/navigation';



export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
    useEffect(() => {
     
        router.push('/dashboard');
      
    }, [router, pathname]);


    

    return null;
}