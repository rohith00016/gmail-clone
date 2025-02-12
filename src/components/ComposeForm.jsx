/* eslint-disable react/prop-types */
import { useState } from "react";

const ComposeForm = ({ handleSendEmail }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [recipients, setRecipients] = useState([]);

  const addEmail = () => {
    const emails = to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    if (emails.length) {
      setRecipients([...new Set([...recipients, ...emails])]);
      setTo("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setRecipients(recipients.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipients.length === 0) return alert("Please add at least one recipient.");
    handleSendEmail(recipients, subject, body);
    setRecipients([]);
    setSubject("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="text-2xl font-semibold mb-6">Compose Email</h2>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2" htmlFor="to">To:</label>
        <div className="flex items-center space-x-2">
          <input
            id="to"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter email(s)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addEmail}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </div>

      {/* Display added emails */}
      {recipients.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {recipients.map((email, index) => (
            <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg flex items-center space-x-2">
              <span>{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Subject Input */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2" htmlFor="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Body Input */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2" htmlFor="body">Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
        />
      </div>

      {/* Send Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </form>
  );
};

export default ComposeForm;
