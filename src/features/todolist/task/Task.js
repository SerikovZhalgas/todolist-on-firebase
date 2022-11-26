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

/**
 * Компонента реализует отображение, обновление данных. Также подключена обертывающая копмонента высшего порядка "memo", которая следит за входящими данными и предотвращает лишний ререндер компоненты.
 * @type {React.NamedExoticComponent<{readonly taskFileName?: *, readonly removeTask?: *, readonly taskDescription?: *, readonly taskDateEnd?: *, readonly taskTitle?: *, readonly taskId?: *, readonly taskStatus?: *}>}
 */
export const Task = memo(({taskId, taskTitle, taskDescription, taskStatus, taskFileName, taskDateEnd, removeTask}) => {
    const {db, storage} = useContext(Context)
    const storageRef = storage.ref()
    const [title, setTitle] = useState(taskTitle)
    const [description, setDescription] = useState(taskDescription)
    const [status, setStatus] = useState(taskStatus)
    const [dateEnd, setDateEnd] = useState(dayjs(taskDateEnd))
    const [fileUrl, setFileUrl] = useState('')
    const [endText, setEndText] = useState('')
    /**
     * useEffect асинронно выполняет коллбэк функцию при вмонтировании компоненты и далее только при изменении переменных переданных в массив зависимостей.
     */
    useEffect(() => {
        /**
         * Передает в хук useState ссылку на файл конкретной задачи.
         */
        storageRef.child(`files/${taskFileName}`).getDownloadURL()
            .then((url) => {
                setFileUrl(url)
            })
            .catch((error) => {
                storageErrors(error)
            });
        /**
         * Проверка на выполнение задания в установленный срок.
         */
        if(dayjs().format('DD-MM-YY') >= dateEnd.format('DD-MM-YY')){
            statusChangeHandler(true)
            setEndText('Истек срок выполнения :(')
        }
    }, [taskFileName])
    /**
     * Функция по удалению задачи, передает идентификатор задачи в коллбэк функцию removeTask
     * @returns {*}
     */
    const deleteClickHandler = () => removeTask(taskId)
    /**
     * Асинхронная функция обновляет заголовок задачи
     * @param newTitle Новый заголовок
     */
    const titleChangeHandler = async (newTitle) => {
        try {
            await db.doc(`todolists/${taskId}`).update({
                title: newTitle
            }).then(() => {
                console.log("Doc did updated")
            })
            setTitle(newTitle)
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * Асинхронная функция обновляет описание задачи
     * @param newDescription Новое описание
     */
    const descriptionChangeHandler = async (newDescription) => {
        try {
            await db.doc(`todolists/${taskId}`).update({
                description: newDescription
            })
            setDescription(newDescription)
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * Асинхронная функция обновляет статус задачи (чекбокс)
     * @param newStatus Новый статус
     */
    const statusChangeHandler = async (newStatus) => {
        try {
            await db.doc(`todolists/${taskId}`).update({
                status: newStatus
            })
            setStatus(newStatus)
            setEndText('')
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * Асинхронная функция обновляет дату завершения задачи. Преобразуем входящее событие, доставая значение ключа $d формата utс.
     * @param e Объект события
     */
    const dateChangeHandler = async (e) => {
        try {
            const newDate = e.$d.toISOString()
            await db.doc(`todolists/${taskId}`).update({
                dateEnd: newDate
            })
            setDateEnd(dayjs(newDate));
            setEndText('')
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * Асинхронная функция обновляет название файла задачи и выгружает в Storage новый прикрепленный файл.
     * @param e Объект события
     */
    const uploadHandler = async (e) => {
        if (e.target.files && e.target.files.length) {
            const file = e.target.files[0]
            try {
                /**
                 * сначала создается ссылка/путь на будущий файл, затем выгружается файл по ссылке
                 */
                const newFileRef = storageRef.child(`files/${file.name}`)
                await newFileRef.putString(file).then(() => {
                    console.log('Uploaded!');
                });
                await db.doc(`todolists/${taskId}`).update({
                    fileName: file.name
                })
                await storageRef.child(`files/${file.name}`).getDownloadURL()
                    .then((url) => {
                        setFileUrl(url)
                    })
                    .catch((error) => {
                        storageErrors(error)
                    });
            }catch (e) {
                console.log(e)
            }
        }
    }

    return <div key={taskId} className={`${styles.taskBlock} ${status ? styles.taskDone : ''}`}>
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
                <a href={fileUrl}>{taskFileName}</a>
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