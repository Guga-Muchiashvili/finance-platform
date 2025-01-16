import NavBarComponent from "@/components/NavBarComponent/NavBarComponent";
import React from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NavBarComponent />

      <main
        style={{
          marginLeft: "4rem",
          flex: "1",
        }}
      >
        <Toaster />
        {children}
      </main>
    </div>
  );
}
