import "@/assets/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propert Pulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, properties, find rentals, find properties",
};

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default MainLayout;
