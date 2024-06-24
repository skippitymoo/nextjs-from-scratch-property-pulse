import { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

import "@/assets/styles/globals.css";

export const metadata: Metadata = {
  title: "Propert Pulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, properties, find rentals, find properties",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default MainLayout;
