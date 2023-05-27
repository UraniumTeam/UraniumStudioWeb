import React, {useState, ChangeEvent} from 'react';
import "../styles/CreateNew.css";

interface CreateNewProps {
    onClose: () => void;
    onInputChange: (projectName: string) => void;
}

const CreateNew: React.FC<CreateNewProps> = ({onClose, onInputChange}) => {
    const [filename, setFilename] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFilename(file.name);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    };

    function onCreate() {
        onInputChange(projectName);
        setProjectName("");
        onClose();
    }

    return (
        <div className="createNew">
            <input value={projectName} onChange={handleInputChange} className={"box"} type="text"
                   placeholder="Введите имя проекта"/>
            <input className={"box"} type="file" onChange={handleFileChange}/>
            {/*<button className={"top-button"} onClick={onClose}>Close</button>*/}
            <button className={"top-button"} onClick={onCreate}>Create</button>
        </div>
    );
};

export default CreateNew;
