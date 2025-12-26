import React, { useState, useEffect } from 'react';


const Slider = () => {
    const slides = [
        {
            img: require('./../../../assets/image/10812707_4574567-removebg-preview.png'),
            title: 'Slide 1',
            body: "Data fuels the digital world. It's the key to understanding, predicting, and improving everything online. From websites to social media, data drives decisions, recommendations, and insights."
        },
        {
            img: require('./../../../assets/image/12832600_5057942-removebg-preview.png'),
            title: 'Slide 2',
            body: "Data powers the digital world, driving insights and decisions across the web. It's the lifeblood of websites, social media, and more, enabling predictions and improvements."
        },
        {
            img: require('./../../../assets/image/7140739_3515462-removebg-preview.png'),
            title: 'Slide 3',
            body: "Data is the backbone of the digital world, shaping online experiences,  and powering predictions. From websites to social media, it's the force behind insights and improvements."
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Increment the currentIndex to show the next slide
            setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 7000); // Change slide every 5 seconds (including the 2-second delay)

        return () => {
            // Cleanup: clear the interval when the component unmounts
            clearInterval(interval);
        };
    }, []); // Empty dependency array to run this effect only once on component mount

    return (
        <div className="w-full  flex items-center justify-center px-5 py-5">
            <div className="mx-auto rounded-xl shadow-lg bg-white bg-opacity-90 px-10 pt-16 pb-10 text-gray-600 h-2/4  w-2/4">
                <div className="overflow-hidden relative mb-10">
                    <div className="overflow-hidden">
                        {slides.map((item, index) => (
                            <div
                                key={index}
                                className={`w-full overflow-hidden text-center select-none slide ${index === currentIndex ? 'active' : 'hidden'} `}
                            >
                                <div
                                    className="w-80 h-80 rounded-lg mx-auto mb-10 overflow-hidden bg-cover bg-center slide-image animated-slide"
                                    style={{ backgroundImage: `url(${item.img})` }}
                                ></div>
                                <h2 className="font-medium  text-base  text-gray-600 mb-3 tracking-wide  font-sans animated-slide">{item.body}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center">
                    {slides.map((item, index) => (
                        <span
                            key={index}
                            id={`slideDot${index}`}
                            className={`w-2 h-2 rounded-full mx-1 ${index === currentIndex ? 'bg-indigo-500' : 'bg-gray-300'}`}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
