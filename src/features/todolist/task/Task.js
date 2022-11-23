import {EditableSpan} from "../../../components/EditableSpan";
import {memo, useContext, useState} from "react";
import {Context} from "../../../index";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import dayjs from "dayjs";

export const Task = memo((props) => {
    const {auth, db} = useContext(Context)
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [file, setFile] = useState(props.file)
    const [dateEnd, setDateEnd] = useState(dayjs(props.dateEnd.nanoseconds))

    console.log(dateEnd)
    const deleteClickHandler = () => props.removeTask(props.task.uid)
    const titleChangeHandler = (newTitle) => {
        db.doc(`todolists/${props.id}`).update({
            title: newTitle
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
        db.collection(`todolists/${props.id}`).update({
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

        </div>
    </div>
})