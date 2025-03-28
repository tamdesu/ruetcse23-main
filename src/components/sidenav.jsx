import "@/app/globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faBook,
  faLaptop,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function SideNav({ width, margin }) {
  return (
    <div
      className={`w-${width} max-w-[350px] h-full rounded-lg bg-[#111] fixed top-0 left-0 z-[9990] text-white backdrop-blur overflow-x-hidden pt-[30px] px-4 ${margin} duration-300`}
    >
      <span>
        <span className="text-cyan-500 font-normal">{"</>"}</span> RUET CSE •{" "}
        <span className="text-cyan-300">23</span>
      </span>
      <br />
      <br />
      <br />
      <ul className="text-xl font-extralight uppercase">
        <li>
          <Link
            href="/"
            className="mb-4 bg-[#161616] p-4 rounded-lg flex items-center hover:bg-cyan-400 duration-200"
          >
            <span>
              <FontAwesomeIcon icon={faHouse} className="mr-4" />
            </span>
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/students"
            className="mb-4 bg-[#161616] p-4 rounded-lg flex items-center hover:bg-cyan-400 duration-200"
          >
            <span>
              <FontAwesomeIcon icon={faUser} className="mr-4" />
            </span>
            Students
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className="mb-4 bg-[#161616] p-4 rounded-lg flex items-center hover:bg-cyan-400 duration-200"
          >
            <span>
              <FontAwesomeIcon icon={faLaptop} className="mr-4" />
            </span>
            Projects
          </Link>
        </li>
        <li>
          <Link
            href="/resources"
            className="mb-4 bg-[#161616] p-4 rounded-lg flex items-center hover:bg-cyan-400 duration-200"
          >
            <span>
              <FontAwesomeIcon icon={faBook} className="mr-4" />
            </span>
            Resources
          </Link>
        </li>
      </ul>
    </div>
  );
}
