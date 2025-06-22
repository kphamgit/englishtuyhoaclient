
//import GenericDialog from "../../features/components/GenericDialog";
import GoogleTTS from "../../components/GoogleTTS";
import { NavigationBar } from "./NavigationBar";
import { Outlet } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export default function HomeTeacher(props:any) {
    
    
    return (
        
            <div>
                <h1>HELLO....</h1>
            <NavigationBar />
            <GoogleTTS text="testing only" />
            <div className="mx-14">
            <Outlet />
            </div>
            </div>
      
    )
}
