import React, { ReactNode, useCallback } from 'react';
import { TooltipPosition } from '../utils/AppConstants';

interface ITooltipProps {
  text: string;
  children: ReactNode;
  position?: (typeof TooltipPosition)[keyof typeof TooltipPosition]; // New position prop
}

const ICTooltip: React.FC<ITooltipProps> = ({ text, children, position }) => {
  const getPositionClass = useCallback(() => {
    switch (position) {
      case TooltipPosition.right:
        return 'right-tooltip';
      case TooltipPosition.bottom:
        return 'bottom-tooltip';
      case TooltipPosition.left:
        return 'left-tooltip';
      default:
        return '';
    }
  }, [position]);

  return (
    <div className={getPositionClass()}>
      <div className="tooltip-container">
        {children}
        <div className="tooltip-text">{text}</div>
      </div>
    </div>
  );
};

export default ICTooltip;
