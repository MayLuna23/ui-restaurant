import React from "react";

interface LogoProps {
  size?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "4rem" }) => {
  return (
    <div style={{ lineHeight: 1.2, fontSize: size }}>
      <div style={{ color: "#743A1D" }} className="sacramento-regular text-center">
        Ocean
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.3em",
          color: "#743A1D",
          marginTop: "-0.3em",
        }}
      >
        Restaurant Software
      </div>
    </div>
  );
};

export default Logo;
