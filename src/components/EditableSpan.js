import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

export const EditableSpan = React.memo(function (props) {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} size={'small'}/>
        : <span onDoubleClick={activateEditMode}><strong>{props.value}</strong></span>
});
