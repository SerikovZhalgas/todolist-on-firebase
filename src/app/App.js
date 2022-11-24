import {BrowserRouter} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import {useContext} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {Loading} from "../components/Loading";
import {Context} from "../index";
import {AppRouter} from "../components/AppRouter";

export const App = () => {
    const {auth} = useContext(Context)
    const [user, loading, error] = useAuthState(auth)

    if (loading) {
        return <Loading/>
    }

    return (
        <BrowserRouter>
            <Navbar/>
            <AppRouter/>
        </BrowserRouter>
    );
}
