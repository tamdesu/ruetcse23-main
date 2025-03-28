"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Import close icon (faTimes)
import SideNav from "./sidenav";
import { useState, useEffect, useRef } from "react";

export default function NavTab() {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState("0");
  const [margin, setMargin] = useState("-ml-[350px]");
  const navRef = useRef(null); // Reference for SideNav

  function openNav() {
    setOpen(true);
    nav(true);
  }

  function closeNav() {
    setOpen(false);
    nav(false);
  }

  function nav(isOpen) {
    if (isOpen) {
      setWidth("3/4");
      setMargin("ml-[0px]");
    } else {
      setWidth("0");
      setMargin("-ml-[350px]");
    }
  }

  // Close the nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeNav(); // Close the nav
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Floating Nav Open Button */}
      {!open && (
        <div
          className="w-[50px] h-[50px] rounded bg-cyan-500 fixed right-4 bottom-5 z-[60] text-white flex justify-center items-center bg-opacity-60 hover:bg-opacity-100 hover:bg-cyan-300 duration-200 cursor-pointer"
          onClick={openNav}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      )}

      {/* Floating Nav Close Button */}
      {open && (
        <div
          className="w-[50px] h-[50px] rounded bg-cyan-500 fixed right-4 bottom-5 z-[60] text-white flex justify-center items-center bg-opacity-60 hover:bg-opacity-100 hover:bg-cyan-300 duration-200 cursor-pointer"
          onClick={closeNav}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      )}

      {/* Side Navigation (Pass ref) */}
      <div ref={navRef}>
        <SideNav width={width} margin={margin} />
      </div>
    </>
  );
}
