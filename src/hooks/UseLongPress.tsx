export default function useLongPress() {
    return function (callback: () => void) {
      let timeout: NodeJS.Timeout;
      let preventClick = false;
  
      function start() {
        timeout = setTimeout(() => {
          preventClick = true;
          callback();
        }, 300);
      }
  
      function clear() {
        timeout && clearTimeout(timeout);
        preventClick = false;
      }
  
      function clickCaptureHandler(e: { stopPropagation: () => void; }) {
        if (preventClick) {
        //   e.stopPropagation();
        //   preventClick = false;
        }
      }
  
      return {
        onMouseDown: start,
        onTouchStart: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchMove: clear,
        onTouchEnd: clear,
        onClickCapture: clickCaptureHandler
      };
    }
  }