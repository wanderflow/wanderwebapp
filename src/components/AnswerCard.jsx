import PropTypes from "prop-types";

const AnswerCard = ({ text, flag = null, onClick }) => {
  let borderColorClass = "";

  if (flag === true) {
    borderColorClass = "border-green";
  } else if (flag === false) {
    borderColorClass = "border-red";
  } else {
    borderColorClass = "border-white";
  }

  return (
    <div
      className={`answer-card border-4 ${borderColorClass}  box-border`}
      onClick={onClick}
    >
      <p>{text}</p>
    </div>
  );
};

AnswerCard.propTypes = {
  text: PropTypes.string.isRequired,
  flag: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AnswerCard;
