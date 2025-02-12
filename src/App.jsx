import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

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
        });
    };

    gapi.load("client:auth2", initClient);
  },[]);

  const updateSigninStatus = (isSignedIn) => {
    setIsAuthenticated(isSignedIn);
    if (isSignedIn) {
      fetchUserProfile();
      fetchMessages();
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
    setUserProfile(null);
  };

  const fetchMessages = () => {
    gapi.client.gmail.users.messages
      .list({
        userId: "me",
        maxResults: 10,
      })
      .then((response) => {
        const messages = response.result.messages;
        if (messages && messages.length > 0) {
          const messagePromises = messages.map((msg) =>
            gapi.client.gmail.users.messages.get({
              userId: "me",
              id: msg.id,
            })
          );

          Promise.all(messagePromises).then((responses) => {
            const messageDetails = responses.map((res) => res.result);
            setMessages(messageDetails);
          });
        }
      });
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

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleAuthClick}>Sign in with Google</button>
      ) : (
        <>
          <button onClick={handleSignoutClick}>Sign out</button>
          <div>
            <h2>User Profile:</h2>
            <p>Name: {userProfile?.name}</p>
            <p>Email: {userProfile?.email}</p>
            {userProfile?.imageUrl && (
              <img src={userProfile.imageUrl} alt="Profile" />
            )}
          </div>
          <div>
            <h2>Your Messages:</h2>
            {messages.map((message, index) => (
              <div key={index}>
                <p>
                  Subject:{" "}
                  {
                    message.payload.headers.find(
                      (header) => header.name === "Subject"
                    )?.value
                  }
                </p>
                <p>
                  From:{" "}
                  {
                    message.payload.headers.find(
                      (header) => header.name === "From"
                    )?.value
                  }
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
