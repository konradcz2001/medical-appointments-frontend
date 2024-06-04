import { Welcome } from "./components/Welcome";
import { AboutUs } from "./components/AboutUs";
import { ClientServices } from "./components/ClientServices";
import React from "react";

export const HomePage = (props: any) => {
    return (
        <>
            <Welcome/>
            <AboutUs/>
            <ClientServices {...props}/>
        </>
    );
}