import React from "react";

interface ButtonInfo {
  text: string;
  link: string;
  backgroundColour: string;
}

interface InfoBoxTypes extends React.ComponentProps<"div"> {
  heading: string;
  backgroundColour?: string;
  textColour?: string;
  buttonInfo: ButtonInfo;
}

const InfoBox = ({
  heading,
  backgroundColour = "bg-gray-100",
  textColour = "text-gray-800",
  buttonInfo,
  children,
}: InfoBoxTypes) => {
  return (
    <div className={`${backgroundColour} p-6 rounded-lg shadow-md`}>
      <h2 className={`${textColour} font-bold`}>{heading}</h2>
      <p className={`${textColour} mt-2 mb-4`}>{children}</p>
      <a
        href={buttonInfo.link}
        className={`inline-block ${buttonInfo.backgroundColour} text-white rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {buttonInfo.text}
      </a>
    </div>
  );
};

export default InfoBox;
