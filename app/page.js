"use client";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import style
import ThemeToogle from "./components/ThemeToogle";
import LoadingOverlay from "./components/LoadingOverlay.js";

export default function Home() {
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading
  const [excelUrl, setExcelUrl] = useState(null); // State for URL file Excel
  const [sessionId, setSessionId] = useState(null); // State for session ID
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [listHistory, setHistory] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // State to manage clicked item

  // Function to save input value to localStorage
  const saveInputToLocalStorage = (newInput) => {
    let storedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    // Add new input at the beginning of the array
    storedHistory.unshift(newInput);

    // Keep only the latest 10 entries
    if (storedHistory.length > 10) {
      storedHistory = storedHistory.slice(0, 10);
    }

    // Update local storage
    localStorage.setItem("history", JSON.stringify(storedHistory));
    setHistory(storedHistory); // Update history state
  };

  // Fungsi untuk mengatur tinggi textarea secara otomatis
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height dulu
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height berdasarkan content
    }
  };

  // Function to handle the history item click
  const handleHistoryClick = (history, index) => {
    setInputValue(history);
    setActiveIndex(index === activeIndex ? null : index); // Toggle active index
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputValue(text);
  };

  // Generate session ID if it doesn't exist
  useEffect(() => {
    const existingSessionId = localStorage.getItem("session_id");
    if (!existingSessionId) {
      const newSessionId = generateSessionId();
      console.log("Generated Session ID:", newSessionId);
      localStorage.setItem("session_id", newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(existingSessionId);
    }
  }, []);

  // function to generate a UUID for a session
  const generateSessionId = () => {
    return (
      "file-excel-" +
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
  };

  // Function to generate UUID with excel-file-format (10 random numbers)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = event.target.input.value;

    // Clear previous error and results
    setNaturalLanguage("");
    setTableData([]);

    // Set loading to true when the request starts
    setLoading(true);

    // Save input to local storage
    saveInputToLocalStorage(question);

    try {
      // POST request to your API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const responseData = await res.json();

      if (responseData.status_code !== 200) {
        setNaturalLanguage(responseData.message.replace("400 Bad Request: ", ""));
        // Show toast for error
        toast.error(`${responseData.message.replace("400 Bad Request: ", "")}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        if (responseData.data) {
          setNaturalLanguage(responseData.data.natural_language);
          setTableData(responseData.data.table_show_web.slice(0, 6)); // Limit to 5 rows
          setExcelUrl(`${process.env.NEXT_PUBLIC_API_URL}${responseData.data.table_excel}`);
        }
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      // Set loading to false when the request ends
      setLoading(false);
    }
  };

  // Define handleDownload outside the try block
  const handleDownload = () => {
    if (excelUrl) {
      window.open(excelUrl, "_blank");
    }
  };
  const formatNaturalLanguage = (text) => {
    // First split the text by new lines, then clean and format it
    const cleanedText = text
      .split("\n") // Split by new lines to handle each paragraph separately
      .map(
        (line) =>
          line
            .replace(/\*\*/g, "") // Remove all ** from the text
            .replace(/(\d+)\.\s/g, "<strong>$1.</strong> ") // Add numbering with bold
      )
      .map((formattedLine, index) => (
        // Return each line wrapped in <p> with mb-4 for gap between paragraphs
        <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      ));

    return <div>{cleanedText}</div>;
  };

  // Panggil saat komponen pertama kali dirender dan setiap kali input berubah
  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  }, [inputValue]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] w-[100vw] flex">
      {loading && <LoadingOverlay />}
      {/* Sidebar */}
      <div
        className={`h-screen  dark:bg-gray-900 bg-gray-100 dark:text-white text-sm px-5 p-8 py-12 fixed text-slate-900 flex flex-col gap-3 z-30 transition-transform duration-500 ease-in-out transform border-r-2 dark:border-slate-800 border-slate-200
    ${sidebarVisible ? "block" : "hidden"} lg:block lg:w-[20%] md:w-[40%] w-[60%] rounded-lg `}
      >
        <div className="flex justify-between items-center mb-9">
          <h2 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">
            History
          </h2>
          {/* button x to hide sidebar */}
          <button
            className="sm:block lg:hidden hover:bg-slate-400 dark:text-white font-bold bg-slate-500 text-white dark:bg-slate-800 hover:dark:bg-slate-700 px-4 py-2 absolute right-4 rounded-lg "
            onClick={() => setSidebarVisible(false)}
          >
            x
          </button>
        </div>
        <p className="text-xs md:text-sm text-left relative bottom-2 mb-3 ">
          Riwayat prompt hanya tersimpan di perangkat ini.
        </p>

        {/* list content to storage user prompt using local storage */}
        <ul className="flex flex-col justify-start gap-5 md:text-[12px] text-xs relative overflow-x-hidden overflow-auto h-[85%]">
          {listHistory.map((historyItem, index) => (
            <li
              key={index}
              className={`relative cursor-pointer bg-slate-200 dark:bg-slate-800 rounded-md shadow-sm p-4 
            transition-all duration-400 ease-in-out hover:shadow-lg
            ${activeIndex === index ? "bg-slate-300 dark:bg-slate-700 shadow-lg" : ""} 
            md:hover:bg-slate-300 md:dark:hover:bg-slate-700 md:hover:shadow-lg`}
              onClick={() => handleHistoryClick(historyItem, index)}
              onMouseEnter={() => {
                if (window.innerWidth >= 768) setActiveIndex(index); // Hanya aktif hover di layar md ke atas
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 768) setActiveIndex(null); // Hapus aktif saat hover keluar di layar md ke atas
              }}
            >
              <p
                className={`content transition-all duration-400 ease-in-out text-[13px]
              ${
                activeIndex === index
                  ? "whitespace-normal text-slate-900 dark:text-white"
                  : "whitespace-nowrap overflow-hidden text-ellipsis text-slate-600 dark:text-white"
              }
              ${activeIndex === index ? "sm:whitespace-normal" : "sm:whitespace-nowrap"} 
              md:${activeIndex === index ? "whitespace-normal" : "hover:whitespace-normal"}`}
              >
                {historyItem}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Content area */}
      <div
        className={`${
          sidebarVisible ? "ml-[20%] w-[80%] " : "w-full"
        } flex flex-col justify-center py-6 px-2 md:px-8 xl:px-32 relative lg:ml-[20%] lg:w-[80%] transition-all duration-500 ease-in-out transform`}
      >
        {/* alert */}
        <ToastContainer />

        {/* button sidebar to see history */}
        <div className="w-full flex p-4 flex-col gap-5 relative">
          <div className="flex justify-center items-center relative mb-6  w-full h-10">
            {!sidebarVisible && (
              <button
                className="sm:flex lg:hidden  md:text-xs text-[10px] px-4 py-3 md:px-5 md:py-3 bg-blue-700 hover:bg-blue-800  text-white rounded-full absolute left-0 justify-center items-center font-semibold "
                onClick={() => setSidebarVisible(true)}
              >
                Lihat History
              </button>
            )}

            {/* button dark mode */}
            <ThemeToogle />
          </div>

          {/* prompt area */}
          <h1 className="text-xl text-slate-900 font-semibold dark:text-slate-50">
            Masukkan Prompt Anda
          </h1>

          {/* form */}
          <form onSubmit={handleSubmit}>
            <div
              className={`flex w-full flex-col relative items-end bg-gray-50 rounded-lg
          ${
            isFocused ? "border-blue-700 dark:border-blue-800 ring-1" : "border-gray-300"
          } border dark:bg-gray-900 dark:border-gray-600`}
            >
              <textarea
                ref={textareaRef}
                id="input"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="max-h-[120px] md:max-h-[140px] w-full px-5 py-5 pb-5 text-gray-900 rounded-lg bg-gray-50  dark:placeholder-gray-400 dark:bg-gray-900 dark:text-white resize-none overflow-y-auto text-sm md:text-base focus:outline-none"
                placeholder='contoh: "tampilkan 20 data kapal dari pelabuhan XY"'
                required
                rows={1}
              />
              <div className="flex gap-3 p-3 pt-2 pb-4">
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="text-xs px-5 py-[16px] md:px-6 md:text-sm  text-slate-50 dark:bg-slate-700 dark:hover:bg-slate-800 bg-slate-500 rounded-full hover:bg-slate-400 font-medium"
                  >
                    clear
                  </button>
                )}
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-semibold rounded-full text-xs px-5 py-[16px] md:px-6 md:text-sm dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* natural language display */}
        <div className="w-full p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4 dark:text-slate-50">Jawaban :</h2>
          <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-900 dark:text-slate-50 text-sm max-h-[60vh] overflow-y-auto">
            {naturalLanguage && formatNaturalLanguage(naturalLanguage)}
          </div>
        </div>

        {/* table display */}
        <div className="flex flex-col w-full px-4 relative my-10">
          {tableData.length > 0 && (
            <button
              className="flex gap-2 items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-3 font-semibold rounded-lg mb-6 self-end md:scale-100 text-sm"
              onClick={handleDownload}
            >
              <span>Download Excel</span>
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M22.8108 11.7065C22.2632 11.7065 21.538 11.6944 20.635 11.6944C18.4328 11.6944 16.622 9.87157 16.622 7.64857V3.74831C16.622 3.44148 16.3759 3.19165 16.0721 3.19165H9.65885C6.66536 3.19165 4.24463 5.64871 4.24463 8.66001V21.7276C4.24463 24.8868 6.78063 27.447 9.90861 27.447H19.4594C22.4433 27.447 24.8616 25.0057 24.8616 21.9919V12.2522C24.8616 11.9442 24.6167 11.6956 24.3117 11.6968C23.799 11.7004 23.1842 11.7065 22.8108 11.7065"
                  fill="white"
                />
                <path
                  opacity="0.4"
                  d="M19.5065 3.87975C19.1439 3.50258 18.5109 3.76211 18.5109 4.28481V7.48287C18.5109 8.82419 19.6145 9.92781 20.9558 9.92781C21.8023 9.93751 22.9763 9.93994 23.9732 9.93751C24.4837 9.9363 24.7433 9.32628 24.3891 8.9576C23.1097 7.62719 20.8188 5.2429 19.5065 3.87975"
                  fill="white"
                />
                <path
                  d="M18.3191 16.1789C17.965 15.8284 17.395 15.826 17.0408 16.1813L15.1137 18.1181V12.2641C15.1137 11.7657 14.7087 11.3606 14.2102 11.3606C13.7118 11.3606 13.3067 11.7657 13.3067 12.2641V18.1181L11.3784 16.1813C11.0255 15.826 10.4543 15.8284 10.1014 16.1789C9.74725 16.5306 9.74725 17.1018 10.0977 17.456L13.5699 20.9439H13.5711C13.6536 21.0263 13.7518 21.093 13.8622 21.1391C13.9713 21.184 14.0902 21.2083 14.2102 21.2083C14.3315 21.2083 14.4504 21.184 14.5595 21.1379C14.6674 21.093 14.7657 21.0263 14.8481 20.9451L14.8506 20.9439L18.3215 17.456C18.6732 17.1018 18.6732 16.5306 18.3191 16.1789"
                  fill="white"
                />
              </svg>
            </button>
          )}

          <h2 className="text-lg font-semibold dark:text-slate-50 mb-4">Preview Tabel Data:</h2>
          <div className="overflow-x-auto pb-2 px-0 border-slate-400 rounded-sm">
            <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 p-12 dark:text-slate-50 dark:bg-gray-900 rounded-md">
              <thead>
                <tr>
                  {tableData.length > 0 &&
                    Object.keys(tableData[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-xs md:text-sm lg:text-base bg-gray-100 dark:bg-gray-800"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 &&
                  tableData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td
                          key={idx}
                          className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs lg:text-sm"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}

                {tableData.length > 5 && (
                  <tr>
                    {Object.keys(tableData[0]).map((key, idx) => (
                      <td
                        key={idx}
                        className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-xs lg:text-sm text-start"
                      >
                        ...
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
