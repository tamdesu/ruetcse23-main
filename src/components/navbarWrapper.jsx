"use client";

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper({ children }) {
    const pathname = usePathname();

    // Define routes where Navbar should not be shown
    const noNavRoutes = ['/login', '/signup'];

    const showNavbar = !noNavRoutes.includes(pathname);

    return (
        <>
            {showNavbar && <Navbar />}
            {children}
        </>
    );
}
