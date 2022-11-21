import {Grid, Paper} from "@material-ui/core";
import {Loading} from "../../components/Loading";
import {useAuthState} from "react-firebase-hooks/auth";
import {useContext} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import {AddItemForm} from "../../components/AddItemForm";
import {Task} from "./task/Task";

export const Todolist = () => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [tasks, loading] = useCollectionData(
        firestore.collection('task').orderBy('createdAt')
    )

    const addTask = async (title) => {
        firestore.collection('task').add({
            uid: user.uid,
            title,
            description: "",
            status: false,
            file: '',
            date: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    const deleteTask = async (taskId) => {
        firestore.collection('task').add({
            uid: user.uid,
            taskId
        })
    }

    if (loading) {
        return <Loading/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTask} disabled={loading}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    tasks.map(t =>
                        <Grid item key={t.uid}>
                            <Paper style={{padding: '10px'}}>
                                <Task
                                    key={t.uid}
                                    title={t.title}
                                    description={t.description}
                                    status={t.status}
                                    file={t.file}
                                    date={t.date}
                                    removeTask={removeTask}
                                />
                            </Paper>
                        </Grid>)
                }

            </Grid>
        </>
    )
}