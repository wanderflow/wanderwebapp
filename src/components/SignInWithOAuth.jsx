import { useSignIn } from "@clerk/clerk-react";
import PropTypes from "prop-types";
import Button from "@/components/Button";

const SignInWithOAuth = ({provider}) => {
  const { signIn } = useSignIn();

  const handleOAuth = async () => {
    try {
      await signIn.authenticateWithRedirect({
        provider: `oauth_apple`,
        redirectUrl: window.location.href,
        redirectUrlComplete: window.location.href,
      });
    } catch (error) {
      console.error('OAuth flow failed', error);
      console.error('Error details:', error.response?.data || error.message);
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
