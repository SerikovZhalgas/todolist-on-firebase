import {EditableSpan} from "../../../components/EditableSpan";
import {memo, useContext, useEffect, useState} from "react";
import {Context} from "../../../index";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import dayjs from "dayjs";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {CloudUpload} from "@mui/icons-material";
import {isEmpty, storageErrors} from "../../../utils/functions";

export const Task = memo((props) => {
    const {db, storage} = useContext(Context)
    const storageRef = storage.ref()
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [dateEnd, setDateEnd] = useState(dayjs(props.dateEnd))
    const [fileUrl, setFileUrl] = useState('')

    useEffect(() => {
        storageRef.child(`files/${props.fileName}`).getDownloadURL()
            .then((url) => {
                setFileUrl(url)
            })
            .catch((error) => {
                storageErrors(error)
            });
    }, [props.fileName])

    const deleteClickHandler = () => props.removeTask(props.id)
    const titleChangeHandler = (newTitle) => {
        db.doc(`todolists/${props.id}`).update({
            title: newTitle
        }).then(() => {
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
    const dateChangeHandler = (e) => {
        const newDate = e.$d.toISOString()
        db.doc(`todolists/${props.id}`).update({
            dateEnd: newDate
        })
        setDateEnd(dayjs(newDate));
    }
    const uploadHandler = (e) => {
        if (e.target.files && e.target.files.length) {
            const file = e.target.files[0]
            console.log('file: ', file)
            const newFileRef = storageRef.child(`files/${file.name}`)
            newFileRef.putString(file).then(() => {
                console.log('Uploaded!');
            });
            db.doc(`todolists/${props.id}`).update({
                fileName: file.name
            })
            storageRef.child(`files/${file.name}`).getDownloadURL()
                .then((url) => {
                    setFileUrl(url)
                })
                .catch((error) => {
                    storageErrors(error)
                });
        }
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
        {
            !isEmpty(fileUrl) &&
            <div>
                <a href={fileUrl}>Скачать на файл</a>
            </div>
        }
        <label>
            <input
                type="file"
                onChange={uploadHandler}
                style={{display: 'none'}}
            />
            <IconButton component='span'>
                <CloudUpload/>
            </IconButton>
        </label>
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