"use client"
import { useState, useEffect } from "react";

import FeaturedLink from "./featuredLink";

export default function Featured() {
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object
    // Ensure the date is valid
    if (isNaN(date)) {
      throw new Error("Invalid date");
    }
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const formatDescription = (description) => {
    // Convert new lines (\n) to <br />
    let formattedText = description.replace(/\n/g, "<br />");
    // Convert *text* to italic (wrap with <i>)
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<i>$1</i>");
    // Convert **text** to bold (wrap with <b>)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    // Convert URLs to clickable links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a class="text-cyan-500" href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    return formattedText;
  }
  // Fetch projects data
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/posts?userId=all&type=projects"); // Adjust API endpoint if necessary
        const res2 = await fetch("/api/posts?userId=all&type=resources"); // Adjust API endpoint if necessary
        const data = await res.json();
        const data2 = await res2.json();

        if (!res.ok && !res2.ok) {
          throw new Error("Failed to fetch projects/resources");
        }
        setProjects(data);
        setResources(data2);
      }
      catch (error) {
        console.error("Error fetching projects/resources:", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [])
  return (
    <div className="w-screen h-auto flex flex-col justify-center items-center p-8 bg-[#050d1f] bg-opacity-80 backdrop-blur">
      <h1 className="text-3xl sm:text-5xl font-thin tracking-widest text-cyan-300">
        F E A T U R E D
      </h1>
      <br />
      <span className="w-3/4 sm:w-1/2 p-px bg-gradient-to-r from-gray-900 via-cyan-300 to-gray-900"></span>
      <br />
      <br />

      {/* Centered Grid */}
      <div className="w-full h-auto flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-40">
          
          {/* Left Column */}
          {
            projects.slice(0,2).map((project, index) => {
              return (
                <FeaturedLink
                  key={index}
                  title={"Projects"}
                  description={project.description}
                  date={formattedDate(project.date)}

                />
              )
            })
          }
          {/* Right Column */}
          {
            resources.slice(0,2).map((resource, index) => {
              return (
                <FeaturedLink
                  key={index}
                  title={"Resources"}
                  description={resource.description}
                  date={formattedDate(resource.date)}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  );
}
