"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (typeof window !== "undefined" && window.localStorage) {
        const loggedIn = localStorage.getItem("loggedIn");
        const userId = localStorage.getItem("userId");
        const _id = localStorage.getItem("_id");

        if (loggedIn === "true" && userId) {
          try {
            const res = await fetch(`/api/getLoggedUser?_id=${_id}&userId=${userId}`);
            const data = await res.json();
            if (res.ok) {
              setIsLoggedIn(true);
              setUser(data);
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data.");
          }
        }
      }
    }

    fetchUserData();
  }, []);

  return (
    <nav className="w-full h-[60px] bg-black bg-opacity-30 backdrop-blur drop-shadow flex items-center justify-between p-2 text-xl font-extralight fixed top-0 left-0 z-[900]">
      <Link href="/">
        <span>
          <span className="text-cyan-500 font-normal">{"</>"}</span> RUET CSE •{" "}
          <span className="text-cyan-300">23</span>
        </span>
      </Link>
      {isLoggedIn && user ? (
        <div>
          <Link
            className="py-2 px-4 flex gap-2 items-center "
            href={`/profile/${user.userId}`}
          ><span className="hidden sm:block text-sm">{user.name}</span>
            <img
              src={user.image || "https://via.placeholder.com/100"}
              alt="Profile Picture"
              width="50"
              height="50"
              style={{
                borderRadius: "100%",
                border: "2px solid #333",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                objectFit: "cover",
                objectPosition: "top",
                maxHeight: "50px",
                maxWidth: "50px",
              }}
            />
          </Link>
        </div>
      ) : (
        <div>
          <Link
            className="py-2 px-4 rounded text-cyan-300 hover:bg-cyan-300 hover:text-white duration-300 text-lg"
            href="/login"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
