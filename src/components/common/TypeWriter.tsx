import React, { useState, useEffect } from 'react';
interface ITypewriterProps {
    sentence: string; speed: number
}
const Typewriter: React.FC<ITypewriterProps> = ({ sentence, speed }) => {
    const [text, setText] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(true);
    const [charIndex, setCharIndex] = useState<number>(0);

    useEffect(() => {
        const typingInterval = setInterval(() => {
            if (isTyping) {
                if (charIndex <= sentence.length) {
                    setText(sentence.substring(0, charIndex));
                    setCharIndex(prevIndex => prevIndex + 1);
                } else {
                    setIsTyping(false);
                }
            } else {
                if (text.length > 0) {
                    setText(text.substring(0, text.length - 1));
                } else {
                    setIsTyping(true);
                    setCharIndex(0);
                }
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [sentence, speed, isTyping, text, charIndex]);

    return <div>{text}</div>;
};

export default Typewriter;
