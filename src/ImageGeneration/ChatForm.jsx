import { useRef } from "react";
import { FaTelegram } from "react-icons/fa6";
import "./App.css";

function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Prepare the user's message
    const userMessageData = { role: "user", parts: [{ text: userMessage }] };

    // Update chat history with the user's message
    setChatHistory((history) => [...history, userMessageData]);

    // Add a "Generating..." placeholder for the bot's message
    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", parts: [{ text: "Generating image..." }] },
      ]);

      // Call the function to generate the bot's response
      generateBotResponse([...chatHistory, userMessageData]);
    }, 600);
  };

  return (
    <div>
      <form action="#" className="chat-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Describe the image you want..."
          required
        />
        <button type="submit" className="">
          <FaTelegram />
        </button>
      </form>
    </div>
  );
}

export default ChatForm;