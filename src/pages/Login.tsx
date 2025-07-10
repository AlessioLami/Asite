import React, { useState } from "react";
import { useLoginMutation } from "../services/apis/authApi";
import { setCredentials } from "../services/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login] = useLoginMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.auth.user)
    if(user){
        navigate("/dashboard")
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const res = await login({email, password})
            if(res.error && "data" in res.error){
                const message = (res.error.data as any)?.message;
                toast.error(message)
            }else{
                toast.success("Accesso effettuato con successo!")
                dispatch(setCredentials({user: res.data.email, role: res.data.role}))
                setEmail("");
                setPassword("");    
                navigate("/dashboard")
            }
        }catch(error){
            toast.error("Si è verificato un errore durante il login.")
        }


    }

    return(
        <div>
        <Toaster position="top-center" richColors/>
        <div className="flex items-center justify-around h-screen">
            <form onSubmit={handleLogin} className="w-[400px] flex flex-col items-center justify-center text-center gap-5 p-10 border-2 rounded-lg">
                <h1 className="w-full text-4xl font-bold">LOGIN</h1>
                    <input onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="text" placeholder="Email" required/>
                    <input onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-lg bg-gray-200 font-semibold text-black" type="password" placeholder="Password" required/>
                    <div className="flex flex-col gap-3 items-center justify-between w-full">
                        <button type="submit" className="hover:bg-black/75 cursor-pointer p-2 rounded-lg bg-black font-semibold text-white w-full">LOGIN</button>
                        <p>Non hai un'account? <a className="text-blue-500 hover:underline" href="/register">Registrati</a></p>
                    </div>
            </form>
        </div>
        </div>
    )
}

export default Login;