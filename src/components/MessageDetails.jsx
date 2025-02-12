/* eslint-disable react/prop-types */
const MessageDetails = ({ selectedMessage, handleBackToMessages }) => {
  const getHeader = (headers, name) => {
    const header = headers.find((header) => header.name === name);
    return header ? header.value : "Unknown";
  };

  const decodeBody = (bodyData) => {
    if (!bodyData) return "No body found";
    try {
      const decoded = atob(bodyData.replace(/-/g, "+").replace(/_/g, "/"));
      return decodeURIComponent(escape(decoded));
    } catch (error) {
      console.error("Error decoding body:", error);
      return "Body is not properly encoded or is empty";
    }
  };

  const getBody = (payload) => {
    if (payload.body?.data) {
      return decodeBody(payload.body.data);
    }

    if (payload.parts) {
      for (let part of payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          return decodeBody(part.body.data);
        } else if (part.mimeType === "text/html" && part.body?.data) {
          return decodeBody(part.body.data);
        }
      }
    }

    return "No body found";
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={handleBackToMessages}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>Back to Inbox</span>
      </button>

      {/* Email Header */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {getHeader(selectedMessage.payload.headers, "Subject")}
        </h2>
        <p className="text-gray-600 mt-1">
          <span className="font-medium text-gray-800">From:</span>{" "}
          {getHeader(selectedMessage.payload.headers, "From")}
        </p>
      </div>

      {/* Email Body */}
      <div className="bg-gray-100 p-5 rounded-lg text-gray-900 leading-relaxed">
        {getBody(selectedMessage.payload)}
      </div>
    </div>
  );
};

export default MessageDetails;
