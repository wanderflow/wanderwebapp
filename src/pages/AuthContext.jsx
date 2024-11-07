import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();

  const role = useMemo(() => {
    try {
      const internalOrg = user.organizationMemberships.find(
        (org) => org.organization.name === "InternalTool"
      );
      return internalOrg.role === "admin" ? "admin" : "readonly";
    } catch (e) {
      return "user";
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: isSignedIn, role, readonly: role != "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
