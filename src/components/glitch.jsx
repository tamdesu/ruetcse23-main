import Image from "next/image";
import styles from "@/app/globals.css";

export default function Glitch() {
  return (
      <div className="flex justify-center items-center h-screen bg-black">

        <div className="relative w-full h-full overflow-hidden glitch-container">
          <img src="/background.jpg" alt="Glitch Image" className="glitch-img" />
          <span className="glitch-span"></span>
          <span className="glitch-span"></span>
        </div>
      </div>
  );
}
