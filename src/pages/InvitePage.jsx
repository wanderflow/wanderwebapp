import { useLocation, Navigate } from "react-router-dom";
import SignIn from "@/components/SignIn";
import { useUser } from "@clerk/clerk-react";

const InvitePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const username = queryParams.get("username");
  const { user, isSignedIn } = useUser();
  localStorage.setItem("userId", userId);
  
  if (isSignedIn) {
    return <Navigate to="/download" />;
  }

  if (user) {
    console.log(user);
  }

  return (
    <main className="container ">
      <div className="fixed top-1/2 w-full max-w-md xl:max-w-xl flex flex-col gap-10 items-center">
        <h1 className="text-center">{`join ${username} to go deep!`}</h1>
      </div>
      <SignIn />
    </main>
  );
};

export default InvitePage;
