import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from "./app/App";
import 'firebase/firestore'
import 'firebase/auth'
import firebase from "firebase";

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
const firestore = firebase.firestore()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        firebase,
        auth,
        firestore
    }}>
        <App/>
    </Context.Provider>
);
