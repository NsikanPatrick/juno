// import { useRef, useState } from "react";
// import { FaFileArrowUp } from "react-icons/fa6";
// import { FaTelegram } from "react-icons/fa6";

// function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
//   const inputRef = useRef();
//   const fileRef = useRef();
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userMessage = inputRef.current.value.trim();
//     if (!userMessage && !file) return;

//     inputRef.current.value = "";

//     // Prepare the user's message
//     const userMessageData = { role: "user", parts: [{ text: userMessage }] };

//     // If a file is uploaded, read it and convert it to base64
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Data = reader.result.split(",")[1];
//         userMessageData.parts.push({
//           inlineData: {
//             mimeType: file.type,
//             data: base64Data,
//           },
//         });

//         // Update chat history with the user's message (text + file)
//         setChatHistory((history) => [...history, userMessageData]);

//         // Add a "Thinking..." placeholder for the bot's message
//         setTimeout(() => {
//           setChatHistory((history) => [
//             ...history,
//             { role: "model", parts: [{ text: "Thinking..." }] },
//           ]);

//           // Call the function to generate the bot's response
//           generateBotResponse([...chatHistory, userMessageData]);
//         }, 600);
//       };
//       reader.readAsDataURL(file);
//       setFile(null); // Reset the file input
//     } else {
//       // If no file is uploaded, just send the text message
//       setChatHistory((history) => [...history, userMessageData]);

//       // Add a "Thinking..." placeholder for the bot's message
//       setTimeout(() => {
//         setChatHistory((history) => [
//           ...history,
//           { role: "model", parts: [{ text: "Thinking..." }] },
//         ]);

//         // Call the function to generate the bot's response
//         generateBotResponse([...chatHistory, userMessageData]);
//       }, 600);
//     }
//   };

//   return (
//     <div>
//       <form action="#" className="chat-form" onSubmit={handleSubmit}>
//         <input
//           ref={inputRef}
//           type="text"
//           className="message-input"
//           placeholder="Your message..."
//         />
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*, application/pdf"
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />
//         {/* <FaFileArrowUp onClick={() => fileRef.current.click()} /> */}
//         <button
//           type="button"
//           onClick={() => fileRef.current.click()}
//           className="material-symbols-rounded"
//         >
//           <FaFileArrowUp />
//         </button>

//         <button type="submit" className="material-symbols-rounded">
//           <FaTelegram />
//         </button>
//         {/* <FaTelegram type="submit" /> */}
//       </form>
//     </div>
//   );
// }

// export default ChatForm;

import { useRef, useState } from "react";
import { FaFileArrowUp, FaTelegram } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa"; // Import icons
import "../App.css";

function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
  const inputRef = useRef();
  const fileRef = useRef();
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Create a preview URL
    }
  };

  // Remove the uploaded file and preview
  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
    fileRef.current.value = ""; // Clear the file input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();

    // If no file and no message, do nothing
    if (!file && !userMessage) return;

    inputRef.current.value = "";

    // Prepare the user's message
    const userMessageData = { role: "user", parts: [] };

    // Add text part if provided
    if (userMessage) {
      userMessageData.parts.push({ text: userMessage });
    }

    // Add image part if provided
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        userMessageData.parts.push({
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        });

        // Update chat history with the user's message (text + file)
        setChatHistory((history) => [...history, userMessageData]);

        // Add a "Thinking..." placeholder for the bot's message
        setTimeout(() => {
          setChatHistory((history) => [
            ...history,
            { role: "model", parts: [{ text: "Thinking..." }] },
          ]);

          // Call the function to generate the bot's response
          generateBotResponse([...chatHistory, userMessageData]);
        }, 600);

        // Clear the file and preview after submission
        handleRemoveFile();
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is uploaded, just send the text message
      setChatHistory((history) => [...history, userMessageData]);

      // Add a "Thinking..." placeholder for the bot's message
      setTimeout(() => {
        setChatHistory((history) => [
          ...history,
          { role: "model", parts: [{ text: "Thinking..." }] },
        ]);

        // Call the function to generate the bot's response
        generateBotResponse([...chatHistory, userMessageData]);
      }, 600);
    }
  };

  return (
    <div>
      <form action="#" className="chat-form" onSubmit={handleSubmit}>
        {/* Image Preview (Thumbnail) */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" className="thumbnail" />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="remove-image-button"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Your message..."
        />

        {/* File Input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className=""
        >
          <FaFileArrowUp />
        </button>

        {/* Submit Button */}
        <button type="submit" className="">
          <FaTelegram />
        </button>
      </form>
    </div>
  );
}

export default ChatForm;
