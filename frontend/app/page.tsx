'use client'

import DashboardPage from "./(pages)/dashboard/page";
import {useEffect} from "react";
import Api from "../app/__apis/api"

export default function Home() {
  
  useEffect(() => {
    const res = Api.health();
  }, []);

  return <DashboardPage />;
}
