import type React from "react";
import { FiLogOut} from "react-icons/fi"
import { useLogoutMutation } from "../services/apis/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../services/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

export interface OverlayProps {
    email: string;
    role: string;
    errorCount: number;
    onlineSensorCount: number;
    elapsedTime: string;
}

const errors = [
    {"id": 1, "description": "Motore sovvrariscaldato.", "timestamp": "2025-07-10"},
    {"id": 2, "description": "Il sensore non trasmette da piu di 1 ora.", "timestamp": "2025-07-10"},
    {"id": 3, "description": "Il motore non gira alla velocità giusta.", "timestamp": "2025-07-10"},
    {"id": 5, "description": "Il motore non gira alla velocità giusta.", "timestamp": "2025-07-10"},
    {"id": 6, "description": "Il motore non gira alla velocità giusta.", "timestamp": "2025-07-10"},
    {"id": 7, "description": "Il motore non gira alla velocità giusta.", "timestamp": "2025-07-10"},
    {"id": 8, "description": "Il motore non gira alla velocità giusta.", "timestamp": "2025-07-10"}
]

const Overlay = ({email, role, errorCount, onlineSensorCount, elapsedTime} : OverlayProps) => {

    const [logout] = useLogoutMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault() 
        await logout({}) 
        dispatch(setCredentials({user: null, role: null}))
        toast.success("Logout eseguito correttamente!")
        navigate("/login")
    }

    return(
        <>
            <Toaster position="top-center" richColors className="absolute"/>
        <div className="absolute pointer-events-none  w-full h-screen flex justify-between items-center z-100">
            <div className="flex flex-col justify-between gap-10 p-5 h-full bg-black/25 pointer-events-auto min-w-[400px] max-w-[450px]">
                <h1 className="text-5xl font-black max-w-[300px] text-white">SELEZIONE RIFIUTI URBANI</h1>
                <div className="w-full flex flex-col gap-1 h-full">
                    <h1 className="text-4xl font-black text-gray-500">PANORAMICA</h1>
                   <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white">STATO: {errorCount === 0 ? <span className="text-green-500">OK</span> : <span className="text-red-500">KO</span>}</h1>
                    <h1 className="text-4xl font-black text-white">ERRORI: <span className={errorCount === 0 ? "text-green-500" : "text-red-500"}>{errorCount}</span></h1>
                    <h1 className="text-2xl font-black text-white">SENSORI ONLINE: <span className="text-blue-500">{onlineSensorCount}<span className="text-white">/</span><span className="text-green-500">18</span></span></h1>
                    <h1 className="text-xl font-black text-white">ULTIMA RICEZIONE: <span className="text-blue-500">{elapsedTime}</span></h1></div> 
                </div>
                <div className="flex flex-col gap-3">
                    {role === "SUPERADMIN" && (
                        <>
                            <h1 onClick={() => navigate("/dispositivi")} className="text-3xl hover:text-gray-300 font-black text-white gap-2">DISPOSITIVI</h1>
                            <h1 onClick={() => navigate("/sniffer")} className="text-3xl hover:text-gray-300 font-black text-white gap-2">SNIFFER</h1>
                        </>
                    )}
                    <h1 onClick={() => navigate("/settings")}className="text-3xl  hover:text-gray-300 font-black text-white gap-2">IMPOSTAZIONI</h1>
                    <div className="flex items-center justify-start w-full  py-3 rounded-xl">
                        <h1 className="font-bold p-2 rounded-xl bg-white">WI</h1>
                        <div className="font-bold text-white px-3">
                            <h1>{email}</h1>
                            <h1>Ruolo: {role}</h1>
                        </div>
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleLogout(e)}className="hover:bg-gray-300 bg-white p-4 rounded-xl"><FiLogOut/></button>
                    </div>
                </div>
                
            </div>  
            <div className="bg-black/25 w-full p-5 h-full flex flex-col gap-10 pointer-events-auto max-w-[360px]">
                <h1 className="text-4xl font-black text-white">LISTA ERRORI</h1>
                <div className="flex flex-col gap-3 overflow-y-scroll scrollbar-custom">
                    {errors.map((error) => {
                        return(
                            <div key={error.id} className="flex flex-col bg-red-500/50 p-2 rounded-xl">
                                <h1 className="text-white font-bold">ID Errore: {error.id}</h1>
                                <p className="text-white font-semibold">{error.description}</p>
                                <p className="text-gray-400 font-medium">{error.timestamp}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        </>
    )
}

export default Overlay