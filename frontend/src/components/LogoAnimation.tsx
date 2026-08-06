import "./LogoAnimation.css";
import Logo from "../assets/theNewLogo.svg?react";

console.log("Logo import:", Logo);

const LogoAnimation = () => {
  return (
    <div className="logo-container">
      <Logo />
    </div>
  );
}

export default LogoAnimation;