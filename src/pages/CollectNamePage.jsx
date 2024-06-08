import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import WanderBg from "@/components/WanderBg";

const CollectNamePage = () => {
  const [name, setName] = useState("");
  const { user, session } = useAuth();

  const handleNameSubmit = async () => {
    try {
      // 使用 Clerk API 更新用户信息
      await axios.patch(`https://api.clerk.dev/v1/users/${user.id}`, {
        username: name,
      }, {
        headers: {
          Authorization: `Bearer ${user.primarySessionId}`
        }
      });

      // 将用户重定向到主页面
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating user information:', error);
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
              <button className="mt-24" onClick={handleNameSubmit}>Sign up</button>
            </div>
          </div>
        </div>
      </div>
    </WanderBg>
  );
};

export default CollectNamePage;
