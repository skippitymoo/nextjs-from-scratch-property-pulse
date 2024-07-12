import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/components/AuthProvider";
import { GlobalContextProvider } from "@/context/GlobalContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Propert Pulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, properties, find rentals, find properties",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalContextProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <NavBar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalContextProvider>
  );
};

export default MainLayout;
