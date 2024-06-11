import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
// import { backSvg } from "../utils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import WanderBg from "@/components/WanderBg";
import { createInviteUserRelation } from "@/api";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoaded, signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    if (Object.keys(errors).length === 0)
      if (!isLoaded) {
        console.log("loading");
        return;
      }
    try {
      const user = await signUp.create({
        username,
        emailAddress: email,
        password,
      });
      const data = await createInviteUserRelation({
        invite_user_id: localStorage.getItem("userId"),
        accept_user_id: user.id,
      });
      console.log("Invite user relation created:", data);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      navigate(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log("Error:", err);
      if (err.errors && err.errors[0]) {
        console.log("Error Message:", err.errors[0].message);
        alert(err.errors[0].message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <WanderBg>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 flex flex-col items-center text-black p-6"
      >
        <div className="w-full mt-12">
          {/* <img src={backSvg} alt={`Back icon`} className="" /> */}
          <div className="flex flex-col items-center px-6 gap-6 w-full">
            <h1 className="my-12">Sign up</h1>
            <div className="relative w-full flex flex-col">
              <input
                value={username}
                {...register("username")}
                className="input-field"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="error-text">{errors.username.message}</p>
              )}
            </div>
            <div className="relative w-full flex flex-col">
              <input
                name="email"
                type="email"
                {...register("email")}
                value={email}
                className="input-field"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div className="relative w-full flex flex-col">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                value={password}
                className="input-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer "
                onClick={toggleShowPassword}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div className="relative w-full flex flex-col">
              <input
                {...register("passwordConfirm")}
                type={showPassword ? "text" : "password"}
                value={passwordConfirm}
                className="input-field"
                placeholder="Confirm password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer "
                onClick={toggleShowPassword}
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </div>
              {errors.passwordConfirm && (
                <p className="error-text">{errors.passwordConfirm.message}</p>
              )}
            </div>

            <h5 className="terms my-6">
              By continuing, I agree to the{" "}
              <a
                href="https://wander.one/eula"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="https://wander.one/privacy_policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </h5>
            <button type="submit" className="w-full">
              Sign up
            </button>
            {/* <p className="login-link mt-12 text-white" onClick={onBack}>
              Already have an account? <strong>Log in</strong>
            </p> */}
          </div>
        </div>
      </form>
    </WanderBg>
  );
};

export default SignUp;
