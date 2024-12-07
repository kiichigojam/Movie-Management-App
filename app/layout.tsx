import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/header"; // Ensure this path is correct
import Footer from "./_components/footer";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="md:px-0">
          <Header />
          <main>{children}</main>
          
        </div>
      </body>
    </html>
  );
}
