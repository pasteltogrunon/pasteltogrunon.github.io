import { useState } from 'react'
import linkedInLogo from '../assets/linkedin.png'
import mailLogo from '../assets/mail.png'
import githubLogo from '../assets/github.png'

import '../App.css'


export default function Lobby() {  
    const [count, setCount] = useState(0)

    return (
        <div className="slides">
            <div>
            <a href="https://www.linkedin.com/in/jfernandezes/" target="_blank">
                <img src={linkedInLogo} className="logo linkedin" alt="Linkedin logo" />
            </a>
            <a href="https://github.com/pasteltogrunon" target="_blank">
                <img src={githubLogo} className="logo github" alt="Github logo" />
            </a>
            <a href="mailto: juanfernandezesteban@gmail.com" target="_blank">
                <img src={mailLogo} className="logo mail" alt="Mail logo" />
            </a>
            </div>
            <h1>ElPasteltoGrunon</h1>
        </div>
    )
}