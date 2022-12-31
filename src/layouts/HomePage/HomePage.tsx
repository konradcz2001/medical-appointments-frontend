import { Welcome } from "./components/Welcome";
import { AboutUs } from "./components/AboutUs";
import { ClientServices } from "./components/ClientServices";

export const HomePage = () => {
    return (
        <>
            <Welcome/>
            <AboutUs/>
            <ClientServices/>
        </>
    );
}