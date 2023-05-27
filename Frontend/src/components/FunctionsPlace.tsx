import React, {useEffect, useRef, useState} from 'react';
import {Stage, Layer, Rect, Text, Line} from 'react-konva';

interface RectFunction {
    id: number;
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
    const [scaleX, setScaleX] = useState(1);
    const [selectedRectId, setSelectedRectId] = useState<number | null>(null);
    const [selectedRect, setSelectedRect] = useState<RectFunction | null>(null);

    const handleDragMove = (e: any) => {
        let newX = e.target.x();
        e.target.y(0);
        e.target.x(newX);
    };

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            const scaleChange = event.deltaY > 0 ? 0.8 : 1.2;
            setScaleX(prevScaleX => prevScaleX * scaleChange);
        };

        window.addEventListener('wheel', handleWheel, {passive: false});

        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    const handleFunctionClick = (id: number) => {
        setSelectedRectId(id);
        const rect = rectangles.find(rect => rect.id === id)
        if (rect) setSelectedRect(rect);
    }

    return (
        <Stage width={parent.innerWidth} height={parent.innerHeight} draggable={true} scaleX={scaleX} dragDistance={5}
               onDragMove={handleDragMove}
               className={"functionsPlace"}>
            {/*<Line />*/}
            <Layer>
                {rectangles.map((rectangle, index) => (
                    <React.Fragment key={rectangle.id}>
                        <Rect
                            x={rectangle.startPos}
                            y={rectangle.posY}
                            cornerRadius={3}
                            width={rectangle.length}
                            height={funcHeight}
                            fill={rectangle.color}
                            stroke={rectangle.id === selectedRectId ? 'black' : 'transparent'}
                            onClick={() => handleFunctionClick(rectangle.id)}
                        />
                        <Text listening={false}
                              key={index}
                              text={rectangle.name}
                              x={rectangle.startPos}
                              y={rectangle.posY}
                              width={rectangle.length * scaleX}
                              align="center"
                              verticalAlign="middle"
                              padding={5}
                              fontSize={14}
                              scaleX={1 / scaleX}
                              wrap={"none"}
                              ellipsis={true}
                              overflow="ellipsis"
                        />
                    </React.Fragment>))}
            </Layer>
        </Stage>
    );
};

export default FunctionsPlace;