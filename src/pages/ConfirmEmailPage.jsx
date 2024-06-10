import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import WanderBg from "@/components/WanderBg";

const ConfirmEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [code, setCode] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();

  const onConfirm = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      navigate("/download");
    } catch (err) {
      console.log("Error:", err);
      if (err.errors && err.errors[0]) {
        console.log("Error Message:", err.errors[0].message);
        alert(err.errors[0].message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };
  return (
    <WanderBg>
      <div className="relative z-10 flex flex-col items-center text-black px-6 min-h-screen justify-center">
        <div className="flex flex-col items-center justify-center gap-12">
          <h1>We have sent a verification code to:</h1>
          <h1 className="-mt-6 mb-3">{email}</h1>
          <input
            value={code}
            className="input-field"
            placeholder="Enter your code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </WanderBg>
  );
};

export default ConfirmEmailPage;
