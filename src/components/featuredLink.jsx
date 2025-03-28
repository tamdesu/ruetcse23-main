import Link from "next/link";

export default function FeaturedLink({ title, description, date }) {
  const datePart = date.split("/");

  return (
    <div className="w-[90%] sm:w-[350px] max-w-full h-[280px] sm:h-[300px] flex flex-col justify-between items-center p-[2px] bg-gradient-to-br from-cyan-300 via-gray-900 to-cyan-300 rounded-lg shadow-lg">
      <div className="w-full h-full flex flex-col justify-between p-4 bg-gray-900 rounded-lg">
        <div className="w-full flex flex-col">
          <h1 className="text-lg sm:text-2xl font-light text-cyan-300 uppercase">
            {title}
          </h1>
          <div className="w-2/3 sm:w-1/2 h-[2px] bg-gradient-to-r from-cyan-300 to-gray-900 mt-1"></div>
        </div>

        <div className="flex items-start">
          {/* Date Box */}
          <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] border-r-2 border-cyan-300 mr-3 flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-300">
              {datePart[0]}
            </h1>
            <span className="text-xs sm:text-sm font-bold text-gray-300">
              {datePart[1]}/{datePart[2]}
            </span>
          </div>

          {/* Description with word wrap*/}
          <p className="text-gray-300 text-sm sm:text-base font-light leading-snug break-all overflow-hidden text-ellipsis w-full">
  {description.length > 100
    ? `${description.substring(0, 100)}...`
    : description}
</p>
        </div>

        <div className="flex justify-end">
          <Link
            className="text-cyan-300 text-sm sm:text-base uppercase hover:text-cyan-400 transition"
            href={`/${title.toLowerCase()}`}
          >
            See All →
          </Link>
        </div>
      </div>
    </div>
  );
}
