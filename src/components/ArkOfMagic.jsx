import { useState } from 'react'
import ExpandableImage from './ExpandableImage'

import '../App.css'


export default function ArkOfMagic() {  
    return (
        <div className="slides">
            <div>
                <h1>
                    Ark of Magic
                </h1>
                <p>
                    Ark of magic is the biggest project I have worked on. It is a 3D, multiplayer (MOBA) game developed in Unity. I have been working on it since 2020, and it is the project with which I have learned Unity and C#. 
                    It has gone through multiple architectural changes, and I have covered almost all of the development, with some minor help from my friends.
                </p>
                <p>
                    I made this clumsy, silly video (in spanish) a while ago (2024), and its outdated, but it shows the main features of the game, while I work on something better.
                </p>
                <iframe width="420" height="315"
                    src="https://www.youtube.com/embed/dmQUedjz9g0">
                </iframe>
                <p>
                    And here some short edits somewhat more recent (2024) but still outdated:
                </p>
                <div>
                    <iframe width="170" height="315"
                        src="https://www.youtube.com/embed/X6XVrIglYpI">
                    </iframe>
                    <iframe width="170" height="315"
                        src="https://www.youtube.com/embed/oR1Zm1eNgGQ">
                    </iframe>
                    <iframe width="170" height="315"
                        src="https://www.youtube.com/embed/sPmS9PINhq8">
                    </iframe>
                </div>
            </div>
        </div>
    )
}