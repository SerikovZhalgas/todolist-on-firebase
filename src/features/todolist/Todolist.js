import {Loading} from "../../components/Loading";
import {useAuthState} from "react-firebase-hooks/auth";
import {useContext} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {AddItemForm} from "../../components/AddItemForm";
import {Task} from "./task/Task";
import {Context} from "../../index";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {PATH} from "../../components/AppRouter";
import {useNavigate} from "react-router-dom";

export const Todolist = () => {
    const navigate = useNavigate()
    const {auth, db} = useContext(Context)
    const [user] = useAuthState(auth)
    const [tasks, loading] = useCollectionData(
        db.collection('tasks').orderBy('createdAt')
    )

    const addTask = async (title) => {
        db.collection("tasks").add({
            taskId: "1",
            title,
            description: "",
            dateEnd: "",
            files: ""
        })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }
    /*const addTask = async (title) => {
        firestore.collection('task').add({
            uid: user.uid,
            title,
            description: "",
            status: false,
            file: '',
            date: firebase.firestore.FieldValue.serverTimestamp()
        })
    }*/
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
                        <Grid item key={t.uid}>
                            <Paper style={{padding: '10px'}}>
                                <Task
                                    key={t.uid}
                                    title={t.title}
                                    description={t.description}
                                    status={t.status}
                                    file={t.file}
                                    date={t.date}
                                    removeTask={deleteTask}
                                />
                            </Paper>
                        </Grid>)
                }

            </Grid>
        </>
    )
}