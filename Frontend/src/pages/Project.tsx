import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Project = () => {
    const {id} = useParams();
    
    return (
        <div>Project: {id}
            <Link to='/'>
                <button className={"top-button"}>Назад</button>
            </Link>
        </div>
    )
}

export default Project;
