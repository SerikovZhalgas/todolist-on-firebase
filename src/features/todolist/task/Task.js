import {EditableSpan} from "../../../components/EditableSpan";
import {memo, useContext, useState} from "react";
import {Context} from "../../../index";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import dayjs from "dayjs";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const Task = memo((props) => {
    const {auth, db} = useContext(Context)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [file, setFile] = useState(props.file)
    const [dateEnd, setDateEnd] = useState(dayjs(props.dateEnd))

    const deleteClickHandler = () => props.removeTask(props.task.uid)
    const titleChangeHandler = (newTitle) => {
        db.doc(`todolists/${props.id}`).update({
            title: newTitle
        }).then(()=>{
            console.log("Doc did updated")
        })
        setTitle(newTitle)
    }
    const descriptionChangeHandler = (newDescription) => {
        db.doc(`todolists/${props.id}`).update({
            description: newDescription
        })
        setDescription(newDescription)
    }
    const statusChangeHandler = (e) => {
        db.doc(`todolists/${props.id}`).update({
            status: e.currentTarget.checked
        })
        setStatus(e.currentTarget.checked)
    }
    const addFileChangeHandler = (newFile) => {
        db.doc(`todolists/${props.id}`).update({
            file: newFile
        })
        setFile(newFile)
    }
    const dateChangeHandler = (newDate) => {
        db.doc(`todolists/${props.id}`).update({
            dateEnd: newDate
        })
        setDateEnd(newDate);
    }

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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                    <DesktopDatePicker
                        label="Date desktop"
                        inputFormat="MM/DD/YYYY"
                        value={dateEnd}
                        onChange={dateChangeHandler}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
            </LocalizationProvider>
        </div>
    </div>
})