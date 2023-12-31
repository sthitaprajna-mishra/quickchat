// react
import React, { useContext } from "react";

// context
import { ThemeContext } from "../context/ThemeContext";

// assets
import darklogo from "../assets/logo_dark_2.png";
import lightlogo from "../assets/logo_light.png";

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex items-center justify-center bg-lightColor1  py-4 dark:bg-darkColor1">
      <div className="text-6xl text-blueColor1 font-semibold">QuickChat</div>
    </div>
  );

  // return theme === "light" ? (
  //   <div className="flex justify-center mx-auto bg-lightColor1 pb-1 rounded-md">
  //     <img className="h-24 md:h-32" src={lightlogo} alt="light logo" />
  //   </div>
  // ) : (
  //   <div className="flex justify-center mx-auto bg-darkColor1 rounded-md">
  //     <img className="h-24 md:h-32" src={darklogo} alt="dark logo" />
  //   </div>
  // );
};

export default Header;
