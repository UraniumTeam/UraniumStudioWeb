import React from 'react';
import {Link, useParams} from 'react-router-dom';

import '../styles/Project.css'
import stats from "../components/Stats";

const Project = () => {
    const {id} = useParams();

    const statsButtonClick = () => {
        stats();
    }

    return (
        <div id="wrapper" className="App">
            <header aria-orientation={"vertical"}>
                <h2>Project: {id}</h2>
            </header>

            <main className={"profiling-window"}>
                <button className={"stats-button"} onClick={statsButtonClick}>Stats</button>
            </main>
            <footer>
                <Link to='/'>
                    <button className={"back-button"}>Back</button>
                </Link>
            </footer>
        </div>
    )
}

export default Project;
