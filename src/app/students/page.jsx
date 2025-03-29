"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Glitch from "@/components/glitch";
import Empty from "@/components/empty";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/user?userId=all");
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch students");

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <>
      <Glitch />
      <div className="app-div bg-opacity-50 fixed top-0 left-0 bg-black w-screen h-screen overflow-y-scroll overflow-x-hidden p-4">
        {loading ? (
          <p className="text-gray-400">Loading students...</p>
        ) : students.length === 0 ? (
          <Empty message="No students found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
            {students.map((student) => (
              <Link key={student._id} href={`/profile/${student.userId}`}>
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <Image
                    src={student.image || "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="}
                    alt={student.name}
                    width={200}
                    height={200}
                    className="rounded-lg mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
