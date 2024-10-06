import React, { useState, useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

import "../styling/css/step.css";

const Step = ({editStepKey, handleChange, handleDelete, handleSave, index, step, toggleStepEdit}) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable(step.id);
    const textareaRef = useRef(null);
    let [stepDescription, setStepDescription] = useState(step.description);

    const style ={
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const adjustHeight = (e) =>{
        setStepDescription(e.target.value)
    }


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
                <div className='stepHeader'>
                    <span className="child1">Step {index+1}:</span>
                    <span className={`${editStepKey === index ? "hide" : "child2" }`}>{step.title}</span>
                    <textarea id={`stepTitleTextArea${index}`} name={`stepTitle${index}`} className={`${editStepKey === index ? "child2" : "hide"}`} maxlength="50"  onChange={handleChange}>{step.title}</textarea>
                    <span className={`${editStepKey === index ? "hide" : "child1 btn"}`} onClick={(e) => {toggleStepEdit(index, step.id); adjustHeight(e);}}>Edit</span>
                </div>
                <hr/>
                <p className={`${editStepKey === index ? "hide" : ""}`}>{step.description}</p>
                <textarea id={`stepDescriptionTextArea${index}`} name={`stepDescription${index}`} ref={textareaRef} className={`${editStepKey === index ? "stepsDescription-textarea" : "hide"}`} onChange={(e) => {handleChange(e); adjustHeight(e);}}>{step.description}</textarea>
            </div>
            <div className={`${editStepKey === index ? "stepCrudControl" : "hide"}`}>
                <span id={`stepsFormSave${index}`} data-step-id={step.id} className='save-btn btn' onClick={(e) => {handleSave(step.id);}}>SAVE</span>
                <span data-step-id={step.id} data-type-del="step" className="del btn" onClick={handleDelete}>DEL</span>
            </div>
        </div>
    )
}

export default Step
