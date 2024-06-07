import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { appleSvg, googleSvg } from "../utils";

const Button = ({ type = "default", text, onClick, link }) => {
  if (type != "default") {
    return (
      <button
        className="relative flex flex-row gap-5 bg-white text-gray items-center justify-center"
        onClick={onClick}
      >
        <img
          src={type === "apple" ? appleSvg : googleSvg}
          alt={`${type} icon`}
          className="absolute left-6 w-6 h-6 mr-2 "
        />
        <span>{text}</span>
      </button>
    );
  }
  if (link) {
    return (
      <Link to={link}>
        <button onClick={onClick}>
          <span>{text}</span>
        </button>
      </Link>
    );
  } else {
    return (
      <button onClick={onClick}>
        <span>{text}</span>
      </button>
    );
  }
};

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  link: PropTypes.string,
};

export default Button;
