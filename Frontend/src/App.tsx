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
            try {
                APIClient.post<Project>('/api/Projects/Create',
                    {
                        id: counter,
                        name: projectName
                    }).then(() => {
                    getProjects()
                })
                counter += 1;
                console.log(`Project with Name ${projectName} has been created.`);
            } catch
                (error) {
                console.error(error);
            }
        }
    }

    const handleDeleteProject = (project: Project) => {
        try {
            APIClient.delete<Project>('/api/Projects/Delete', {
                data: {
                    id: project.id,
                    name: project.name
                }
            })
                .then(() => getProjects());
            console.log(`Project with ID ${project.id} has been deleted.`);
        } catch (error) {
            console.error(error);
        }
    }
    const handleUpdateProject = (project: Project) => {
        const newProjectName = prompt('Введите новое имя проекта');

        if (newProjectName && newProjectName !== " ") {
            try {
                APIClient.put<Project>('/api/Projects/Update',
                    {
                        id: project.id,
                        name: newProjectName
                    })
                    .then(() => getProjects())
                console.log(`Project with ID ${project.id} has been updated.`);
            } catch (error) {
                console.error(error);
            }
        }
    }

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

                        <li className="project" key={project.name}>
                            <Link to={`/project/${project.name}`} className={"link"}>
                                {project.name}
                            </Link>
                            <button className={"update-button"} onClick={() => handleUpdateProject(project)}/>
                            <button className={"delete-button"} onClick={() => handleDeleteProject(project)}/>
                        </li>

                    ))}
                </ul>

            </main>
        </div>
    );
};

export default App;
