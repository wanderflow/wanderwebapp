import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { IconContext } from "react-icons";
import {
  SignUp,
  ConfirmEmailPage,
  InvitePage,
  InviteToGuessPage,
  DownloadPage,
  CollectNamePage,
  Home,
} from "./pages";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

// const RootRedirect = () => {
//   const { user, isSignedIn, isLoaded } = useUser();

//   useEffect(() => {
//     console.log(user, isSignedIn);
//   }, [user, isSignedIn, isLoaded]);

//   if (!isLoaded) {
//     return <div>Loading...</div>; // or a loading spinner
//   }

//   return isSignedIn ? <Navigate to="/download" /> : <Navigate to="/invite" />;
// };

function OAuthCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  console.log(user, isSignedIn);

  useEffect(() => {
    async function processCallback() {
      try {
        // await handleRedirectCallback();
        if (isSignedIn) {
          navigate("/collect-name");
        } else {
          navigate("/download");
        }
      } catch (error) {
        console.error("Error during OAuth callback:", error);
      }
    }

    processCallback();
  }, [handleRedirectCallback, isSignedIn, user, navigate]);
}

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <IconContext.Provider value={{ color: "#8391A1", size: 24 }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inviteToGuess" element={<InviteToGuessPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm" element={<ConfirmEmailPage />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/collect-name" element={<CollectNamePage />} />
            <Route path="/download" element={<DownloadPage />} />
          </Routes>
        </Router>
      </IconContext.Provider>
    </div>
  );
}
