import {
  HashRouter as Router,
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
  InternalToolsPage,
  QuestionEdit,
  DownloadPage,
  CollectNamePage,
  Login,
  Home,
} from "./pages";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { AuthProvider } from "./pages/AuthContext";
import PrivateRoute from "./pages/PrivateRoute";

function OAuthCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

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

const SignOut = () => {
  const clerk = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    async function performSignOut() {
      try {
        await clerk.signOut();
        navigate("/");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }

    performSignOut();
  }, [clerk, navigate]);

  return <div>Signing you out...</div>;
};

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <IconContext.Provider value={{ color: "#8391A1", size: 24 }}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inviteToGuess" element={<InviteToGuessPage />} />
              <Route path="/invite" element={<InvitePage />} />
              <Route path="/internal" element={<InternalToolsPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/edit"
                element={
                  <PrivateRoute>
                    <QuestionEdit />
                  </PrivateRoute>
                }
              />
              <Route path="/confirm" element={<ConfirmEmailPage />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/collect-name" element={<CollectNamePage />} />
              <Route path="/download" element={<DownloadPage />} />
              <Route path="/signout" element={<SignOut />} />
            </Routes>
          </Router>
        </AuthProvider>
      </IconContext.Provider>
    </div>
  );
}
