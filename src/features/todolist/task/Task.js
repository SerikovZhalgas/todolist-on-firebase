import {EditableSpan} from "../../../components/EditableSpan";
import {memo, useContext, useState} from "react";
import dayjs from 'dayjs';
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../../../index";
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers';

export const Task = memo((props) => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [file, setFile] = useState(props.file)
    const [date, setDate] = useState(dayjs(props.date))

    const updateTask = async () => {
        firestore.collection('task').add({
            uid: user.uid,
            taskId: props.taskId,
            title,
            description,
            status,
            file,
            date,
        })
    }

    const deleteClickHandler = () => props.removeTask(props.task.uid)
    const titleChangeHandler = (newTitle) => setTitle(newTitle)
    const descriptionChangeHandler = (newDescription) => setDescription(newDescription)
    const statusChangeHandler = (e) => setStatus(e.currentTarget.checked)
    const addFileChangeHandler = (newFile) => setFile(newFile)
    const dateChangeHandler = (newDate) => setDate(newDate);

    return <div key={props.taskId} className={status ? 'is-done' : ''}>
        <div>
            <Checkbox
                checked={status}
                color="primary"
                onChange={statusChangeHandler}
            />

            <EditableSpan value={title} onChange={titleChangeHandler}/>
            <IconButton onClick={deleteClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
        <div>
            <EditableSpan value={description} onChange={descriptionChangeHandler}/>
        </div>
        <div>
            <input/>
        </div>
        <div>
            <Stack spacing={3}>
                <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/DD/YYYY"
                    value={date}
                    onChange={dateChangeHandler}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
        </div>
        <IconButton onClick={updateTask}>
            <SaveIcon/>
        </IconButton>
    </div>
})