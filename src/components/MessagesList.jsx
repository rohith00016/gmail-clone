/* eslint-disable react/prop-types */
import { useState } from "react";

const MessagesList = ({ messages, handleSelectMessage, handleCompose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of messages per page

  const getHeader = (headers, name) => {
    const header = headers.find((header) => header.name === name);
    return header ? header.value : "Unknown";
  };

  const indexOfLastMessage = currentPage * itemsPerPage;
  const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(messages.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={handleCompose}
        >
          + Compose
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {currentMessages.length > 0 ? (
          currentMessages.map((message, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => handleSelectMessage(message)}
            >
              <p className="text-gray-800 font-medium truncate">
                <span className="text-gray-600">Subject:</span>{" "}
                {getHeader(message.payload.headers, "Subject")}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-gray-600">From:</span>{" "}
                {getHeader(message.payload.headers, "From")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
          >
            ← Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
