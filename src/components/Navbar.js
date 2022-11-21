import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {useAuthState} from "react-firebase-hooks/auth";
import {AppBar, Button, Grid, Toolbar} from "@material-ui/core";
import {Context} from "../index";
import {PATH} from "./Router";

export const Navbar = () => {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <AppBar color={"secondary"} position="static">
            <Toolbar variant={"dense"}>
                <Grid container justify={"flex-end"}>
                    {user ?
                        <Button onClick={() => auth.signOut()} variant={"outlined"}>Выйти</Button>
                        :
                        <NavLink to={PATH.LOGIN}>
                            <Button variant={"outlined"}>Логин</Button>
                        </NavLink>
                    }
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
