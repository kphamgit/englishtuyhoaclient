
//import GenericDialog from "../../features/components/GenericDialog";
import React from "react";
import GoogleTTS from "../../components/GoogleTTS";
import ListCagegories from "../../features/questions_manager/ListCategories";
import { Utils } from "../../features/utils/Utils";
import { NavigationBar } from "./NavigationBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
//import SimplePeer from "../components/SimplePeer";


export default function HomeTeacher(props:any) {
    

    return (
        <>
        <NavigationBar />
        <div>
            <GoogleTTS text="testing only" />
        </div>
          <Outlet />
          </>
    )
}
