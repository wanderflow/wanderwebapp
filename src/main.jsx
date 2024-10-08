import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

let CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (import.meta.env.MODE === "development") {
  CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_DEV;
}
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
console.log(import.meta.env.VITE_VERSION_MARK, CLERK_PUBLISHABLE_KEY);
ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <ClerkLoaded>
      <App />
    </ClerkLoaded>
  </ClerkProvider>
);
