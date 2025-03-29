"use client";
import { useState, useEffect } from "react";
import Glitch from "@/components/glitch";
import Link from "next/link";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);

  const formattedDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object
  
    // Ensure the date is valid
    if (isNaN(date)) {
      throw new Error("Invalid date");
    }
  
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  const formatDescription = (description) => {
    // Convert new lines (\n) to <br />
    let formattedText = description.replace(/\n/g, " <br />");
  
    // Convert *text* to italic (wrap with <i>)
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");
  
    // Convert **text** to bold (wrap with <b>)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  
    // Convert URLs to clickable links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a class="text-cyan-400 hover:underline" href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    return formattedText;
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/posts?userId=all&type=resources");
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch resources");
        }
        setProjects(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
    if(typeof window !== "undefined"){
      async function fetchUser() {
        try {
          const userId = localStorage.getItem("userId");
          const res = await fetch(`/api/user?userId=${userId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await res.json();
          setUser(data);
        }
        catch (error) {
          console.error("Error fetching user:", error); 
        }
      }
    }
  }, []);

  const handleAddProject = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTitle("");
    setDescription("");
  };
  const handleSubmitProject = ()=>{
    if(!title || !description){
      alert("Please fill in all fields");
      return;
    }
    if(typeof window !== "undefined"){
      const newProject = {
        title,
        description,
        type: "resources",
        userId: localStorage.getItem("userId"),
        date: new Date().toISOString()
      }
      fetch("/api/posts",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProject)
      })
      .then((res)=>res.json())
      .then((data)=>{
        if(data.success){
          setProjects([data.project, ...projects]);
          handleCloseModal();
        }
      })
    }

  }

  return (
    <>
      <Glitch />
      <div className="app-div bg-opacity-50 fixed top-0 left-0 bg-black w-screen h-screen overflow-y-scroll overflow-x-hidden">
        <br /><br />
        <div className="flex flex-col items-center justify-center text-white p-6 space-y-6">
          <div className="w-full mt-8 flex justify-between items-center max-w-[800px]">
            <h2 className="text-3xl font-bold text-white">All Resources</h2>
            {
              user && user.userId === localStorage.getItem("userId") && (
                <button
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-md transition"
                onClick={handleAddProject}
              >
                Add Resource +
              </button> 
              )
            }
          </div>
          {loading ? (
            <p className="text-center text-white">Loading Resources...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-400">No Resources available.</p>
          ) : (
            <div className="w-full flex flex-col gap-6 items-center">
              {projects.map((project) => (
                <div
                key={project._id}
                className="w-full max-w-[800px] bg-gray-800 p-6 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Post Header */}
                <div className="flex items-center mb-4">
                  <img
                    src={project.user.image}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <Link href={`/profile/${project.user.userId}`}><h3 className="text-xl text-white font-bold">{project.user.name}</h3></Link>
                    <p className="text-gray-400 text-sm">{formattedDate(project.date)}</p>
                  </div>
                </div>

                {/* Post Content */}
                <h3 className="text-2xl text-white font-semibold mb-2">{project.title}</h3>
                <p
            className="text-gray-300 mt-4"
            dangerouslySetInnerHTML={{
              __html: project.description.length ? formatDescription(project.description) : "No Description"
            }}
          />
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 p-6 rounded-md w-[400px]">
            <h2 className="text-xl font-bold text-white mb-4">Add Resource</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-3 border border-gray-600 rounded bg-gray-700 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded" onClick={()=> handleSubmitProject()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}