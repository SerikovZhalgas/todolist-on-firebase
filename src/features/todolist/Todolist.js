import {useAuthState} from "react-firebase-hooks/auth";
import {useContext} from "react";
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

export const Todolist = () => {
    const navigate = useNavigate()
    const {auth, db} = useContext(Context)
    const [user] = useAuthState(auth)
    const todolistsRef = db.collection('todolists')
    const [tasks, loading] = useCollectionData(
        todolistsRef.orderBy('createdAt')
    )

    const addTask = async (title) => {
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
    const deleteTask = async (id) => {
        db.doc(`todolists/${id}`).delete()
    }

    if (loading) {
        return <Loading/>
    }
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
                        let dateEnd;
                        if(!t.dateEnd){
                            dateEnd = (new Date).toISOString()
                        }else{
                            dateEnd = t.dateEnd
                        }

                        return <Grid item key={t.taskId}>
                            <Paper style={{padding: '10px'}} variant={'outlined'}>
                                <Task
                                    id={t.taskId}
                                    title={t.title}
                                    description={t.description}
                                    status={t.status}
                                    fileName={t.fileName}
                                    dateEnd={dateEnd}
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