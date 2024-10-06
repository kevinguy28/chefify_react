import React, { useState, useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

import "../styling/css/step.css";

const Step = ({editMode, handleChange, handleDelete, handleSave, index, step}) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable(step.id);
    const textareaRef = useRef(null);
    let [stepDescription, setStepDescription] = useState(step.description);

    const style ={
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const adjustHeight = (e) =>{
        console.log(e.target.value)
        setStepDescription(e.target.value)
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          // Reset the height so that shrinking works when content is reduced
          textarea.style.height = 'auto';
          // Set the height based on the scrollHeight, which is the full height of the content
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [stepDescription]); // Re-run the effect when the value changes

    return (
        <div key={index} ref={setNodeRef} style={style} className="container stepsCard">
            <div {...attributes} {...listeners}>
                <h1 className="header-font-size">Step {index+1} {step.title && <span> - {step.title}</span>}</h1>
                <hr/>
                <textarea name="stepDescription" ref={textareaRef} className={`stepsDescription-textarea ${editMode ? "" : "hide"}`} onChange={(e) => {handleChange(e); adjustHeight(e);}}>{step.description}</textarea>
            </div>
            <div className='stepCrudControl'>
                <span id="stepsFormSave" data-step-id={step.id} className='save-btn btn' onClick={handleSave}>SAVE</span>
                <span data-step-id={step.id} data-type-del="step" className="del btn" onClick={handleDelete}>DEL</span>
            </div>
        </div>
    )
}

export default Step
