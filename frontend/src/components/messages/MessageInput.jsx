import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useState } from "react";

function MessageInput({ replyMessage, clearReply }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    // Handle sending message and attachments
    await sendMessage({ message, attachments, replyTo: replyMessage });
    setMessage("");
    setAttachments([]);
    clearReply(); // Clear attachments after sending
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {replyMessage && ( // Display the reply message
        <div className="bg-gray-800 p-2 mb-2 rounded-md flex justify-between items-center">
          <div>
            {/* <span className="text-sm text-gray-400">Replying to:</span> */}
            {replyMessage.attachments &&
              replyMessage.attachments.length > 0 && (
                <div className="flex items-center gap-2">
                  {replyMessage.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="relative w-10 h-10 border rounded-md overflow-hidden flex-shrink-0"
                    >
                      {/\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(
                        attachment.url
                      ) && (
                        <img
                          src={attachment.url}
                          alt="attachment"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      {/\.pdf$/i.test(attachment.url) && (
                        <div
                          className="p-2 bg-gray-200 rounded-md text-black flex items-center gap-2 cursor-pointer"
                          onClick={() => window.open(attachment.url, "_blank")}
                        >
                          <span>
                            {attachment.originalName || "Unknown file"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 12.75H4.5m15 0l-6 6m6-6l-6-6"
                            />
                          </svg>
                        </div>
                      )}
                      {/\.(mp4|mov|avi|mkv|flv|wmv)$/i.test(attachment.url) && (
                        <video
                          src={attachment.url}
                          className="w-20 h-20 object-cover rounded-md"
                          controls
                        />
                      )}
                      {!/\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(
                        attachment.url
                      ) &&
                        !/\.pdf$/i.test(attachment.url) &&
                        !/\.(mp4|mov|avi|mkv|flv|wmv)$/i.test(
                          attachment.url
                        ) && (
                          <div
                            className="p-2 bg-gray-200 rounded-md text-black flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              window.open(attachment.url, "_blank")
                            }
                          >
                            <span>
                              {attachment.originalName || "Unknown file"}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25m0 0L19.5 9m-3.75-3.75L11.25 9m8.25 3v5.25M15.75 18.75V15M15.75 15h-6m0 0l4.5 3.75m-4.5-3.75l4.5-3.75"
                              />
                            </svg>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            <p className="text-white text-sm">{replyMessage.message}</p>
          </div>
          <button
            type="button"
            onClick={clearReply}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="relative w-full">
        <div className="flex items-center border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 text-white pr-20 overflow-x-auto gap-2">
          {/* Display Attachments */}
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative w-10 h-10 border rounded-md overflow-hidden flex-shrink-0"
            >
              {attachment.type.startsWith("image/") ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="w-full h-full object-cover"
                />
              ) : attachment.type === "application/pdf" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                  <span>{attachment.file.name}</span>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                  {attachment.file.name}
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Input Field */}
          <input
            type="text"
            className="flex-grow bg-transparent outline-none text-white"
            placeholder="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Attachment Icon */}
        <label className="absolute inset-y-0 right-12 flex items-center cursor-pointer text-gray-400 hover:text-white">
          📎
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>

        {/* Send Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-3 flex items-center text-blue-500 hover:text-blue-600"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <BsSend size={18} />
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
