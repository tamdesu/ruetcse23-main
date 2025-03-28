"use client"

import Link from "next/link"
import { useState, useEffect } from "react";
export default function LoginModal() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    })
    const data = await res.json();
    if(!res.ok){
      setError(data.error);
    }
    else{
      if(window && window.localStorage){
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("_id", data.user._id);
        localStorage.setItem("userId", data.user.userId);
        window.location.href = "/";
      }
    }

  }
  return (

          <div className="w-full max-w-[350px] h-auto flex flex-col justify-between items-center p-8 bg-[#050d1f] bg-opacity-80 backdrop-blur rounded-lg">
                <h1 className="text-xl sm:text-3xl font-light text-cyan-300 mb-2">Login</h1>
                <span className="w-3/4 sm:w-1/2 h-[1px] bg-gradient-to-r from-gray-900 via-cyan-300 to-gray-900 "></span>
                <br />
                <form className="flex flex-col justify-between items-center" onSubmit={(e) => handleLogin(e)}>
                    <input required type="text" placeholder="Your Roll" className="bg-transparent p-2 focus:outline-none border-b border-cyan-300 " onChange={(e) => setUserId(e.target.value)}/>
                     <br />
                    <input required type="password" placeholder="Your Password" className="bg-transparent p-2 focus:outline-none border-b border-cyan-300 text-cyan-300" onChange={(e) => setPassword(e.target.value)}/>

                     <br />
                    {
                      /**
                       * <div className="w-full flex items-center">

                    <input type="checkbox" className="appearance-none p-[7px] bg-gray-500 rounded checked:bg-cyan-300 checked:border-white mr-2 cursor-pointer"/>
                    <span className="text-xs">Remember me</span>
                    </div>
                       */
                    }
                     <br />
                    <input type="submit" value="Login" className="bg-cyan-300 bg-opacity-20 hover:bg-opacity-80 px-4 py-2 rounded backdrop-blur uppercase cursor-pointer"/>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </form>
              <br />
              
          </div>

  );
}
