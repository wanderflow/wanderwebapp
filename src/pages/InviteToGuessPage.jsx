import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";
import SignIn from "@/components/SignIn";
import { getInviteAnswers } from "@/api";
import { useSession } from "@clerk/clerk-react";

const InviteToGuessPage = () => {
  const [selected, setSelected] = useState(false);
  const [result, setResult] = useState(null);
  const [index, setIndex] = useState(2);
  const [invitationAnswers, setInvitationAnswers] = useState([]);
  const [express, setExpress] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const express_pk = queryParams.get("expressPk");
  const userId = queryParams.get("userId");
  const username = queryParams.get("username");
  localStorage.setItem("userId", userId);

  const handleOnClick = (index) => {
    setSelected(true);
    setIndex(index);
    if (index === 0) {
      setResult(true);
    } else {
      setResult(false);
    }
  };
  const getInvitationInfo = async () => {
    setLoading(true);
    const data = await getInviteAnswers({ user: userId, express_pk });
    setInvitationAnswers(data.map((d) => d.answer_text));
    setExpress(data[3].express_question);
    const targetItem = data.find((d) => d.distance === 0);
    const index = data.indexOf(targetItem);
    setIndex(index);
    setLoading(false);
  };

  useEffect(() => {
    if (express_pk && invitationAnswers.length === 0) {
      getInvitationInfo();
    }
  });

  const { isSignedIn } = useSession();

  if (isSignedIn) {
    return <Navigate to="/download" />;
  }

  if (loading) {
    return (
      <main className="container">
        <div className="mt-20 flex flex-col gap-10 items-center">
          <h1 className="">{`loading...`}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="mt-20 flex flex-col gap-10 items-center">
        <h1 className="">{express}</h1>

        {selected ? (
          <div className="flex flex-col items-center">
            <AnswerCard text={invitationAnswers[index]} flag={result} />
            <h2 className="mt-16">
              {result ? `🎉 Correct! 🎉 ` : ` 🤣 Oops! 🤣`}
            </h2>
            <h2 className="">
              {result ? `join ${username} to go deep!` : `Sign up to reveal!`}
            </h2>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {invitationAnswers.slice(0, 3).map((answer, index) => (
                <AnswerCard
                  key={index}
                  text={answer}
                  onClick={() => handleOnClick(index)}
                  flag={null}
                />
              ))}
            </div>
            <h2 className="">{`Which is ${username}’s answer?`}</h2>
          </>
        )}
        {selected && <SignIn />}
      </div>
    </main>
  );
};

export default InviteToGuessPage;
