import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from "/vite.svg";
import ChatForm from './Components/ChatForm'
import ChatMessage from './Components/ChatMessage'
import "./App.css";

function App() {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async (history) => {
    // Formatting chat history for API requests
    history = history.map(({role, text}) => ({role, parts: [{text}]}));

    const requestOptions = {
      method: "POST",
      Headers: { "Content-Type": "application/json"},
      body:JSON.stringify({ contents: history})
    }

    try{
      // Making API call to get bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "somethong went wrong");

      console.log(data)
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chat Header */}
        <div className="chat-header">
          <img src={viteLogo} />
          <div className="header-info">
            <h2 className="logo-text">Juno</h2>
          </div>
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
        {/* Chat body */}
        <div className="chat-body">
          <div className="message bot-message">
            <img src={viteLogo} />
            <p className="message-text">
              Hey there <br /> How may I help you today?
            </p>
          </div>

          {/* Rendering chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
          
        </div>
        {/* Chat footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
}

export default App;
