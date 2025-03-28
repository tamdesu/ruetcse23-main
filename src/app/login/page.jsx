import styles from "@/app/globals.css";
import Glitch from "@/components/glitch";
import Empty from "@/components/empty";

import LoginModal from "@/components/loginModal";

export default function Home() {
  return (
    <>

      <Glitch />
      <div className="app-div bg-opacity-50 fixed top-0 left-0 bg-black w-screen h-screen overflow-y-scroll overflow-x-hidden flex justify-center items-center">

        <LoginModal />
      </div>
    </>

  );
}
