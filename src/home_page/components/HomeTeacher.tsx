import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export default function HomeTeacher(props:any) {
    
    
    return (
        
            <div>
            <NavigationBar />
       
            <div className="mx-14 bg-slate-200">
            <Outlet />
            </div>
            </div>
      
    )
}
