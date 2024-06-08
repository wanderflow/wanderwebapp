import { useSignIn } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import Button from "@/components/Button";

const SignInWithOAuth = ({ provider }) => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) {
    return null;
  }
  const handleOAuth = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: `${window.location.origin}/oauth-callback`, // 确保这个 URL 正确
  afterSignInUrl: `${window.location.origin}/collect-name` // 确保这个 URL 正确
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
