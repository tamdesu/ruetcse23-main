"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Glitch from "@/components/glitch";

export default function Profile() {
  const { roll } = useParams();
  const [isOwner, setIsOwner] = useState(false); // Dynamically set based on auth
  const [userData, setUserData] = useState(null);
  const [description, setDescription] = useState("This is my profile description.");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");

  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading , setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      '<a class="text-cyan-500" href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    return formattedText;
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return;
    setUploading(true);
  
    // Convert image file to Base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Get the Base64 string part
  
      const formData = {
        userId: roll, // Pass userId as well
        image: base64Image, // Base64 encoded image string
      };
  
      try {
        const res = await fetch(`/api/upload?userId=${roll}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Send JSON
          },
          body: JSON.stringify(formData),
        });
  
        if (!res.ok) throw new Error("Image upload failed");
  
        const result = await res.json();
        setUserData(prev => ({ ...prev, image: result.imageUrl })); // Update profile pic
        fileInputRef.current.value = null; // Optionally reset the file input
        window.location.reload();
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    };
  };
  // Fetch user data and posts from API
  useEffect(() => {

    async function fetchUserData() {
      try {
        const res = await fetch(`/api/user?userId=${roll}`);
        const data = await res.json();
        

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        setUserData(data); // Set user data

        // Set description based on the user data
        setDescription(data.description || "No description...");

        // Fetch posts associated with this user
        const postsRes = await fetch(`/api/posts?userId=${roll}`);
        const postsData = await postsRes.json();


        if (!postsRes.ok) {
          throw new Error("Failed to fetch posts");
        }


        // Filter posts into categories
        setResources(postsData.filter(post => post.type === "resources"));
        setProjects(postsData.filter(post => post.type === "projects"));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
    // Check if the user is the owner
    if (roll === localStorage.getItem("userId")) {
      setIsOwner(true); 
    }
  }, [roll]);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/user?userId=${roll}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      setIsEditing(false);

      // Handle success (e.g., show a success message)
      alert(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-6">Loading...</p>;
  }

  return (
    <>
      <Glitch />
      <div className="app-div bg-opacity-50 fixed top-0 left-0 bg-black w-screen h-screen overflow-y-scroll overflow-x-hidden flex justify-center">
        {userData ? 
        <div className="profile-container w-full max-w-4xl max-h-[700px] mt-16 p-6 bg-opacity-90 bg-gray-900 rounded-lg shadow-lg overflow-y-scroll">
        {/* Profile Header */}
        <div className="flex items-center">
          {/* Profile Picture */}
          <div className="relative flex flex-col gap-2 items-center">
            <img
              src={userData.image || "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="}
              alt="Profile Picture"
              width="100"
              height="100"
              style={{
                borderRadius: "100%",
                border: "2px solid #333",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                objectFit: "cover",
                objectPosition: "top",
                maxHeight: "100px",
                maxWidth: "100px",
              }}
            />
            {isOwner && (
                <div>
                    <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button className="mt-2 text-xs text-cyan-400 underline bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg" onClick={() => fileInputRef.current.click()}>
                {uploading ? "Uploading" : "Change PFP"}
              </button>
                </div>
            )}
          </div>

          {/* Profile Stats */}
          <div className="ml-6 flex-1 grid grid-cols-3 text-center">
            <div>
              <p className="text-xl text-white font-bold">{resources.length}</p>
              <p className="text-gray-400">Resources</p>
            </div>
            <div>
              <p className="text-xl text-white font-bold">{projects.length}</p>
              <p className="text-gray-400">Projects</p>
            </div>
            <div>
              <p className="text-xl text-white font-bold">CSE</p>
              <p className="text-gray-400">Department</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <h3 className="text-white text-2xl">{userData.name}</h3>
          <br />
          <p className="text-gray-400">Description</p>
          {isEditing ? (
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
              <p
              className="text-gray-300 mt-4"
              dangerouslySetInnerHTML={{
                __html: description.length ? formatDescription(description) : "No Description"
              }}
            />
            
          )}
          {isOwner && (
            <button
            className="mt-2 text-sm text-blue-400 underline"
            onClick={() => {
              if (isEditing) {
              handleSubmit(); // Save on "Save" click
              } else {
                setIsEditing(true); // Switch to editing mode
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
              
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex border-b border-gray-700">
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "resources" ? "border-b-2 border-blue-400 text-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "projects" ? "border-b-2 border-blue-400 text-blue-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
        </div>

        {/* Content Section */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${activeTab === "resources" ? "0%" : "-100%"})`,
            }}
          >
            {/* Resources Section */}
            <div className="w-full flex-shrink-0">
              {resources.length === 0 ? (
                <p className="text-gray-400 text-center mt-4">No resources found.</p>
              ) : (
                resources.map((post) => (
                  <div key={post._id} className="bg-gray-800 p-4 rounded-md mt-3">
                    <p className="text-white font-bold">{post.title}</p>
                    <p className="text-gray-500 text-sm">{formattedDate(post.date)}</p>
                    <p
              className="text-gray-300 mt-4"
              dangerouslySetInnerHTML={{
                __html: post.description.length ? formatDescription(post.description) : "No Description"
              }}
            />
                  </div>
                ))
              )}
            </div>

            {/* Projects Section */}
            <div className="w-full flex-shrink-0">
              {projects.length === 0 ? (
                <p className="text-gray-400 text-center mt-4">No projects found.</p>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="bg-gray-800 p-4 rounded-md mt-3">
                    <p className="text-white font-bold">{project.title}</p>
                    <p className="text-gray-500 text-sm">{formattedDate(project.date)}</p>
                    <p
              className="text-gray-300 mt-4"
              dangerouslySetInnerHTML={{
                __html: project.description.length ? formatDescription(project.description) : "No Description"
              }}
            />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div> :
      <p className="text-white text-center mt-20">No student found...</p>}
      </div>
    </>
  );
}
