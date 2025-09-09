
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import '../../styles/Layout.css';

export default function Layout() {

    return (
        <>
            <Header/>
            <main className="main-container">
                <Outlet />
            </main>
        </>
    )

}