import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const App = () => {
    // локальная переменная. Выгружается после перезагрузки страницы или редиректе. Fix it
    const [projects, setProjects] = useState<string[]>([]);

    const handleCreateProject = () => {
        const projectName = prompt('Введите имя нового проекта:');
        if (projectName) {
            setProjects([...projects, projectName]);
        }
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
                <button className={"top-button"} disabled={!projects.length}>Open Project</button>

                <ul className={"project-side"}>
                    {projects.map((projectName) => (
                        <Link to={`/project/${projectName}`}>
                            <li className="project" key={projectName}>
                                {projectName}
                            </li>
                        </Link>
                    ))}
                </ul>

            </main>
        </div>
    );
};

export default App;
