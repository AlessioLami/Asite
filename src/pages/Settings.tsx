import React, { useState } from "react"
import { FiArrowLeft, FiPlus } from "react-icons/fi"
import {FaClipboardList } from "react-icons/fa"
import { IoIosNotifications } from "react-icons/io"
import { useAddWhitelistedUserMutation, useGetWhitelistedUsersQuery, useRemoveWhitelistedUserMutation } from "../services/apis/whitelistApi"
import { Toaster, toast } from "sonner"

export type User = {
    email: string;
    role: string;
    _id: string;
    isRegistered: string;
}

const Settings = () => {

    const [section, setSection] = useState<"whitelist"|"notifiche">("whitelist")

    const [add] = useAddWhitelistedUserMutation() 
    const [remove] = useRemoveWhitelistedUserMutation()
    const {data, error, refetch} = useGetWhitelistedUsersQuery({})

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");

    let whitelist = data ?? []    
    if(error && "status" in error){
        whitelist = error.status === 400 ? [] : data ?? []
    }


    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const res = await add({email: email, role: role})
            if(res.error && "data" in res.error && (res.error.data as any)?.message){
                toast.error((res.error.data as any).message)
            }else{
                toast.success("L'utente è stato inserito con successo!")
                refetch()
            }
        }catch(error){
            toast.error("Si è verificato un errore nell'inserimento dell'utente.")
        }
    }

    const handleRemoveUser = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault()

        try{
            const res = await remove(id)
            if(!res.data.success){
                toast.error(res.data.message)
            }else{
                toast.success("Utente rimosso con successo!")
                await refetch()
            }
        }catch(error){
            toast.error("C'è stato un errore nella rimozione di un utente.")
        }
    }

    return(
        <div className="flex h-screen w-full">
            <Toaster position="top-center" richColors/>
           <div className="flex flex-col gap-10 p-10 border-r-5">
                <a href="/dashboard" className="flex align-middle items-center gap-2 bg-gray-300 rounded-xl font-bold p-2"><FiArrowLeft/>Panoramica</a>
                <div className="flex flex-col gap-3 font-semibold text-xl w-full">
                    <h1 onClick={() => setSection("whitelist")} className={`${section == "whitelist" ? "text-black" : "text-gray-500"} flex align-middle items-center gap-1`}><FaClipboardList/>Whitelist</h1>
                    <h1 onClick={() => setSection("notifiche")} className={`${section == "notifiche" ? "text-black" : "text-gray-500"} flex align-middle items-center gap-1`}><IoIosNotifications/>Notifiche</h1>
                </div>
            </div> 
            {section == "whitelist" && (
                    <div className="p-10 flex flex-col gap-10 w-full">
                        <h1 className="text-4xl font-bold">WHITELIST</h1>
                        <form onSubmit={handleAddUser} className="flex w-full gap-2">
                            <input onChange={(e) => setEmail(e.target.value)} placeholder="Email da aggiungere alla whitelist." className="p-2 border-3 rounded-lg w-full"/>
                            <select className="p-3 rounded-lg border-3" onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="px-4 bg-gray-300 rounded-xl flex justify-center items-center leading-none gap-3 align-middle"><FiPlus/> Aggiungi</button>
                        </form>
                        <table className="w-full border-3 rounded-xl text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">Email</th>
                                    <th className="py-2 px-4 border-b text-center">Ruolo</th>
                                    <th className="py-2 px-4 border-b text-center">Ha accettato</th>
                                    <th className="py-2 px-4 border-b text-center">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {whitelist.length > 0 ? whitelist.map((user: User, id: number) => {
                                    return(
                                        <tr key={id}>
                                            <td className="py-2 px-4 text-center">{user.email}</td>
                                            <td className="py-2 px-4 text-center">{user.role}</td>
                                            <td className="py-2 px-4 text-center">{user.isRegistered ? "Sì" : "No"}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveUser(e, user._id)}} className="h-10 w-20 bg-red-400 rounded-xl text-white font-semibold">Rimuovi</button>
                                            </td>
                                        </tr>
                                    )
                                }): <tr><td colSpan={4} className="text-center w-full text-xl p-5 font-semibold">Non ci sono utenti nella whitelist.</td></tr>}
                            </tbody>
                        </table>
                    </div>
            )}

            {section == "notifiche" && (
                    <div>

                    </div>
            )}
        </div>
    )
} 

export default Settings