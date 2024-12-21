//import { useContext } from "react";
//import { ThemeContext } from "../contexts/theme_context";
//import { ThemeContextInterface } from "../types";
//import { SendLiveText } from "../features/live_actions/live_text";
import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export default function HomeTeacher(props:any) {
    
    
    return (
        <div>
            <div className="bg-bgColor">
            <NavigationBar />
       
            <Outlet />
            <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
        
            </div>
            </div>
        </div>
    )
}
