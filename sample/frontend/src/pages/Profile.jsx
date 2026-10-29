const api = import.meta.env.VITE_API;
import { useState,useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
export default function Profile(){
    const navi = useNavigate()
    const [user,setUser] = useState(null)
    useEffect(()=>{
        async function getPro(){
            const token = localStorage.getItem("token");
            console.log("Start"+token);
            const resp = await axios.get(api+"users/profile",{
                headers:{Authorization:token}
            })
            console.log(resp.data);
            if(resp.data.msg=="Invalid Token" || resp.data.msg=="Token Missing"){
                navi("/login");
            }
            console.log(resp.data)
            setUser(resp.data.user)
        }
        getPro()
    },[])
    if(!user){
        return<h1>Loding...</h1>
    }
    function handLogout(){
        localStorage.removeItem("token");
        navi("/")
    }
    return(
        <>
        <Navbar/>
            Welcome Back {user.name}
            
            <button onClick={handLogout}>log out</button>
        </>
    )
}