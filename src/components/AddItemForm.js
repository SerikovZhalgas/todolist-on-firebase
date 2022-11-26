import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';

export const AddItemForm = React.memo(function ({addItem, disabled = false}) {
    let [title, setTitle] = useState('')
    let [error, setError] = useState(null)

    const addItemHandler = () => {
        if (title.trim() !== '') {
            addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItemHandler();
        }
    }

    return <div>
        <TextField variant="outlined"
                   disabled={disabled}
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Заголовок"
                   helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
            <AddBoxIcon/>
        </IconButton>
    </div>
})
