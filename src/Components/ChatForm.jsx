import { useRef } from "react";
import { FaTelegram } from "react-icons/fa6";
function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // Updating chat's history with User's message
    setChatHistory((history) => [
      ...history,
      { role: "user", message: userMessage },
    ]);

    // Add a "Thinking..." placeholder for the bot's message
    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", message: "Thinking..." },
      ]);
      // Calling the fxn to generate bot's response
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          message: `using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };
  return (
    <div>
      <form action="#" className="chat-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Your message..."
          required
        />
        <button className="material-symbols-rounded">
        <FaTelegram />
        </button>
      </form>
    </div>
  );
}

export default ChatForm;
