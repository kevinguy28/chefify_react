import React, { useState, useEffect, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

import "../styling/css/step.css";

const Step = ({editMode, handleChange, handleDelete, handleSave, index, onFocus, step}) => {

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
        <div key={index} ref={setNodeRef} style={style} className="container stepsCard" onClick={onFocus}>
            <div {...attributes} {...listeners}>
                <div className='xpp'>
                    <span className='dd'>Step {index+1} -</span><textarea id="stepTitleTextArea" name="stepTitle" className='tt' maxlength="50"  onChange={handleChange}>{step.title}</textarea>
                </div>
                <hr/>
                <textarea id="stepDescriptionTextArea" name="stepDescription" ref={textareaRef} className={`stepsDescription-textarea ${editMode ? "" : "hide"}`} onChange={(e) => {handleChange(e); adjustHeight(e);}}>{step.description}</textarea>
            </div>
            <div className='stepCrudControl'>
                <span id="stepsFormSave" data-step-id={step.id} className='save-btn btn' onClick={(e) => {onFocus(e);handleSave(e);}}>SAVE</span>
                <span data-step-id={step.id} data-type-del="step" className="del btn" onClick={handleDelete}>DEL</span>
            </div>
        </div>
    )
}

export default Step
