import axios from "axios";
import { useEffect, useState } from "react";



 export const useCheckAdmin = () =>{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string |null>(null);
    const [admin, setAdmin] = useState<Record<string,any> | null>(null);

     let token = ""
     try {
        let admin  = JSON.parse(localStorage.getItem("admin") || "{}")
        if(admin.token){
            token = admin.token
        }
     } catch (error) {
        console.log(error)
     }
    const checkAdmin = async () =>{
        await axios.get("/admin/me",{
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            }
        })
    }

    useEffect(() => {
        checkAdmin()
    }, []);

 }