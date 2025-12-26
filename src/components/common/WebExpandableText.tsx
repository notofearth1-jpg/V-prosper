import React, { useState } from "react";
interface IExpandableTextProps {
  text: string;
}
const WebExpandableText: React.FC<IExpandableTextProps> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const maxWords = 20;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const words = text.split(" ");
  const displayText = expanded ? text : words.slice(0, maxWords).join(" ");
  return (
    <div>
      <p>{displayText}</p>
      {words.length > maxWords && (
        <button onClick={toggleExpand} className="text-blue-600 mx-2 cursor">
          {expanded ? "...less" : "...More"}
        </button>
      )}
    </div>
  );
};
export default WebExpandableText;
