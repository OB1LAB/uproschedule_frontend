"use client";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import useScheduleStore from "@/modules/Schedule/useScheduleStore";
import { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";

const inter = Inter({ subsets: ["cyrillic"] });
export default function CustomBody({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const getSchedule = useScheduleStore((store) => store.getSchedule);
  useEffect(() => {
    getSchedule().then(() => {
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return (
      <body className={inter.className}>
        <main>
          <div style={{ color: "white" }}>Загрузка...</div>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            closeButton={true}
            pauseOnHover={false}
            theme="dark"
          />
        </main>
      </body>
    );
  }
  return (
    <body className={inter.className}>
      <CustomProvider theme="dark">
        <main>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            closeButton={true}
            pauseOnHover={false}
            theme="dark"
          />
        </main>
      </CustomProvider>
    </body>
  );
}
