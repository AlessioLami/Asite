import { IoMdSettings } from "react-icons/io"
import { FiLogOut } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { useLogoutMutation } from "../services/apis/authApi"
import {Toaster,  toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { setCredentials } from "../services/slices/authSlice"

const Sidebar = () => {

    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role).toUpperCase()

    const [logout] = useLogoutMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = async () => {
       await logout({}) 
       dispatch(setCredentials({user: null, role: null}))
       toast.success("Logout eseguito correttamente!")
       navigate("/login")
    }

    const errors = [
        {id: "1", message: "Motore bruciato", timestamp: "09-07-2025"},
        {id: "2", message: "Sensore non trasmette dati", timestamp: "10-07-2025"},
        {id: "2", message: "Sensore non trasmette dati", timestamp: "10-07-2025"}
    ]

    return(
        <div className="w-full h-screen p-10 flex-col gap-3 hidden md:flex items-center md:max-w-[200px] lg:max-w-[400px]">
            <Toaster position="top-center" richColors/>
            <h1 className="font-bold text-[40px] px-5">PANORAMICA</h1>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex justify-between w-full gap-2 p-5">
                    <div className="w-full p-5 border-2 rounded-xl flex flex-col items-center justify-center text-2xl">
                        <h1 className="font-semibold">STATO</h1>
                        <h1 className="font-bold text-green-600">OK</h1>
                    </div>
                    <div className="w-full p-5 border-2 rounded-xl flex flex-col items-center justify-center text-2xl">
                        <h1 className="font-semibold">ERRORI</h1>
                        <h1 className="font-bold text-red-600">3</h1>
                    </div>
                </div> 
               {errors.length > 0 ?
                    <div className="flex flex-col gap-3 rounded-lg p-5 overflow-y-scroll max-h-[300px]">
                        {errors.map((error, id) => {
                            return(
                                <div key={id} className="bg-red-500/70 rounded-lg p-2 font-semibold text-white">
                                    <h1>ID: {error.id}</h1>
                                    <p>Errore: {error.message} </p>
                                    <p>Timestamp: {error.timestamp}</p>
                                </div>
                            )
                        })}
                    </div>
                    : <div className="w-full h-[300px] p-5 text-center flex text-xl font-bold justify-center items-center  rounded-xl"><h1 className="border-3 p-10 py-30 rounded-xl">Nessun errore rilevato!</h1></div>
               } 
            </div> 
            <div className="flex flex-col items-center w-full p-5 gap-3">
                <a href="/settings" className="w-full flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-2 text-2xl font-bold"><IoMdSettings className="w-[1.3em] h-[1.3em] translate-y-[1px]" />IMPOSTAZIONI</a>
                <div className="w-full flex gap-3 items-center bg-gray-200 rounded-xl px-2">
                    <p className="p-2 w-10 h-10 bg-gray-400 font-black text-white rounded-lg text-center">WI</p>
                    <div className="py-2 justify-start w-full items-center font-bold">
                        <h1>{user}</h1>
                        <p>Ruolo: {role}</p>
                    </div>
                    <button onClick={handleLogout}><FiLogOut className="w-8 h-10 p-1 hover:text-gray-400"/></button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar