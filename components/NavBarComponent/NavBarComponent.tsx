"use client";
import { Routes } from "@/common/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavBarComponent = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Run only on the client side
  }, []);

  if (!isClient) return null; // Avoid rendering during SSR

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const handleNavigation = (route: string) => {
    const baseRoute = "/Dashboard";
    const fullPath =
      route === "Dashboard" ? baseRoute : `${baseRoute}/${route}`;
    router.push(fullPath);
  };

  return (
    <div className="w-16 flex flex-col h-screen bg-gray-200 text-blue-600 fixed items-center justify-center py-4">
      {Routes.map((item) => (
        <div
          key={item.route}
          onClick={() => handleNavigation(item.route)}
          className={`relative group flex flex-col items-center mb-6 cursor-pointer hover:text-blue-900 ${
            currentPath ===
            `/Dashboard${item.route === "Dashboard" ? "" : `/${item.route}`}`
              ? "font-bold text-blue-900"
              : ""
          }`}
        >
          <item.icon size={24} />
          <span className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-sm px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
            {item.route}
          </span>
        </div>
      ))}
    </div>
  );
};

export default NavBarComponent;
