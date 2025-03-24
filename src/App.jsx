import { useState, useRef, useEffect } from 'react';
import viteLogo from "/vite.svg";
import ChatForm from './Components/ChatForm';
import ChatMessage from './Components/ChatMessage';
import { companyInfo } from './CompanyInfo';
import { FaChevronDown } from "react-icons/fa6";
import { BsChatRightText } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import "./App.css";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", message: companyInfo, welcome: "Hey there How may I help you today?" }
  ]);

  // Making the chatbody section to auto-scroll when a new message arrives
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {
    const formattedHistory = history.map(({ role, message }) => ({
      role,
      parts: [{ text: message }],
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      // Make Api call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error?.message || "Something went wrong with the API request.");
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        const botResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        setChatHistory(prevHistory => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1].message = botResponse;
          return newHistory;
        });
      } else {
        console.error("Unexpected API response format:", data);
        setChatHistory(prevHistory => {
          const newHistory = [...prevHistory];
          newHistory[newHistory.length - 1].message = "Sorry, I can't generate a response.";
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].message = "Sorry, there was an error processing your request.";
        return newHistory;
      });
    }
  };

  useEffect(() => {
    // Auto scroll whenever chat history updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth" })
  }, [chatHistory])

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button id="chatbot-toggler" onClick={() => setShowChatbot(prev => !prev)}>
        <BsChatRightText className="icon" />
        <IoCloseOutline className="icon" />
      
      </button>

      <div className="chatbot-popup">
      <div className="chat-header">
          <img src={viteLogo} alt="Logo" />
          <div className="header-info">
            <h2 className="logo-text">Juno</h2>
            <h3 className="logo-text">(Ecom Conversational AI)</h3>
          </div>
          <FaChevronDown className="header-btn" style={{ color: "#fff" }}  onClick={() => setShowChatbot((prev) => !prev)} />
        </div>

        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
}

export default App;