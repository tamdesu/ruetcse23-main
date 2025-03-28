import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbarWrapper";
import NavTab from "@/components/navtab";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "RUET CSE 23",
  description: "This is the website of Computer Science and Engineering department of Rajshahi University of Engineering and Technology of Batch-23",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <NavTab />
        {children}
      </body>
    </html>
  );
}
