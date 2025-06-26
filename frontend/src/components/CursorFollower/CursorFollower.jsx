import React, { useEffect } from "react";
import "./CursorFollower.css"; // Import the CSS file for styling


const CursorFollower = () => {
  useEffect(() => {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      //console.log(clientX, clientY); // Log the mouse coordinates to the console

      cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
      cursorOutline.animate({
        left: `${clientX}px`,
        top: `${clientY}px`,
      }, {
        duration: 500,
        fill: "forwards",
      })

    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>
    </>
  );
};

export default CursorFollower;