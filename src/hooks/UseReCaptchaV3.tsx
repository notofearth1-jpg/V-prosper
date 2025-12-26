// import { useState, useEffect, useCallback } from 'react';

const useRecaptchaV3 = (siteKey: any) => {
    //     const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    //     useEffect(() => {
    //         if (window.grecaptcha) {
    //             setIsRecaptchaReady(true);
    //         } else {
    //             const script = document.createElement('script');
    //             script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    //             script.async = true;
    //             document.head.appendChild(script);
    //             script.onload = () => setIsRecaptchaReady(true);
    //         }
    //     }, [siteKey]);

    //     const executeRecaptcha = useCallback(async () => {
    //         // if (isRecaptchaReady && window.grecaptcha) {
    //         //     return await window.grecaptcha.execute(siteKey);
    //         // }
    //         return null;
    //     }, [isRecaptchaReady, siteKey]);

    //     return executeRecaptcha;
};

export default useRecaptchaV3;