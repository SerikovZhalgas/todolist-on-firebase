import {HashRouter} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import {useContext} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {Loading} from "../components/Loading";
import {Context} from "../index";
import {AppRouter} from "../components/AppRouter";
import styles from './App.module.scss'

/**
 * Компонента возвраащает навигационную панель и страницу Роутинга.
 * @returns {JSX.Element}
 * @constructor
 */
export const App = () => {
    const {auth} = useContext(Context)
    const [user, loading, error] = useAuthState(auth)

    //Перенаправление на страницу загрузки при авторизации пользователя
    if (loading) {
        return <Loading/>
    }

    return (
        <HashRouter>
            <div className={styles.appBlock}>
                <Navbar/>
                <AppRouter/>
            </div>
        </HashRouter>
    );
}
