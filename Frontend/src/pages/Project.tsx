import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import '../styles/Project.css'
import Stats from "../components/Stats";
import FunctionsPlace from "../components/FunctionsPlace";

interface RectFunction {
    id: number;
    name: string;
    startPos: number;
    posY: number;
    length: number;
    color: string;
}

const Project = () => {
    const {id} = useParams();
    const [showStats, setShowStats] = useState<boolean>(false);
    const [rectFunctions, setRectFunctions] = useState<RectFunction[]>([
        {id: 0, name: "testFunc", startPos: 0, posY: 0, length: 180, color: 'orange'},
        {id: 1, name: "testFunc", startPos: 60, posY: 30, length: 120, color: 'orange'},
        {id: 2, name: "testFunc", startPos: 120, posY: 60, length: 60, color: 'orange'},

        {id: 3, name: "testFunc", startPos: 180, posY: 0, length: 180, color: 'orange'},
        {id: 4, name: "testFunc", startPos: 240, posY: 30, length: 120, color: 'orange'},
        {id: 5, name: "testFunc", startPos: 300, posY: 60, length: 60, color: 'orange'},

        {id: 6, name: "testFunc", startPos: 360, posY: 0, length: 180, color: 'orange'},
        {id: 7, name: "testFunc", startPos: 420, posY: 30, length: 120, color: 'orange'},
        {id: 8, name: "testFunc", startPos: 480, posY: 60, length: 60, color: 'orange'},
    ]);

    const getRectFunctions = () => {

    }

    const statsButtonClick = () => {
        if (!showStats)
            setShowStats(true);
        else
            setShowStats(false)
    }

    return (
        <div className="App">
            <div id="wrapper">
                <header aria-orientation={"vertical"}>
                    <h2>Project: {id}</h2>
                </header>

                <main className={"profiling-window"}>
                    <FunctionsPlace rectangles={rectFunctions}/>
                    {(showStats &&
                        <Stats rectangles={rectFunctions}/>
                    )}
                    <button className={"stats-button"} onClick={statsButtonClick}>Stats</button>
                </main>

                <footer>
                    <Link to='/'>
                        <button className={"back-button"}>Back</button>
                    </Link>
                </footer>
            </div>
        </div>
    )
}

export default Project;
