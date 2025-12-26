import React, { useState, useEffect } from 'react';
import UseTranslationHook from '../hooks/UseTranslationHook';

interface ICountdownProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Countdown: React.FC<ICountdownProps> = ({ targetDate }) => {
    const { t } = UseTranslationHook();

    const padWithZero = (number: number): string => {
        return number < 10 ? `0${number}` : number.toString();
    };

    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className='text-skin-insights flex lg:gap-6 gap-3 items-center'>
            <div className='text-center'>
                <div className='lg:text-4xl text-2xl'>{padWithZero(timeLeft.days)}</div>
                <div>{t("days")}</div>
            </div>
            <div className='blinking-colon lg:text-5xl text-3xl mb-5'>:</div>
            <div className='text-center'>
                <div className='lg:text-4xl text-2xl'>{padWithZero(timeLeft.hours)}</div>
                <div>{t("hours")}</div>
            </div>
            <div className='blinking-colon lg:text-5xl text-3xl mb-5'>:</div>
            <div className='text-center'>
                <div className='lg:text-4xl text-2xl'>{padWithZero(timeLeft.minutes)}</div>
                <div>{t("minutes")}</div>
            </div>
            <div className='blinking-colon lg:text-5xl text-3xl mb-5'>:</div>
            <div className='text-center'>
                <div className='lg:text-4xl text-2xl'>{padWithZero(timeLeft.seconds)}</div>
                <div>{t("seconds")}</div>
            </div>
        </div>
    );
};

export default Countdown;
