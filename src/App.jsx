import { useEffect, useState, useCallback } from "react";
import { gapi } from "gapi-script";
import AuthButton from "./components/AuthButton";
import ProfileInfo from "./components/ProfileInfo";
import MessagesList from "./components/MessagesList";
import MessageDetails from "./components/MessageDetails";
import ComposeForm from "./components/ComposeForm";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeModalOpen, setComposeModalOpen] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleComposeModal = useCallback(() => {
    setComposeModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch((error) => {
          console.error("Error initializing Google API client:", error);
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const updateSigninStatus = (isSignedIn) => {
    setIsAuthenticated(isSignedIn);
    if (isSignedIn) {
      fetchUserProfile();
      fetchMessages();
    }
  };

  const handleAuthClick = useCallback(() => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }, []);

  const handleSignoutClick = useCallback(() => {
    gapi.auth2
      .getAuthInstance()
      .signOut()
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
    setUserProfile(null);
  }, []);

  const fetchMessages = (pageToken = null) => {
    setIsLoading(true);
    gapi.client.gmail.users.messages
      .list({
        userId: "me",
        maxResults: 10,
        pageToken: pageToken,
      })
      .then(
        (response) => {
          const fetchedMessages = response.result.messages;
          const nextToken = response.result.nextPageToken;

          if (fetchedMessages && fetchedMessages.length > 0) {
            const messagePromises = fetchedMessages.map((msg) =>
              gapi.client.gmail.users.messages.get({
                userId: "me",
                id: msg.id,
              })
            );

            Promise.all(messagePromises).then((responses) => {
              const messageDetails = responses.map((res) => res.result);
              setMessages((prevMessages) => [
                ...prevMessages,
                ...messageDetails,
              ]);
              setNextPageToken(nextToken);
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          setIsLoading(false);
        }
      );
  };

  const fetchUserProfile = () => {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const profile = user.getBasicProfile();
    setUserProfile({
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
    });
  };

  const handleSendEmail = (to, subject, body) => {
    if (!to.length) {
      alert("Please add at least one recipient.");
      return;
    }

    const toField = to.join(", ");
    const message = `To: ${toField}\nSubject: ${subject}\n\n${body}`;

    const encodedMessage = window
      .btoa(message)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    gapi.client.gmail.users.messages
      .send({
        userId: "me",
        resource: {
          raw: encodedMessage,
        },
      })
      .then(() => {
        alert("Email sent successfully!");
        fetchMessages();
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleBackToMessages = () => {
    setSelectedMessage(null);
  };

  const loadMoreMessages = () => {
    if (nextPageToken) {
      fetchMessages(nextPageToken);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-4 items-center justify-center mb-5">
        {isAuthenticated && userProfile && (
          <ProfileInfo userProfile={userProfile} />
        )}
        <AuthButton
          isAuthenticated={isAuthenticated}
          handleAuthClick={handleAuthClick}
          handleSignoutClick={handleSignoutClick}
        />
      </div>

      {isAuthenticated && (
        <>
          {selectedMessage ? (
            <MessageDetails
              selectedMessage={selectedMessage}
              handleBackToMessages={handleBackToMessages}
            />
          ) : (
            <MessagesList
              messages={messages}
              handleSelectMessage={handleSelectMessage}
              handleCompose={toggleComposeModal}
            />
          )}

          {isComposeModalOpen && (
            <div className="modal fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm  bg-opacity-50">
              <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 relative">
                <button
                  onClick={toggleComposeModal}
                  className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 font-bold"
                >
                  X
                </button>
                <ComposeForm handleSendEmail={handleSendEmail} />
              </div>
            </div>
          )}

          {!selectedMessage && !isLoading && nextPageToken && (
            <div className="text-center my-6">
              <button
                onClick={loadMoreMessages}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Load More Messages
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
