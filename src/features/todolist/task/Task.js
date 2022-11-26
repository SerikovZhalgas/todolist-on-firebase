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
import styles from './Task.module.scss'

export const Task = memo((props) => {
    const {db, storage} = useContext(Context)
    const storageRef = storage.ref()
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [status, setStatus] = useState(props.status)
    const [dateEnd, setDateEnd] = useState(dayjs(props.dateEnd))
    const [fileUrl, setFileUrl] = useState('')
    const [endText, setEndText] = useState('')

    useEffect(() => {
        storageRef.child(`files/${props.fileName}`).getDownloadURL()
            .then((url) => {
                setFileUrl(url)
            })
            .catch((error) => {
                storageErrors(error)
            });
        if(dayjs().format('DD-MM-YY') >= dateEnd.format('DD-MM-YY')){
            statusChangeHandler(true)
            setEndText('Истек срок выполнения :(')
        }
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
    const statusChangeHandler = (newStatus) => {
        db.doc(`todolists/${props.id}`).update({
            status: newStatus
        })
        setStatus(newStatus)
        setEndText('')
    }
    const dateChangeHandler = (e) => {
        const newDate = e.$d.toISOString()
        db.doc(`todolists/${props.id}`).update({
            dateEnd: newDate
        })
        setDateEnd(dayjs(newDate));
        setEndText('')
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

    return <div key={props.taskId} className={`${styles.taskBlock} ${status ? styles.taskDone : ''}`}>
        <div className={styles.titleBlock}>
            <Checkbox
                checked={status}
                color="primary"
                onChange={(e)=>statusChangeHandler(e.currentTarget.checked)}
            />
            <EditableSpan value={title} onChange={titleChangeHandler}/>
            <IconButton onClick={deleteClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
        {
            <div className={styles.endText}>
                {endText}
            </div>
        }
        <div>
            <span>Описание: </span>
            <EditableSpan value={description} onChange={descriptionChangeHandler}/>
        </div>
        {
            !isEmpty(fileUrl) &&
            <div>
                <span>Ссылка на файл: </span>
                <a href={fileUrl}>{props.fileName}</a>
            </div>
        }
        <label>
            <span>Прикрепить файл: </span>
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
                        label="Дата завершения"
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