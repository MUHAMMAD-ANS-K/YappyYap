import { useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./DashboardComps/Nav"
import HomeComp from "./DashboardComps/HomeComp";
import "./Dashboard.css"
import NotFound from "./404";
import useDashAuth from "../hooks/useDashAuth";
import Deployments from "./DashboardComps/Deployments";
export default function Dashboard() {
    const {isAdmin} = useDashAuth();
    const {checking} = useDashAuth();
    if (checking){
        return(
            <div className="loading">
                Loading...
            </div>
        )
    }
    else{
        if (!isAdmin){
            return <Navigate to="/" replace/>
        }
    return(
        <div className="dashboard">
            <Nav/>
            <Routes>
                <Route path="/" element = {<Deployments/>}/>
                <Route path="/home-comps" element={<HomeComp/>} />
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>
    );
}
}
