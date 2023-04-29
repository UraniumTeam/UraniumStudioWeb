import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './styles/App.css';
import APIClient from "./ApiClient";

interface Project {
    id: number;
    name: string;
}

const App = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    let counter: number = 0;

    function getProjects() {
        APIClient.get<Project[]>('/api/Projects/Get')
            .then((response) => setProjects(response.data))
    }

    useEffect(() => {
        getProjects()
    }, [counter])

    const handleCreateProject = () => {
        const projectName = prompt('Введите имя нового проекта:');
        if (projectName && projectName !== " ") {
            APIClient.post<Project>('/api/Projects/Create',
                {
                    id: counter,
                    name: projectName
                }).then(() => {
                getProjects()
            })
            counter += 1;
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
                    {projects.map((project) => (
                        <Link to={`/project/${project.name}`}>
                            <li className="project" key={project.name}>
                                {project.name}
                            </li>
                        </Link>
                    ))};
                </ul>

            </main>
        </div>
    );
};

export default App;
