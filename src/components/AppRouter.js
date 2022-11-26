import React from 'react';
import {Navigate, Routes, Route} from "react-router-dom";
import Error404 from "./Error404";
import {Login} from "../features/login/Login";
import {Todolist} from "../features/todolist/Todolist";

export const PATH = {
    TODOLIST: '/todolist',
    LOGIN: '/login',
    ERROR_404: "/error"
}

export const AppRouter = () => {
    return <Routes>
        <Route path='/' element={<Navigate to={PATH.TODOLIST}/>}/>
        <Route path={PATH.TODOLIST} element={<Todolist/>}/>
        <Route path={PATH.LOGIN} element={<Login/>}/>

        <Route path={PATH.ERROR_404} element={<Error404/>}/>
        <Route path='*' element={<Navigate to={PATH.ERROR_404}/>}/>
    </Routes>
};