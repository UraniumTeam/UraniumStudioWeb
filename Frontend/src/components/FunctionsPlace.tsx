import React, {useEffect, useRef, useState} from 'react';
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
    const [scaleX, setScaleX] = useState(1);
    const textLayerRef = useRef<any>(null);

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

    useEffect(() => {
        const textLayer = textLayerRef.current;
        if (textLayer) {
            textLayer.scaleX(1 / scaleX);
        }
    }, [scaleX]);

    const handleFunctionClick = (e: any) => {
        console.log(e.target.element);
    }

    return (
        <Stage width={parent.innerWidth} height={parent.innerHeight} draggable={true} scaleX={scaleX} dragDistance={5}
               onDragMove={handleDragMove}
               className={"functionsPlace"}>
            {/*<Line />*/}
            <Layer>
                {rectangles.map((rectangle, index) => (
                    <React.Fragment key={index}>
                        <Rect
                            x={rectangle.startPos}
                            y={rectangle.posY}
                            cornerRadius={3}
                            width={rectangle.length}
                            height={funcHeight}
                            fill={rectangle.color}
                            onClick={handleFunctionClick}
                        />
                        <Text
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
            <Layer ref={textLayerRef} listening={false}/>
        </Stage>
    );
};

export default FunctionsPlace;