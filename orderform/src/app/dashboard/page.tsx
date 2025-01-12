"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderForm from "../components/OrderForm";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); 
    }
  }, []);

  return (
    <div>
      <OrderForm />
    </div>
  );
};

export default Dashboard;
