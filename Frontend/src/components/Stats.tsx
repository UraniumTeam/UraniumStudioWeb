import React from "react";
import "../styles/Project.css"

interface RectFunction {
    id: number;
    name: string;
    startPos: number;
    posY: number;
    length: number;
    color: string;
}

interface Props {
    rectangles: RectFunction[];
}

const Stats: React.FC<Props> = ({rectangles}) => {


    return (
        <div className={"stats"}>
            <table>
                <thead>
                <tr>
                    <th>Function name</th>
                    <th>StartTime(ms)</th>
                    <th>Duration(ms)</th>
                </tr>

                </thead>

                <tbody>
                {rectangles.map(rect => (
                    <tr>
                        <td>{rect.name}</td>
                        <td>{rect.startPos}</td>
                        <td>{rect.length}</td>
                    </tr>
                ))}

                </tbody>
            </table>
        </div>
    )
}
export default Stats