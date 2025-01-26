"use client";
import React, { useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true); // Use parentheses here

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="absolute right-0 w-16 h-8 flex items-center bg-blue-600 dark:bg-gray-800 cursor-pointer rounded-full p-1 scale-90 md:scale-100"
      onClick={() => setDarkMode(!darkMode)}
    >
      {/* Icon Moon */}
      <FaMoon className="text-white" size={16} />

      {/* Toggle Button */}
      <div
        className={`absolute bg-white dark:bg-slate-100 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          darkMode ? "translate-x-0" : "translate-x-8"
        }`}
      ></div>

      {/* Icon Sun */}
      <BsSunFill className="ml-auto text-yellow-400" size={16} />
    </div>
  );
};

export default ThemeToggle;
