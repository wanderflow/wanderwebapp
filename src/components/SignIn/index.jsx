import Button from "@/components/Button";
import SignInWithOAuth from "../SignInWithOAuth";
const SignIn = () => {
  return (
    <div className="fixed-container flex flex-col gap-4 w-full px-6 mt-12">
      <Button text="Sign up free" onClick={() => {}} link="/signup" />
      <SignInWithOAuth provider="apple" />
      <SignInWithOAuth provider="google" />
      <h3 className="text-center">Wander Social</h3>
    </div>
  );
};

export default SignIn;
