import React, { useEffect, useState } from "react";
import { formatToCurrency } from "../utils/AppFunctions";

const NumberSpinnerAnimation = ({
  number: targetNumber,
}: {
  number: number;
}) => {
  const [displayNumber, setDisplayNumber] = useState(targetNumber);

  useEffect(() => {
    let currentNumber = 0;
    const incrementCount = 50;
    const incrementRate = 1000 / incrementCount;
    const incrementValue = targetNumber / incrementCount;
    const intervalId = setInterval(() => {
      if (currentNumber < targetNumber) {
        currentNumber = Math.min(currentNumber + incrementValue, targetNumber);
        setDisplayNumber(Math.round(currentNumber));
      } else {
        setDisplayNumber(targetNumber);
        clearInterval(intervalId);
      }
    }, incrementRate);

    return () => clearInterval(intervalId);
  }, [targetNumber]);

  return <>{formatToCurrency(displayNumber)}</>;
};

export default NumberSpinnerAnimation;
