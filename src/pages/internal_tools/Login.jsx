import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import internalBg from "@/assets/images/internalBg.jpg";
import logo from "@/assets/images/logo.png";
import { notification } from "antd";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const mainUsername = "admin";
    const mainPassword = "password123";

    if (email === mainUsername && password === mainPassword) {
      login();
      navigate("/edit");
    } else {
      // alert("Invalid username or password");
      notification.error({
        message: "Error",
        description: "Invalid username or password",
      });
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${internalBg})` }} // Set the background image here
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
        <img src={logo} alt="" className="w-20 m-auto mb-8" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
