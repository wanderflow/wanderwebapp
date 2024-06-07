import PropTypes from "prop-types";
import { bgSmallImage, bgLargeImage } from "../utils";

const WanderBg = ({ children }) => {
  return (
    <main className="relative">
      <div
        className="bg xl:hidden"
        style={{ backgroundImage: `url(${bgSmallImage})` }}
      />
      <div
        className="bg hidden xl:block"
        style={{ backgroundImage: `url(${bgLargeImage})` }}
      />
      {children}
    </main>
  );
};

WanderBg.propTypes = {
  children: PropTypes.element,
};


export default WanderBg;
