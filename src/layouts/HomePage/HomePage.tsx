import { Welcome } from "./components/Welcome";
import { AboutUs } from "./components/AboutUs";
import { ClientServices } from "./components/ClientServices";

export const HomePage = (props: any) => {
    return (
        <>
            <Welcome/>
            <AboutUs/>
            <ClientServices {...props}/>
        </>
    );
}