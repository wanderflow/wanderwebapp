import { useLocation } from "react-router-dom";
import Button from "@/components/Button";

const InternalTools = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  localStorage.setItem("userId", userId);

  return (
    <main className="container ">
      <img
        src="src/assets/images/landing/AI2.png"
        alt="logo"
        className="h-20"
      />
      <div className="fixed top-1/2 w-full max-w-md xl:max-w-xl flex flex-col gap-10 items-center">
        <h1>{`Sign in below`}</h1>
        <Button text="Internal User Login" onClick={() => {}} link="/edit" />
        <h3 className="text-center">Wander Social</h3>
      </div>
    </main>
  );
};

export default InternalTools;
