import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

let CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
// let redirectUrl = import.meta.env.VITE_ONLINE_DOMAIN;
if (import.meta.env.MODE === "development") {
  CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_DEV;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <App />
      </ClerkLoaded>
    </ClerkProvider>
  </React.StrictMode>
);
