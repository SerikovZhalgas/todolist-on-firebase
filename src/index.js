import React, {createContext} from 'react';
import { render } from 'react-dom';
import './index.module.css';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import firebase from "firebase";
import {App} from "./app/App";

firebase.initializeApp(
    {
        apiKey: "AIzaSyCq397RPkCQg6aChbAsEREl9h84P1_43hw",
        authDomain: "todo-list-4fba9.firebaseapp.com",
        projectId: "todo-list-4fba9",
        storageBucket: "todo-list-4fba9.appspot.com",
        messagingSenderId: "932189019363",
        appId: "1:932189019363:web:738e191c2faf8b5a88f9d6"
    }
);

export const Context = createContext(null)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const rootElement = document.getElementById('root');
render(<Context.Provider value={{
    firebase,
    auth,
    db,
    storage
}}>
    <App/>
</Context.Provider>, rootElement);
