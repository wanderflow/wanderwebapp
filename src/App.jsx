import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { IconContext } from "react-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  EulaPage,
  PrivacyPage,
} from "./pages";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { AuthProvider } from "./pages/AuthContext";
import PrivateRoute from "./pages/internal_tools/PrivateRoute";
import QuestionList from "./pages/internal_tools/expression/ExpressionList";
import InternalIndex from "./pages/internal_tools";
const queryClient = new QueryClient();
import NewQuestion from "./pages/internal_tools/express/NewExpress";
import ExpressList from "./pages/internal_tools/express/ExpressList";
import EditExpress from "./pages/internal_tools/express/EditExpress";
import DailyExpressList from "./pages/internal_tools/express/DailyExpressList";
import CollegeList from "./pages/internal_tools/college/CollegeList";
import EditCollege from "./pages/internal_tools/college/EditCollege";

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
      <QueryClientProvider client={queryClient}>
        <IconContext.Provider value={{ color: "#8391A1", size: 24 }}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inviteToGuess" element={<InviteToGuessPage />} />
                <Route path="/invite" element={<InvitePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/internal" element={<InternalIndex />}>
                  <Route path="expression" element={<QuestionList />} />
                  <Route path="editExpress" element={<EditExpress />} />
                  <Route path="editCollege" element={<EditCollege />} />
                  <Route path="express" element={<ExpressList />} />
                  <Route path="dailyExpress" element={<DailyExpressList />} />
                  <Route path="newExpress" element={<NewQuestion />} />
                  {/* <Route path="oldPage" element={<QuestionEdit />} /> */}
                  <Route path="colleges" element={<CollegeList />} />
                  <Route index element={<Navigate to="/internal/express" />} />
                  <Route
                    path="*"
                    element={<Navigate to="/internal/express" />}
                  />
                </Route>

                <Route path="/confirm" element={<ConfirmEmailPage />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />
                <Route path="/collect-name" element={<CollectNamePage />} />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="/signout" element={<SignOut />} />
              </Routes>
            </Router>
          </AuthProvider>
        </IconContext.Provider>
      </QueryClientProvider>
    </div>
  );
}
