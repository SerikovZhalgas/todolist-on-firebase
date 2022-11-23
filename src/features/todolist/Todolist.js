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

export const Todolist = () => {
    const navigate = useNavigate()
    const {auth, db} = useContext(Context)
    const [user] = useAuthState(auth)
    const todolistsRef = db.collection('todolists')
    const [tasks, loading] = useCollectionData(
        todolistsRef.orderBy('createdAt')
    )
    console.log(tasks)
    const addTask = async (title) => {
        todolistsRef.add({
            userId: user.uid,
            taskId: v1(),
            title,
            description: "",
            status: false,
            dateEnd: new Date(),
            files: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    const deleteTask = async (taskId) => {
        db.collection('task').add({
            uid: user.uid,
            taskId
        })
    }

    if (loading) {
        return <Loading/>
    }

    if (user==null) {
        navigate(PATH.LOGIN)
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTask} disabled={loading}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    tasks.map(t =>
                        <Grid item key={t.taskId}>
                            <Paper style={{padding: '10px'}}>
                                <Task
                                    id={t.taskId}
                                    title={t.title}
                                    description={t.description}
                                    status={t.status}
                                    file={t.file}
                                    dateEnd={t.dateEnd}
                                    removeTask={deleteTask}
                                />
                            </Paper>
                        </Grid>)
                }
            </Grid>
        </>
    )
}