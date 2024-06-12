import { useState, useEffect } from "react";
import {
  landingImage,
  landing2Image,
  AIImage,
  AI2Image,
  download1Image,
  download2Image,
  eyeImage,
  eyeImage2,
} from "@/utils";
const Home = () => {
  const [isChanged, setIsChanged] = useState(false);
  const changeTheme = () => {
    if (isChanged) {
      window.location.href = "https://forms.gle/oPNox1H5knt4bJHa7";
    }
  };

  useEffect(() => {
    const handleClick = () => {
      const buttonElement = document.querySelector(".join-waitlist-button");
      if (buttonElement && buttonElement.contains(event.target)) {
        return;
      }
      setIsChanged(!isChanged);
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      className={`mx-auto px-4 py-6 transition-all duration-3000 ${
        isChanged ? `bg-[#ffffff] text-black` : "bg-[#152227] text-white"
      }`}
    >
      <header className="text-center mb-6 mt-12 md:mt-6">
        <div className="flex justify-center items-center mb-4">
          <img
            src={isChanged ? AI2Image : AIImage}
            alt="logo"
            className="h-20"
          />
          <h1
            className={`text-4xl font-bold ml-4 transition-all duration-3000 ${
              isChanged ? `text-black` : `text-white`
            }`}
          >
            Wander
          </h1>
        </div>
        <div className="relative w-full max-w-xs mx-auto md:max-w-sm">
          <img
            src={isChanged ? landing2Image : landingImage}
            alt="landing"
            className="w-full h-auto rounded-full"
          />
        </div>
        <div className="flex items-center justify-center mt-6">
          <img
            src={isChanged ? eyeImage : eyeImage2}
            alt="eyes"
            className="h-10 md:mr-4"
          />
          <p className="text-lg max-w-72 md:max-w-full md:text-xl font-medium mt-3 mb-6">
            {`${
              isChanged
                ? `try “Media Social”: discover your world, connect serendipitously`
                : `“Social Media” promises social... but pushes media`
            }`}
          </p>
        </div>
      </header>
      <div className="text-center flex flex-col justify-center items-center">
        <button
          className={`join-waitlist-button w-60 h-20 md:h-24 rounded-full py-4 px-8 mb-3 shadow-lg transition-all duration-3000 ${
            isChanged
              ? " bg-button-gradient text-black"
              : "bg-gradient-to-r from-gray-400 to-[#152227]"
          }`}
          onClick={changeTheme}
        >
          {isChanged ? "Join the Waitlist" : "Alternative Future"}
        </button>
        <p className="mt-6">
          For support issues, please email{" "}
          <a
            href="mailto:help.wander.one@gmail.com"
            className={`text-purple-500 underline transition-all duration-3000 ${
              isChanged ? `text-black` : `text-white`
            }`}
          >
            help.wander.one@gmail.com
          </a>
        </p>
        <section className="h-screen mt-24 md:mt-10 text-center mx-3 md:mx-auto flex flex-col justify-center items-center">
          <h2
            className={`text-2xl font-bold mb-9 md:mb-16 transition-all duration-3000 ${
              isChanged ? ` text-black` : " text-white"
            }`}
          >
            After talking to hundreds of Gen Zs, we discovered a paradox:
          </h2>
          <p className="mb-4 home-p">{`They should've been the happiest generation, with higher living standards and endless entertainment at their fingertips.`}</p>
          <p className="mb-4 home-p">
            Yet the loneliness epidemic seems real, genuine social connections
            are alarmingly absent.
          </p>
          <p className="mb-4 home-p">{`Diving deeper, we found that on social media, Gen Z feels they're performing rather than communicating.`}</p>
          <p className="mb-4 home-p">
            And to meet someone new, they have dating apps, where connections
            seem just a swipe away.
          </p>
          <p className="mb-4 home-p">
            Yet, hundreds of chats later, the search for meaningful interaction
            continues.
          </p>
          <p className="mb-4 home-p">
            Today, social media is more about addictive media consumption than
            about fostering real social interactions.
          </p>
          <p className="mb-4 home-p">
            In response, we created <strong>Wander</strong> to bridge this gap,
            fostering authentic connections.
          </p>
          <p className="mb-4 home-p">
            Give <span className="font-semibold md:text-lg">Wander Social</span> a try! We are early stage, and would really
            appreciate any thoughts and feedback!
          </p>
          <a
            href="https://apps.apple.com/app/apple-store/id6474634049?pt=126456033&ct=website&mt=8"
            className="inline-block mt-16"
          >
            <img
              src={isChanged ? download2Image : download1Image}
              alt="Download on the App Store"
              className="w-64 mx-auto mb-3"
            />
          </a>
        </section>
      </div>
    </div>
  );
};

export default Home;
