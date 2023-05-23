import React from 'react';
import {Stage, Layer, Rect, Text, Line} from 'react-konva';

interface RectFunction {
    name: string;
    startPos: number;
    posY: number;
    length: number;
    color: string;
}

const funcHeight: number = 30;

interface Props {
    rectangles: RectFunction[];
}

const FunctionsPlace: React.FC<Props> = ({rectangles}) => {

    const maxLength = Math.max(...rectangles.map(rect => rect.startPos + rect.length));

    const handleDragMove = (e: any) => {
        let newX = e.target.x();
        e.target.y(0);
        e.target.x(newX);
    };

    const handleFunctionClick = (e : any) => {
        console.log(e.target.element);
    }

    return (
        <Stage width={parent.innerWidth} height={parent.innerHeight} draggable={true} dragDistance={5}
               onDragMove={handleDragMove}
               className={"functionsPlace"}>
            {/*<Line />*/}
            <Layer>
                {rectangles.map((rect, index) => (
                    <React.Fragment key={index}>
                        <Rect
                            x={rect.startPos}
                            y={rect.posY}
                            cornerRadius={3}
                            width={rect.length}
                            height={funcHeight}
                            fill={rect.color}
                            onClick={handleFunctionClick}
                        />
                        <Text
                            x={rect.startPos + 5}
                            width={rect.length}
                            y={rect.posY + 10}
                            text={rect.name}
                            fontSize={14}
                            fontFamily="Arial"
                            fill="#000"
                            wrap={"none"}
                        />
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
    );
};

export default FunctionsPlace;