import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Icomp Store",
  description: "A simple virtual store for icomp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
