import React, { useState, useRef, useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import aiImage from '../assets/ai.gif'
import userImage from '../assets/user.gif'
import { CgMenuRight } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';


function Home() {
    const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
    const [listening, setListening] = useState(false);
    const isSpeaking = useRef(false);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [ham, setHam] = useState(false)
    const recognitionRef = useRef(null);
    let synth = window.speechSynthesis;
    let isRecognitionRef = useRef(false);

    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            const result = axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            navigate("/signin")
            setUserData(null)
        } catch (error) {
            console.log(error)
            setUserData(null)
        }
    }

    const startRecognition = () => {
        if (!isSpeaking.current && !isRecognitionRef.current) {
            try {
                recognitionRef.current?.start();
                setListening(true);
                console.log("Recognition started");
            } catch (error) {
                console.log("Error starting recognition:", error);
            }
        }
    }
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'hi-IN'; // Set the language to Hindi
        const voices = synth.getVoices();
        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }

        isSpeaking.current = true;
        utterance.onend = () => {
            setAiText("")
            isSpeaking.current = false;
            setTimeout(() => {
                startRecognition();// delay se race condition avoid hoti hai
            }, 800);

        }
        synth.cancel();//pehle se koi speech ho tho
        synth.speak(utterance);
    }

    const handleCommand = async (data) => {
        const { type, userInput, response } = await data;
        speak(response);

        if (type === "google-search") {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
            console.log("google open")
        }
        else if (type === "youtube-search" || type === "youtube-play") {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }

        else if (type === "calculator-open") {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }
        else if (type === "instagram-open") {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.instagram.com/${query}`, '_blank');
        }
        else if (type === "facebook-open") {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.facebook.com/${query}`, '_blank');
        }

        else if (type === "weather-show") {
            const { city, temperature, description } = data;
            const weatherInfo = `The current weather in ${city} is ${temperature}°C with ${description}.`;
            speak(weatherInfo);
        }

    }

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognitionRef.current = recognition;

            let isMounted = true; //flag to avoid setState on unmounted component

            //start recognition after i second delay only if component still mounted

            const startTimeOut = setTimeout(() => {
                if (isMounted && !isSpeaking.current && !isRecognitionRef.current) {
                    try {
                        recognition.start();
                    } catch (error) {
                        if (error.name !== "InvalidStateError") {
                            console.log(error);
                        }
                    }
                }
            }, 1000);



            recognition.onstart = () => {

                isRecognitionRef.current = true;
                setListening(true);
            }
            recognition.onend = () => {
                isRecognitionRef.current = false;
                setListening(false);
                if (isMounted && !isSpeaking.current) {
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (error) {
                            if (error.name !== "InvalidStateError") {
                                console.log(error);
                            }
                        }
                    }, 1000)
                }
                setAiText("");
            }

            recognition.onerror = (event) => {
                try {
                    if (event.error !== "aborted" && !isSpeaking.current) {
                    console.log("Restarting recognition due to error:", event.error);
                    setTimeout(() => {
                        if (isMounted) {
                            try {
                                recognition.start();
                            } catch (error) {
                                if (error.name !== "InvalidStateError") {
                                    console.log(error);
                                }
                            }
                        }
                    }, 1000);
                }
                } catch (error) {                
                    console.error("Speech recognition error:", event.error);
                    isRecognitionRef.current = false;
                    setListening(false);
                }
                
            };
            recognition.onresult = async (e) => {
                const transcript = e.results[e.results.length - 1][0].transcript.trim()

                if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
                    setUserText(transcript);
                    setAiText("");
                    recognition.stop();
                    isRecognitionRef.current = false;
                    setListening(false);
                    const data = await getGeminiResponse(transcript)
                    handleCommand(data)
                    setUserText("");
                    setAiText(data.response);

                }
            }

            const fallback = setInterval(() => {
                if (!isSpeaking.current && !isRecognitionRef.current) {
                    startRecognition();
                }
            }, 10000);
            startRecognition();

            const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, I am ${userData.assistantName}. How can I help you today?`);
            greeting.lang = 'hi-IN';
            window.speechSynthesis.speak(greeting);

            return () => {
                isMounted = false;
                clearTimeout(startTimeOut);
                recognition.stop();
                setListening(false);
                isRecognitionRef.current = false;
            }
        } else {
            console.log('Speech Recognition API not supported');
        }
    }, [])

    return (
        <>
            <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030355] flex justify-center items-center flex-col gap-5 overflow-hidden'>
                <CgMenuRight className='text-white lg:hidden text-3xl absolute top-5 right-5 cursor-pointer' onClick={() => setHam(true)} />

                <div className={`absolute lg:hidden top-0 w-full h-screen bg-[#0000006f] p-5 backdrop-blur-lg flex flex-col items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
                    <RxCross1 className='text-white  text-3xl absolute top-5 right-5 cursor-pointer' onClick={() => setHam(false)} />
                    <button className='min-w-[120px] h-[40px] m-2 text-black font-semibold bg-white rounded-full text-[19px] ' onClick={handleLogOut}>Log Out</button>

                    <button className='min-w-[150px] px-1.5 mb-4 h-[40px] text-black font-semibold bg-white rounded-full text-[19px] ' onClick={() => navigate("/customize")} >Customize your Assistant</button>
                    <div className='w-full h-[2px] bg-gray-400'></div>
                    <h1 className='text-white font-semibold text-[20px]'>History</h1>

                    <div className='w-full h-[60%] overflow-auto flex flex-col overflow-y-auto'>
                        {
                            userData.history?.map((his, idx) => (
                                <span key={idx} className='text-gray-200 text-[16px] truncate'>{his}</span>
                            ))
                        }
                    </div>
                </div>

                <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute hidden lg:block top-5 right-5 ' onClick={handleLogOut}>Log Out</button>

                <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute hidden lg:block top-[100px] right-5 px-5' onClick={() => navigate("/customize")} >Customize your Assistant</button>

                <div className='w-[200px] h-[300px] flex justify-center items-center overflow-hidden rounded-4xl'>
                    <img src={userData?.assistantImage} className='h-full object-cover shadow-lg' />
                </div>
                <h1 className='text-white text-xl font-bold'>I'm  {userData?.assistantName}</h1>
                {
                    !aiText && <img src={userImage} className='w-[200px]' />
                }
                {
                    aiText && <img src={aiImage} className='w-[200px]' />
                }
                <span className='text-white text-center font-semibold text-[16px]'>{userText ? userText : aiText ? aiText : null}</span>
            </div>
        </>
    )
}

export default Home
