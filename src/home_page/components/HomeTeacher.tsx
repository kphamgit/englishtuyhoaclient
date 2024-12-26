import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export default function HomeTeacher(props:any) {
    
    
    return (
        
            <div className="bg-red-200">
            <NavigationBar />
       
            <div className="mx-14 bg-slate-200">
            <Outlet />
            </div>
            </div>
      
    )
}
