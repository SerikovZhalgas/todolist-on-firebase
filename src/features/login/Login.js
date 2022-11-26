import firebase from "firebase";
import {useContext} from "react";
import {Context} from "../../index";
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {PATH} from "../../components/AppRouter";
import styles from './Login.module.scss'

export const Login = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        console.log(user)
    }

    if (user !== null) {
        navigate(PATH.TODOLIST)
    }

    return <div className={styles.loginBlock}>
            <Button onClick={login} variant={"contained"}>Войти с помощью Google</Button>
        </div>
};