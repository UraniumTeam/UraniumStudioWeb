import React from 'react';
import {useParams, useNavigate} from "react-router-dom";

const Project = () => {

    const {id} = useParams();
    const navigate = useNavigate();

    return (
        <div>Project: {id}
            <button className={"top-button"} onClick={() => navigate("/")}>Назад</button>
        </div>
    )
}

export default Project;