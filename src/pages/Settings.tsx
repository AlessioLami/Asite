import React, { useState } from "react"
import { FiArrowLeft, FiPlus } from "react-icons/fi"
import {FaClipboardList } from "react-icons/fa"
import { FaWeightScale } from "react-icons/fa6"
import { IoIosNotifications } from "react-icons/io"
import { MdSensors } from "react-icons/md"
import { useAddWhitelistedUserMutation, useGetWhitelistedUsersQuery, useRemoveWhitelistedUserMutation } from "../services/apis/whitelistApi"
import { Toaster, toast } from "sonner"
import { useAddDispoMutation, useGetDispoQuery, useRemoveDispoMutation } from "../services/apis/dispoApi"
import { useAddUnitaMutation, useGetUnitaQuery, useRemoveUnitaMutation } from "../services/apis/unitaApi"

export type User = {
    email: string;
    role: string;
    _id: string;
    isRegistered: string;
}

export type Dispo = {
    _id: string;
    mac: string;
    codifica: string;
    unita_misurata: any;
} 

export type Unita = {
    _id: string;
    codifica: string;
}

const Settings = () => {

    const [section, setSection] = useState<"whitelist"|"dispositivi"|"unita"|"notifiche">("whitelist")

    const [add] = useAddWhitelistedUserMutation() 
    const [addDispo] = useAddDispoMutation()
    const [addUnita] = useAddUnitaMutation()

    const [remove] = useRemoveWhitelistedUserMutation()
    const [removeDispo] = useRemoveDispoMutation()
    const [removeUnita] = useRemoveUnitaMutation()

    const {data: whitelistData, error: whitelistError, refetch: refetchWhitelist} = useGetWhitelistedUsersQuery({})
    const {data: dispoData, error: dispoError, refetch: refetchDispo} = useGetDispoQuery({})
    const {data: unitaData, error: unitaError, refetch: refetchUnita} = useGetUnitaQuery({})

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");

    const [mac, setMac] = useState("");
    const [codificaDispo, setCodifica] = useState("")
    const [unitaMisurata, setUnitaMisurata] = useState<string|undefined>(undefined)

    const [codificaUnita, setCodificaUnita] = useState("")

    let whitelist = whitelistData ?? []    
    if(whitelistError && "status" in whitelistError){
        whitelist = whitelistError.status === 400 ? [] : whitelistData ?? []
    }

    let dispoList = dispoData?.data ?? []
    if(dispoError && "status" in dispoError){
        dispoList = dispoError.status === 400 ? [] : dispoData.data ?? []
    }
    
    let unitaList = unitaData?.data ?? []
    if(unitaError && "status" in unitaError){
        unitaList = unitaError.status === 400 ? [] : unitaData.data ?? []
    }


    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const res = await add({email: email, role: role})
            if(res.error && "data" in res.error && (res.error.data as any)?.message){
                toast.error((res.error.data as any).message)
            }else{
                toast.success("L'utente è stato inserito con successo!")
                refetchWhitelist()
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
                await refetchWhitelist()
            }
        }catch(error){
            toast.error("C'è stato un errore nella rimozione dell' utente.")
        }
    }

    
    const handleAddDispo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const res = unitaMisurata ? await addDispo({mac: mac, codifica: codificaDispo, unita_misurata: unitaMisurata}) : await addDispo({mac: mac, codifica: codifica})
            if(res.error && "data" in res.error && (res.error.data as any)?.message){
                toast.error((res.error.data as any).message)
            }else{
                toast.success("Il dispositivo è stato inserito con successo!")
                refetchDispo()
            }
        }catch(error){
            toast.error("Si è verificato un errore nell'inserimento del dispositivo.")
        }
    }

    const handleRemoveUnita = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault()
        try{
            const res = await removeUnita(id)
            if(!res.data.success){
                toast.error(res.data.message)
            }else{
                toast.success("Unità rimossa con successo!")
                await refetchUnita()
            }
        }catch(error){
            toast.error("C'è stato un errore nella rimozione dell'unità.")
        }
    }
 

    const handleRemoveDispo = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault()
        try{
            const res = await removeDispo(id)
            if(!res.data.success){
                toast.error(res.data.message)
            }else{
                toast.success("Dispositivo rimosso con successo!")
                await refetchDispo()
            }
        }catch(error){
            toast.error("C'è stato un errore nella rimozione del dispositivo.")
        }
    }

    const handleAddUnita = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const res = await addUnita(codificaUnita)
            if(res.error && "data" in res.error && (res.error.data as any)?.message){
                toast.error((res.error.data as any).message)
            }else{
                toast.success("L'unita è stata inserita con successo!")
                refetchUnita()
            }
        }catch(error){
            toast.error("Si è verificato un errore nell'inserimento dell'unità.")
        }
    }

    return(
        <div className="flex h-screen w-full">
            <Toaster position="top-center" richColors/>
           <div className="flex flex-col gap-10 p-10 border-r-5">
                <a href="/dashboard" className="flex align-middle items-center gap-2 bg-gray-300 rounded-xl font-bold p-2"><FiArrowLeft/>Panoramica</a>
                <div className="flex flex-col gap-3 font-semibold text-xl w-full">
                    <h1 onClick={() => setSection("whitelist")} className={`${section == "whitelist" ? "text-black" : "text-gray-500"} flex align-middle items-center gap-1`}><FaClipboardList/>Whitelist</h1>
                    <h1 onClick={() => setSection("dispositivi")} className={`${section == "dispositivi" ? "text-black" : "text-gray-500"} flex align-middle items-center gap-1`}><MdSensors/>Dispositivi</h1>
                    <h1 onClick={() => setSection("unita")} className={`${section == "unita" ? "text-black" : "text-gray-500"} flex align-middle items-center gap-1`}><FaWeightScale/>Unità</h1>
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

            {section == "dispositivi" && (
                <div className="p-10 flex flex-col gap-10 w-full">
                        <h1 className="text-4xl font-bold">DISPOSITIVI</h1>
                        <form onSubmit={handleAddDispo} className="flex w-full gap-2">
                            <input onChange={(e) => setMac(e.target.value)} placeholder="Indirizzo MAC del dispositivo." className="p-2 border-3 rounded-lg w-full"/>
                            <input onChange={(e) => setCodifica(e.target.value)} placeholder="Codifica del dispositivo." className="p-2 border-3 rounded-lg w-full"/>
                            <select className="p-3 rounded-lg border-3" onChange={(e) => setUnitaMisurata(e.target.value || undefined)}>
                                <option value={undefined}>Nessuna unita'</option>
                                {unitaList.map((unita: Unita, id: number) =>{
                                    return <option key={id} value={unita._id}>{unita.codifica.toUpperCase()}</option>
                                })}
                            </select>
                            <button type="submit" className="px-4 bg-gray-300 rounded-xl flex justify-center items-center leading-none gap-3 align-middle"><FiPlus/> Aggiungi</button>
                        </form>
                        <table className="w-full border-3 rounded-xl text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">ID</th>
                                    <th className="py-2 px-4 border-b text-center">MAC</th>
                                    <th className="py-2 px-4 border-b text-center">Codifica</th>
                                    <th className="py-2 px-4 border-b text-center">Unità Misurata</th>
                                    <th className="py-2 px-4 border-b text-center">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dispoList.length > 0 ? dispoList.map((dispo: Dispo, id: number) => {
                                    return(
                                        <tr key={id}>
                                            <td className="py-2 px-4 text-center">{dispo._id}</td>
                                            <td className="py-2 px-4 text-center">{dispo.mac}</td>
                                            <td className="py-2 px-4 text-center">{dispo.codifica}</td>
                                            <td className="py-2 px-4 text-center">{dispo.unita_misurata ? dispo.unita_misurata.codifica.toUpperCase() : "N/A"}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveDispo(e, dispo._id)}} className="h-10 w-20 bg-red-400 rounded-xl text-white font-semibold">Rimuovi</button>
                                            </td>
                                        </tr>
                                    )
                                }): <tr><td colSpan={5} className="text-center w-full text-xl p-5 font-semibold">Non ci sono dispositivi registrati.</td></tr>}
                            </tbody>
                        </table>
                    </div>
            )}

            {section == "unita" && (
                <div className="p-10 flex flex-col gap-10 w-full">
                        <h1 className="text-4xl font-bold">UNITA' MISURATE</h1>
                        <form onSubmit={handleAddUnita} className="flex w-full gap-2">
                            <input onChange={(e) => setCodificaUnita(e.target.value)} placeholder="Codifica dell'unità." className="p-2 border-3 rounded-lg w-full"/>
                            <button type="submit" className="px-4 bg-gray-300 rounded-xl flex justify-center items-center leading-none gap-3 align-middle"><FiPlus/> Aggiungi</button>
                        </form>
                        <table className="w-full border-3 rounded-xl text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">ID</th>
                                    <th className="py-2 px-4 border-b text-center">Codifica</th>
                                    <th className="py-2 px-4 border-b text-center">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unitaList.length > 0 ? unitaList.map((unita: Unita, id: number) => {
                                    return(
                                        <tr key={id}>
                                            <td className="py-2 px-4 text-center">{unita._id}</td>
                                            <td className="py-2 px-4 text-center">{unita.codifica.toUpperCase()}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveUnita(e, unita._id)}} className="h-10 w-20 bg-red-400 rounded-xl text-white font-semibold">Rimuovi</button>
                                            </td>
                                        </tr>
                                    )
                                }): <tr><td colSpan={3} className="text-center w-full text-xl p-5 font-semibold">Non ci sono dispositivi registrati.</td></tr>}
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