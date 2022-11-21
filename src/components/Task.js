import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {useContext, useState} from "react";
import {Delete, Save} from '@mui/icons-material';
import dayjs from 'dayjs';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../index";
import TextField from "@mui/material/TextField";

export const Task = React.memo((props) => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [file, setFile] = useState(props.file)
    const [date, setDate] = React.useState(dayjs(props.date))

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
                <Delete/>
            </IconButton>
        </div>
        <div>
            <EditableSpan value={description} onChange={descriptionChangeHandler}/>
        </div>
        <div>
            <Input />
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
            <Save/>
        </IconButton>
    </div>
})