import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import internalBg from "@/assets/images/internalBg.jpg";
import { SignedOut, SignInButton } from "@clerk/clerk-react";

import logo from "@/assets/images/logo.png";
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/internal/express");
    }
  }, []);

  return (
    <SignedOut>
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${internalBg})` }} // Set the background image here
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
          <img src={logo} alt="" className="w-20 m-auto mb-8" />
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </div>
      </div>
    </SignedOut>
  );
};

export default Login;
