import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../index";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {PATH} from "./AppRouter";

/**
 * Комонента возвращает навигационную панель с разными кнопками в зависимости от авторизации пользователя
 * @returns {JSX.Element}
 * @constructor
 */
export const Navbar = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <AppBar color={"primary"} position="static">
            <Toolbar variant={"regular"}>
                <Grid container justify={"flex-end"}>
                    {user ?
                        <Button onClick={() => auth.signOut()} variant={"contained"} color={'info'}>Выйти</Button>
                        :
                        <NavLink to={PATH.LOGIN} style={{textDecoration: 'none'}}>
                            <Button variant={"contained"} color={'info'}>Логин</Button>
                        </NavLink>
                    }
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
