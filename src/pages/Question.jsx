import { useState } from "react";
import AnswerCard from "../components/AnswerCard";
import Button from "../components/Button";

const Question = () => {
  const answers = [
    "Explore new cities and countries with, getting lost in the streets and finding ourselves in the process.",
    "Cook and discover new recipes with, making a mess in the kitchen but creating delicious memories.",
    "Astronaut-DJ spinning interstellar beats while floating in zero gravity.",
  ];
  const [selected, setSelected] = useState(false);
  const [result, setResult] = useState(null);
  const [index, setIndex] = useState(0);
  const handleOnClick = (index) => {
    setSelected(true);
    setIndex(index);
    if (index === 0) {
      setResult(true);
    } else {
      setResult(false);
    }
  };

  return (
    <main className="container">
      <div className="mt-20 flex flex-col gap-10 items-center">
        <h1 className="">{`It'd be nice to meet someone to…?`}</h1>

        {selected ? (
          <div className="flex flex-col items-center">
            <AnswerCard text={answers[index]} flag={result} />
            <h2 className="mt-16">
              {result ? `🎉 Correct! 🎉 ` : ` 🤣 Oops! 🤣`}
            </h2>
            <h2 className="">
              {result ? `join XXX to go deep!` : `Sign up to reveal!`}
            </h2>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {answers.map((answer, index) => (
                <AnswerCard
                  key={index}
                  text={answer}
                  onClick={() => handleOnClick(index)}
                  flag={null}
                />
              ))}
            </div>
            <h2 className="">{`Which is XXX’s answer?`}</h2>
          </>
        )}
        {selected && (
          <div className="fixed-container flex flex-col gap-4 w-full px-6 mt-12">
            <Button text="Sign up free" onClick={() => {}} link="/signup" />
            <Button
              type="apple"
              text="Continue with Apple"
              onClick={() => {}}
              link="/signup"
            />

            <Button
              type="google"
              text="Continue with Google"
              onClick={() => {}}
              link="/signup"
            />
            <h3 className="text-center">Wander Social</h3>
          </div>
        )}
      </div>
    </main>
  );
};

export default Question;
