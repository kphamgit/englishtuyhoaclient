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
