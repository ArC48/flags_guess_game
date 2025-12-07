import { useEffect, useRef, useState } from 'react'
import {COUNTRY_CODES_EN, COUNTRY_CODES_KA} from '../country_codes.js'
import './guess_flag.css'
import CenteredModal from './modal.js';

const countries_en = COUNTRY_CODES_EN;
const countries_ka = COUNTRY_CODES_KA;

function GuessFlag() { 
    const [currentLanguage, setCurrentLanguage] = useState("gb");
    const [currentCountry, setCurrentCountry] = useState(countries_en[Math.floor(Math.random() * COUNTRY_CODES_EN.length)]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessed, setGuessed] = useState(false);
    const [enterPress, setEnterPress] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("")
    const [score, setScore] = useState(0);

    const handleLanguageChange = () => {
        setCurrentLanguage(prev => prev === "gb" ? "ge" : "gb")
    }

    const checkAnswer = () => {
        if (currentGuess.length < currentCountry.name.length) {
            console.log(currentGuess, currentCountry.name);
            let message = ""
            if(currentLanguage === "gb") {
                message = "Fill all the tiles!"
            } else {
                message = "შეავსე ყველა უჯრა!"
            }
            setModalText(message);
            setShowModal(true);
            return;
        }
        const isCorrect = currentGuess?.toLowerCase() === currentCountry?.name?.toLowerCase();
        setGuessed(isCorrect);
        setEnterPress(true);
        if(isCorrect) {
            setScore(prev => prev + 10);

        }
        return;
    }

    const renderNextFlag = () => {
        let nextCountry = ""
        if(currentLanguage == "ge") {
            nextCountry = countries_ka[Math.floor(Math.random() * COUNTRY_CODES_KA.length)];
        }
        else {
            nextCountry = countries_en[Math.floor(Math.random() * COUNTRY_CODES_EN.length)];
        }
        setCurrentCountry(nextCountry);
        setCurrentGuess("");
        setEnterPress(false);
    }

    useEffect(() => {
      const translateLanguage = (language, code) => {
        setCurrentGuess("")
        setEnterPress(false)
        if(language === "ge") {
            const countryObj = countries_ka.find(c => c.code === code)
            setCurrentCountry(countryObj)
        }
        else {
            const countryObj = countries_en.find(c => c.code === code)
            setCurrentCountry(countryObj)
        }
      }
    
      translateLanguage(currentLanguage, currentCountry.code)
    }, [currentLanguage])

    useEffect(() => {
        const keyDownHandle = (e) => {
            const key = e.key

            if (key == "Backspace") {
                setCurrentGuess(prev => prev.slice(0, -1))
                return;
            }
            else if (key == "Enter") checkAnswer();

            if (/^[a-zA-Z\u10A0-\u10FF ]$/.test(key)) {
                setCurrentGuess(prev => prev + key);
              }

        }

        document.addEventListener("keydown", keyDownHandle)
        return () => document.removeEventListener("keydown", keyDownHandle)
    }, [currentGuess])
    


  return (
    <div className="center">
        <div>
            <p>{currentLanguage === "ge" ? "ქულა:" : 'score:'} {score}</p>
            <button onClick={(e) => {
                handleLanguageChange();
                e.currentTarget.blur();
                    }
                } 
            className='language_btn'
            >
                <img src={`https://flagfeed.com/flags/${currentLanguage.toUpperCase()}`} className='language_img'/>
                <p>{currentLanguage === "ge" ? "ქართული" : 'English'}</p>
            </button>
        </div>
        <img
            src={`https://flagfeed.com/flags/${currentCountry.code}`}
            alt={`${currentCountry.code.toUpperCase()} Flag`}
            width={312}
            height={312}
            className='flag-picture'
        />
        <CenteredModal isOpen={showModal} onClose={() => setShowModal(false)} message={modalText}/>

        <div className='tiles'>
            <GuessTiles countryName={currentCountry.name} currentGuess={currentGuess || ""} final={enterPress} guessed={guessed}/>
        </div>

        <button onClick={() => checkAnswer()} className='check-btn'>
            {currentLanguage === "ge" ? "შემოწმება" : 'Check'}

        </button>
        <button onClick={(e) => {
                renderNextFlag()
                e.currentTarget.blur()
                }
            } >
            {currentLanguage === "ge" ? "შემდეგი" : 'next'}
        </button>
            
    </div>
  );
}

function GuessTiles({ countryName, currentGuess, final, guessed }) {
    const tiles = [];
    const firstEmpty = currentGuess.length;
    let cls = "tile";
    if (final) {
        if (guessed) {
            cls += " success";
        }
        else {
            cls += " fail";
        }
    }
    for (let i =0; i < countryName.length; i++){
        if (i == firstEmpty){
            tiles.push(<div key={i} className='tile'>
                <div className="cursor"></div>
            </div>)
            continue;
        }
        tiles.push(<div key={i} className={cls}>{currentGuess[i]}</div>)
    }

    return (
        tiles
    )
}



export default GuessFlag;