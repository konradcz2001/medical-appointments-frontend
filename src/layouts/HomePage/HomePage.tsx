import { Welcome } from "./components/Welcome";
import { AboutUs } from "./components/AboutUs";
import { ClientServices } from "./components/ClientServices";

/**
 * Functional component for the HomePage.
 * Renders the Welcome, AboutUs, and ClientServices components.
 * Accepts props as input.
 */
export const HomePage = (props: any) => {
    return (
        <>
            <Welcome/>
            <AboutUs/>
            <ClientServices {...props}/>
        </>
    );
}