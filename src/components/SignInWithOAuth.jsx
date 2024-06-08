import { useSignUp } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import Button from "@/components/Button";

const SignInWithOAuth = ({ provider }) => {
  const { signUp } = useSignUp();

  if (!signUp) return null;

  const handleOAuth = async () => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: `${window.location.origin}/oauth-callback`,
        afterSignInUrl: `${window.location.origin}/collect-name`,
      });
    } catch (error) {
      console.error("OAuth flow failed", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };
  return (
    <Button
      type={provider === "apple" ? "apple" : "google"}
      text={`Continue with ${provider}`}
      onClick={handleOAuth}
    />
  );
};

SignInWithOAuth.propTypes = {
  provider: PropTypes.string.isRequired,
};
export default SignInWithOAuth;
