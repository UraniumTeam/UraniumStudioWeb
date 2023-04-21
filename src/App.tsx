import React, { useState} from 'react';
import {useNavigate} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

const App = () => {
    // локальная переменная. Выгружается после перезагрузки страницы или редиректе. Fix it
    const [projects, setProjects] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleCreateProject = () => {
        const projectName = prompt('Введите имя нового проекта:');
        if (projectName) {
            setProjects([...projects, projectName]);
        }
    };

    function handleOpenProject(projectName: string) {
        //alert(`Открыт проект "${projectName}"`)
        //localStorage.setItem(projectName, projects);
        navigate('/project/' + projectName);

    };

    return (
        <div id="wrapper" className="App">

            <header><h1>Uranium Studio</h1></header>
            <aside>
                <p>
                    <button className={"menu-button"}>Projects</button>
                </p>
                <p>
                    <button className={"menu-button"}>Settings</button>
                </p>
            </aside>
            <main>
                <button className={"top-button"} onClick={handleCreateProject}>Create Project</button>
                <button className={"top-button"} disabled={(!projects.length)}>Open Project</button>

                <ul className={"project-side"}>
                    {projects.map((projectName) => (
                        <li className="project" key={projectName} onClick={() => handleOpenProject(projectName)}>
                            {projectName}
                        </li>
                    ))}
                </ul>

            </main>
        </div>
    );
}

export default App;
