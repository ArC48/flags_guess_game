import { useEffect, useState } from 'react'
import {COUNTRY_CODES_EN, COUNTRY_CODES_KA} from '../country_codes.js'
import './guess_flag.css'

const countries_en = COUNTRY_CODES_EN;
const countries_ka = COUNTRY_CODES_KA;

function GuessFlag() { 
    const [currentLanguage, setCurrentLanguage] = useState("gb");
    const [currentCountry, setCurrentCountry] = useState(countries_en[Math.floor(Math.random() * COUNTRY_CODES_EN.length)]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessed, setGuessed] = useState(false);
    const [enterPress, setEnterPress] = useState(false);

    const handleLanguageChange = () => {
        setCurrentLanguage(prev => prev === "gb" ? "ge" : "gb")
    }

    const checkAnswer = () => {
        const isCorrect = currentGuess?.toLowerCase() === currentCountry?.name?.toLowerCase();
        setGuessed(isCorrect);
        setEnterPress(true);
        return;
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
        <img
            src={`https://flagfeed.com/flags/${currentCountry.code}`}
            alt={`${currentCountry.code.toUpperCase()} Flag`}
            width={312}
            height={312}
            className='flag-picture'
        />
        {/* <p>{currentCountry.name}</p> */}

        <div className='tiles'>
            <GuessTiles countryName={currentCountry.name} currentGuess={currentGuess || ""} final={enterPress} guessed={guessed}/>
        </div>

        <button onClick={() => checkAnswer()} className='check-btn'>
            {currentLanguage === "ge" ? "შემოწმება" : 'Check'}
        </button>
    </div>
  );
}

function GuessTiles({ countryName, currentGuess, final, guessed }) {
    const tiles = [];
    const firstEmpty = currentGuess.length;
    let cls = "tile";
    if (final) {
        console.log(guessed);
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