import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { IconContext } from "react-icons";
import {
  SignUp,
  ConfirmEmailPage,
  InvitePage,
  InviteToGuessPage,
  DownloadPage,
} from "./pages";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const RootRedirect = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    console.log(user, isSignedIn, isLoaded);
  }, [user, isSignedIn, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return isSignedIn ? <Navigate to="/download" /> : <Navigate to="/invite" />;
};

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <IconContext.Provider value={{ color: "#8391A1", size: 24 }}>
        <Router>
          <Routes>
          <Route path="/" element={<RootRedirect />} />
            <Route path="/inviteToGuess" element={<InviteToGuessPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm" element={<ConfirmEmailPage />} />
            <Route path="/download" element={<DownloadPage />} />
          </Routes>
        </Router>
      </IconContext.Provider>
    </div>
  );
}
