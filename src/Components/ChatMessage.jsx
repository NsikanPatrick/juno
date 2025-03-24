import viteLogo from "/vite.svg";
import "../App.css";
function ChatMessage({chat}){
    return (
        !chat.hideInChat ? (
          <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
            {chat.role === "model" && <img src={viteLogo} />}
            <p className="message-text">
              {chat.message}
            </p>
          </div>
        ) : (<div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
          {chat.role === "model" && <img src={viteLogo} />}
          <p className="message-text">
            {chat.welcome}
          </p>
        </div>)
    )
}

export default ChatMessage;