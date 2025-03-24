import viteLogo from "/vite.svg";
import "./App.css";

function ChatMessage({ chat }) {
  return (
    <div className={`message ${chat.role === "model" ? "bot" : "user"}-message`}>
      {chat.role === "model" && <img src={viteLogo} alt="Bot" />}
      <div className="message-text">
        {chat.parts.map((part, index) =>
          part.text ? (
            <p key={index}>{part.text}</p>
          ) : part.inlineData ? (
            <img
              key={index}
              src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
              alt="Generated content"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default ChatMessage;