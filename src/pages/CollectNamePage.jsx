import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import WanderBg from "@/components/WanderBg";
import { createInviteUserRelation } from "@/api";

const CollectNamePage = () => {
  const [name, setName] = useState("");
  const { user, isLoaded } = useUser();

  const handleNameSubmit = async () => {

    if (!isLoaded) {
      console.error("User data is not loaded yet.");
      return;
    }
    if (!user) {
      console.error("User object is not available.");
      return;
    }
    if (!name) {
      console.error("Username cannot be empty.");
      return;
    }

    try {
      await user.update({ username: name });
      const data = await createInviteUserRelation({
        invite_user_id: localStorage.getItem("userId"),
        accept_user_id: user.id,
      });
      console.log("Invite user relation created:", data);
      window.location.href = "/#/download";
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
      <div className="relative z-10 flex flex-col items-center text-black">
        <div className="w-full mt-24">
          {/* <img src={backSvg} alt={`Back icon`} className="" /> */}
          <div className="flex flex-col items-center w-full">
            <h1 className="my-12">What is your user name?</h1>
            <div className="fixed top-1/3 mt-12 max-w-md xl:max-w-xl w-full px-12">
              <input
                value={name}
                className="input-field"
                placeholder="Username"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="fixed bottom-1/4 -mb-24 max-w-md xl:max-w-xl w-full px-12">
              <button className="mt-24" onClick={handleNameSubmit}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </WanderBg>
  );
};

export default CollectNamePage;
