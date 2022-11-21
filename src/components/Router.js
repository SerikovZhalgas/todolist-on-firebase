import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Error404 from "./Error404";
import {Login} from "./Login";
import {Task} from "./Task";
import {Todolist} from "./Todolist";

export const PATH = {
    MAIN: '/',
    LOGIN: '/login',
    TODOLIST: '/todolist',
    TASK: '/task',
    ERROR_404: '/error',
};

export const Router = () => {
    return (
        <div>
            <Routes>
                <Route path={PATH.MAIN} element={<Navigate to={PATH.LOGIN} />} />
                <Route path={PATH.TODOLIST} element={<Todolist />} />
                <Route path={PATH.TASK} element={<Task />} />
                <Route path={PATH.LOGIN} element={<Login />} />

                <Route path={PATH.ERROR_404} element={<Error404 />} />
                <Route path={'*'} element={<Navigate to={PATH.ERROR_404} />} />
            </Routes>
        </div>
    );
}

export default Router;
