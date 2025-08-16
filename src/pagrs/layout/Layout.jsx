
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";

export default function Layout() {

    return (
        <>
            <Header/>
            <main style={{
                padding: '0 10rem',
                maxWidth: '1200px',
                margin: '0 auto',
                marginTop: '3rem'
            }}>
                <Outlet />
            </main>
        </>
    )

}