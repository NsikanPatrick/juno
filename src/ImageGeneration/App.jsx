import { useState, useRef, useEffect } from "react";
import viteLogo from "/vite.svg";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { FaChevronDown } from "react-icons/fa6";
import { BsChatRightText } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import "./App.css";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "model", parts: [{ text: "Hello there! Describe an image you'd like me to generate." }] },
  ]);

  // Ref for auto-scrolling the chat body
  const chatBodyRef = useRef();

  // Function to generate the bot's response (image generation)
  const generateBotResponse = async (history) => {
    const formattedHistory = history.map(({ role, parts }) => ({
      role,
      parts: parts.map((part) => {
        if (part.text) {
          return { text: part.text };
        }
        return null;
      }).filter(Boolean), // Remove any null values
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedHistory,
        // Add image generation parameters if required by the API - Increase this size
        generationConfig: {
          imageWidth: 1024, // Example: Set image width
          imageHeight: 1024, // Example: Set image height
        },
      }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error?.message || "Something went wrong with the API request."
        );
      }

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const botResponse = data.candidates[0].content.parts[0].text;
        const generatedImage = data.candidates[0].content.parts[0].inlineData?.data; // Assuming the API returns image data

        setChatHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          if (generatedImage) {
            // Add the generated image to the chat history
            newHistory[newHistory.length - 1].parts = [
              { inlineData: { mimeType: "image/png", data: generatedImage } },
            ];
          } else {
            // Add the bot's text response
            newHistory[newHistory.length - 1].parts = [{ text: botResponse }];
          }
          return newHistory;
        });
      } else {
        console.error("Unexpected API response format:", data);
        setChatHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1].parts = [
            { text: "Sorry, I couldn't generate an image." },
          ];
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].parts = [
          { text: "Sorry, there was an error processing your request." },
        ];
        return newHistory;
      });
    }
  };

  // Auto-scroll the chat body when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      {/* Chatbot Toggler Button */}
      <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <BsChatRightText className="icon" />
        <IoCloseOutline className="icon" />
      </button>

      {/* Chatbot Popup */}
      <div className="chatbot-popup">
        <div className="chat-header">
          <img src={viteLogo} alt="Logo" />
          <div className="header-info">
            <h2 className="logo-text">Juno</h2>
            <h3 className="logo-text">(Image Generator)</h3>
          </div>
          <FaChevronDown className="header-btn" style={{ color: "#fff" }} onClick={() => setShowChatbot((prev) => !prev)} />
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default App;