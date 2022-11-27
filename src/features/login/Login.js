import firebase from "firebase";
import {useContext} from "react";
import {Context} from "../../index";
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {PATH} from "../../components/AppRouter";
import styles from './Login.module.scss'

/**
 * Компонента возвращает страницу логинизации.
 * @returns {JSX.Element}
 * @constructor
 */
export const Login = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const navigate = useNavigate()
    /**
     * Коллбэк функция обращения на сервис логинизации через Google аккаунт. Заранее подключено в консоли Firebase.
     * @returns {Promise<void>}
     */
    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
    }

    //Условие перенаправления залогининого Пользователя на страницу Todolist.
    if (user !== null) {
        navigate(PATH.TODOLIST)
    }

    return <div className={styles.loginBlock}>
            <Button onClick={login} variant={"contained"}>Войти с помощью Google</Button>
        </div>
};