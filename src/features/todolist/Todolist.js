import {useAuthState} from "react-firebase-hooks/auth";
import {useCallback, useContext} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {AddItemForm} from "../../components/AddItemForm";
import {Task} from "./task/Task";
import {Context} from "../../index";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {useNavigate} from "react-router-dom";
import {PATH} from "../../components/AppRouter";
import {Loading} from "../../components/Loading";
import {v1} from "uuid";
import firebase from "firebase";
import styles from './Todolist.module.scss'
import dayjs from "dayjs";

/**
 * Компонента достает из контекста firestore storage в виде переменной db и обращаюясь к коллекции достает таски, паралельно сортируя по дате создания.
 * @returns {JSX.Element}
 * @constructor
 */
export const Todolist = () => {
    const navigate = useNavigate()
    const {auth, db} = useContext(Context)
    const [user] = useAuthState(auth)
    const todolistsRef = db.collection('todolists')
    const [tasks, loading] = useCollectionData(
        todolistsRef.orderBy('createdAt')
    )
    /**
     * Функция создает новую задачу принимая заголовок и помещая некоторые начальные данные в стандартные поля:
     * id пользователя, id задачи, заголовок, описание, статус, дата завершения, имя файла, дата создания.
     * @param title Заголовок
     */
    const addTask = (title) => {
        const taskId=v1();
        todolistsRef.doc(taskId).set({
            userId: user.uid,
            taskId,
            title,
            description: 'Напиши меня',
            status: false,
            dateEnd: dayjs().add(1, 'day').format(),
            fileName: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    /**
     * Функция удаления задачи
     * @param id Индектификатор задачи
     */
    const deleteTask = (id) => {
        db.doc(`todolists/${id}`).delete()
    }

    //Перенаправление на страницу загрузки загрузке коллекции.
    if (loading) {
        return <Loading/>
    }

    //Условие перенаправления не залогининого Пользователя на страницу логинизации.
    if (user==null) {
        navigate(PATH.LOGIN)
    }

    return (
        <div className={styles.todolistBlock}>
            <Grid container>
                <AddItemForm addItem={addTask} disabled={loading}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    tasks.map(t => {
                        return <Grid item key={t.taskId}>
                            <Paper style={{padding: '10px'}} variant={'outlined'}>
                                <Task
                                    taskId={t.taskId}
                                    taskTitle={t.title}
                                    taskDescription={t.description}
                                    taskStatus={t.status}
                                    taskFileName={t.fileName}
                                    taskDateEnd={t.dateEnd}
                                    removeTask={deleteTask}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </div>
    )
}