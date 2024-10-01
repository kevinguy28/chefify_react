import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from "@dnd-kit/utilities";

const Step = ({order, title, description, id, index}) => {

    let {user, getCsrfToken, authTokens} = useContext(AuthContext);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style ={
        transition,
        transform: CSS.Transform.toString(transform)
    };

    const handleDelete = (e) => {
        e.stopPropagation();  // Prevent drag action
        console.log("Delete button clicked!");
    };

    return (
        <div key={index} ref={setNodeRef} style={style} className='container stepsCard'>
            <h1 {...attributes} {...listeners} className="header-font-size">Step {index+1} {title && <span> - {title}</span>}</h1>
            <span data-step-id={id} data-type-del="step" className="del-btn" onClick={handleDelete}>DEL</span><hr/>
            <p className="stepsDescription">{description}</p>
        </div>
    )
}

export default Step
