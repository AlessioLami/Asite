'use client'

import React, { useState, useEffect } from "react"
import { FiArrowLeft, FiPlus, FiX, FiCheck } from "react-icons/fi"
import { FaClipboardList, FaDatabase } from "react-icons/fa"
import { FaWeightScale } from "react-icons/fa6"
import { MdSensors, MdUpdate } from "react-icons/md"
import { useAddWhitelistedUserMutation, useGetWhitelistedUsersQuery, useRemoveWhitelistedUserMutation } from "../services/apis/whitelistApi"
import { Toaster, toast } from "sonner"
import { useAddDispoMutation, useGetDispoQuery, useRemoveDispoMutation, useUpdateDispoMutation } from "../services/apis/dispoApi"
import { useAddUnitaMutation, useGetUnitaQuery, useRemoveUnitaMutation, useUpdateUnitaMutation } from "../services/apis/unitaApi"
import { useGetParametersQuery, useUpdateMutation } from "../services/apis/parametersApi"

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
  type: string;
}

export type Unita = {
  _id: string;
  codifica: string;
  tempLimit: number;
}


interface ModalProps {
  open: boolean
  title: string
  children?: React.ReactNode
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
}

const Modal: React.FC<ModalProps> = ({ open, title, children, onCancel, onConfirm, confirmLabel = "Conferma", cancelLabel = "Annulla" }) => {
  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onEsc)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onCancel])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10 transition" aria-label="Chiudi">
              <FiX />
            </button>
          </div>
          <div className="text-white/80 text-sm leading-relaxed">{children}</div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 h-10 rounded-xl border border-white/10 hover:bg.white/5 transition flex items-center gap-2">
              <FiX /> {cancelLabel}
            </button>
            <button onClick={onConfirm} className="px-4 h-10 rounded-xl bg-blue-500/90 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2">
              <FiCheck /> {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Settings = () => {
  const [section, setSection] = useState<"whitelist"|"dispositivi"|"unita"|"parametri" | "notifiche">("whitelist")

  const [add] = useAddWhitelistedUserMutation()
  const [addDispo] = useAddDispoMutation()
  const [addUnita] = useAddUnitaMutation()

  const [updatedId, setUpdatedId] = useState<string|null>("")
  const [updatedMac, setUpdatedMac] = useState<string|null>("")
  const [updatedCodifica, setUpdatedCodifica] = useState<string|null>("")
  const [updateDispo] = useUpdateDispoMutation()
  const [updateUnita] = useUpdateUnitaMutation()

  const [updatedUnitaId, setUpdatedUnitaId] = useState<string|null>("")
  const [updatedCodificaUnita, setUpdatedCodificaUnita] = useState("")
  const [updatedTempLimit, setUpdatedTempLimit] = useState(50)

  const [remove] = useRemoveWhitelistedUserMutation()
  const [removeDispo] = useRemoveDispoMutation()
  const [removeUnita] = useRemoveUnitaMutation()

  const {data: whitelistData, error: whitelistError, refetch: refetchWhitelist} = useGetWhitelistedUsersQuery({})
  const {data: dispoData, error: dispoError, refetch: refetchDispo} = useGetDispoQuery({})
  const {data: unitaData, error: unitaError, refetch: refetchUnita} = useGetUnitaQuery({})

  const { data: paramsData, error: paramsError, isLoading: paramsLoading, refetch: refetchParams } = useGetParametersQuery({})
  const [updateParameters] = useUpdateMutation()

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const [mac, setMac] = useState("");
  const [codificaDispo, setCodifica] = useState("")
  const [unitaMisurata, setUnitaMisurata] = useState<string|undefined>(undefined)
  const [type, setType] = useState<string>("installato")
  const [tempLimit, setTempLimit] = useState(50);

  const [codificaUnita, setCodificaUnita] = useState("")

  // --- LISTA EMAIL (PARAMETRO "lista_email") ---
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [savingEmails, setSavingEmails] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  
  let whitelist = whitelistData ?? []
  if(whitelistError && "status" in whitelistError){
    whitelist = whitelistError.status === 400 ? [] : whitelistData ?? []
  }

  let dispoList = dispoData?.data ?? []
  if(dispoError && "status" in dispoError){
    // @ts-ignore
    dispoList = dispoError.status === 400 ? [] : dispoData.data ?? []
  }

  let unitaList = unitaData?.data ?? []
  if(unitaError && "status" in unitaError){
    // @ts-ignore
    unitaList = unitaError.status === 400 ? [] : unitaData.data ?? []
  }

  let parameters: any = paramsData?.data ?? paramsData ?? null
  if (paramsError && "status" in paramsError) {
    parameters = paramsError.status === 400 ? null : (paramsData?.data ?? paramsData ?? null)
  }

  // Carica lista_email quando i parametri sono disponibili
  useEffect(() => {
    if (!paramsLoading && !paramsError && parameters) {
      const p = parameters?.find((x: any) => x.keySetting === "lista_email");
      if (p) {
        if (Array.isArray(p.arrayValue)) {
          setEmailList(p.arrayValue.filter((e: any) => typeof e === "string"));
        } else if (typeof p.stringValue === "string" && p.stringValue.trim() !== "") {
          setEmailList(
            p.stringValue
              .split(",")
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0)
          );
        } else {
          setEmailList([]);
        }
      } else {
        setEmailList([]);
      }
    }
  }, [paramsLoading, paramsError, parameters])

  const addEmailToList = () => {
    const val = emailInput.trim().toLowerCase();
    if (!val) return;
    if (!emailRegex.test(val)) {
      toast.error("Inserisci un'email valida.");
      return;
    }
    if (emailList.includes(val)) {
      toast.error("Questa email è già in lista.");
      return;
    }
    setEmailList(prev => [...prev, val]);
    setEmailInput("");
  };

  const removeEmailFromList = (mail: string) => {
    setEmailList(prev => prev.filter(e => e !== mail));
  };

  const saveEmailList = async () => {
    try {
      setSavingEmails(true);
      const param = parameters?.find((p: any) => p.keySetting === "lista_email");

      if (!param) {
        toast.error("Parametro 'lista_email' non trovato. Crealo lato backend oppure assicurati che venga restituito dall'API.");
        setSavingEmails(false);
        return;
      }

      const res = await updateParameters({
        _id: param._id,
        keySetting: "lista_email",
        arrayValue: emailList,
        // stringValue: emailList.join(",") // <-- usa questo se il backend memorizza CSV
      } as any);

      // @ts-ignore
      if (res.error && "data" in res.error && (res.error.data as any)?.message) {
        // @ts-ignore
        toast.error((res.error.data as any).message);
      } else {
        toast.success("Lista email aggiornata con successo!");
        await refetchParams();
      }
    } catch (err) {
      toast.error("Errore nel salvataggio della lista email.");
    } finally {
      setSavingEmails(false);
    }
  };

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
      // @ts-ignore
      if(!res.data.success){
        // @ts-ignore
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
      const res = unitaMisurata ? await addDispo({mac: mac, codifica: codificaDispo, unita_misurata: unitaMisurata}) : await addDispo({mac: mac, codifica: codificaDispo})
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
      // @ts-ignore
      if(!res.data.success){
        // @ts-ignore
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
      // @ts-ignore
      if(!res.data.success){
        // @ts-ignore
        toast.error(res.data.message)
      }else{
        toast.success("Dispositivo rimosso con successo!")
        await refetchDispo()
      }
    }catch(error){
      toast.error("C'è stato un errore nella rimozione del dispositivo.")
    }
  }

  const handleUpdateDispo = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(updatedId == null || updatedId===""){
      toast.error("Scegli un dispositivo nella lista.")
      return;
    }

    try{
      await updateDispo({id: updatedId, data : {mac: updatedMac, codifica: updatedCodifica, type: type}})
      toast.success("Dispositivo aggiornato con successo")
      await refetchDispo()
    } catch(error){
      toast.error("C'è stato un errore nell'aggiornamento di un dispositivo.")
    }
  }

  const handleAddUnita = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      const res = await addUnita({codifica: codificaUnita, tempLimit: tempLimit})
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

  const handleUpdateUnita = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      await updateUnita({id: updatedUnitaId, data : {codifica: updatedCodificaUnita, tempLimit: updatedTempLimit}})
      toast.success("Dispositivo aggiornato con successo")
      await refetchUnita()
    } catch(error){
      toast.error("C'è stato un errore nell'aggiornamento di un dispositivo.")
    }
  }

  const [maxH, setMaxH] = useState<number | ''>('');
  const [maxM, setMaxM] = useState<number | ''>('');
  const [maxS, setMaxS] = useState<number | ''>('');

  useEffect(() => {
    if (!paramsLoading && !paramsError && parameters) {
      const ms: number = parameters?.find((p: any) => p.keySetting === "maxDispoUpdateTime")?.numberValue ?? 0
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setMaxH(h)
      setMaxM(m)
      setMaxS(s)
    }
  }, [paramsLoading, paramsError, parameters])

  const pad2 = (n: number) => n.toString().padStart(2, "0")
  const msToLabel = (ms: number) => {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
  }

  const totalMs =
    (Number(maxH || 0) * 3600000) +
    (Number(maxM || 0) * 60000) +
    (Number(maxS || 0) * 1000)

  const hh = Math.floor(totalMs / 3600000)
  const mm = Math.floor((totalMs % 3600000) / 60000)
  const ss = Math.floor((totalMs % 60000) / 1000)

  type ConfirmPayload = { paramId: string; keySetting: string; newMs: number; prevMs: number }
  const [confirmParams, setConfirmParams] = useState<ConfirmPayload | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openConfirmParams = (payload: ConfirmPayload) => {
    setConfirmParams(payload)
    setConfirmOpen(true)
  }
  const closeConfirmParams = () => {
    setConfirmOpen(false)
    setConfirmParams(null)
  }

  const handleUpdateMaxTime = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const h = Number(maxH || 0)
      const m = Number(maxM || 0)
      const s = Number(maxS || 0)

      const isInt = (v: number) => Number.isInteger(v) && v >= 0
      if (![h, m, s].every(isInt)) {
        toast.error("Inserisci numeri interi validi (>= 0).")
        return
      }
      if (m > 59 || s > 59) {
        toast.error("Minuti e secondi devono essere tra 0 e 59.")
        return
      }

      const ms = (h * 3600000) + (m * 60000) + (s * 1000)
      if (ms <= 0) {
        toast.error("Il tempo totale deve essere maggiore di 0.")
        return
      }

      const param = parameters?.find((p: any) => p.keySetting === "maxDispoUpdateTime")
      if (!param) {
        toast.error("Parametro non trovato.")
        return
      }

      openConfirmParams({ paramId: param._id, keySetting: param.keySetting, newMs: ms, prevMs: param.numberValue ?? 0 })
    } catch (error) {
      toast.error("Errore nell'aggiornamento dei parametri.")
    }
  }

  const confirmUpdateMaxTime = async () => {
    if (!confirmParams) return
    try {
      const res = await updateParameters({
        _id: confirmParams.paramId,
        keySetting: confirmParams.keySetting,
        numberValue: confirmParams.newMs
      } as any)
      // @ts-ignore
      if (res.error && "data" in res.error && (res.error.data as any)?.message) {
        // @ts-ignore
        toast.error((res.error.data as any).message)
      } else {
        toast.success("Parametri aggiornati con successo!")
        await refetchParams()
        closeConfirmParams()
      }
    } catch (error) {
      toast.error("Errore nell'aggiornamento dei parametri.")
    }
  }

  return(
    <div
      className="flex h-screen w-full text-white overflow-hidden"
      style={{
        backgroundColor: "#0f172a",
        backgroundImage: `
          radial-gradient(circle at 18% 8%, rgba(59,130,246,0.12), transparent 35%),
          radial-gradient(circle at 82% 10%, rgba(16,185,129,0.10), transparent 30%),
          radial-gradient(circle at 60% 80%, rgba(234,179,8,0.08), transparent 35%),
          linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "auto,auto,auto,40px 40px,40px 40px",
      }}
    >
      <Toaster position="top-center" richColors/>

      <div className="flex flex-col gap-10 p-10 border-r border-white/10 bg.white/5 backdrop-blur min-w-[280px]">
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl font-semibold px-3 py-2
                       bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FiArrowLeft/> Panoramica
          </a>
          <h1 className='text-3xl font-extrabold tracking-tight'>IMPOSTAZIONI</h1>
        </div>

        <div className="flex flex-col gap-2 font-semibold text-base w-full">
          <h1
            onClick={() => setSection("whitelist")}
            className={`cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 border transition
              ${section==="whitelist"
                ? "bg-white/10 text-white border-white/20"
                : "text-white/60 hover:text-white border-transparent hover:bg-white/5"}`}
          >
            <FaClipboardList/> Whitelist
          </h1>
          <h1
            onClick={() => setSection("dispositivi")}
            className={`cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 border transition
              ${section==="dispositivi"
                ? "bg-white/10 text-white border-white/20"
                : "text-white/60 hover:text-white border-transparent hover:bg-white/5"}`}
          >
            <MdSensors/> Dispositivi
          </h1>
          <h1
            onClick={() => setSection("unita")}
            className={`cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 border transition
              ${section==="unita"
                ? "bg-white/10 text-white border-white/20"
                : "text-white/60 hover:text-white border-transparent hover:bg-white/5"}`}
          >
            <FaWeightScale/> Unità
          </h1>
          <h1
            onClick={() => setSection("parametri")}
            className={`cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 border transition
              ${section==="parametri"
                ? "bg-white/10 text-white border-white/20"
                : "text-white/60 hover:text-white border-transparent hover:bg-white/5"}`}
          >
            <FaDatabase/> Parametri
          </h1>
        </div>
      </div>

      {section == "whitelist" && (
        <div className="p-10 flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold">WHITELIST</h1>

          <form onSubmit={handleAddUser} className="flex w-full gap-2 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email da aggiungere alla whitelist."
              className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
            <select
              className="p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="px-4 bg-emerald-500/90 hover:bg-emerald-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"
            >
              <FiPlus/> Aggiungi
            </button>
          </form>

          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur overflow-auto scrollbar-elegant max-h-[70vh]">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-900/70 border-b border-white/10 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Email</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Ruolo</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Ha accettato</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {whitelist.length > 0 ? whitelist.map((user: User, id: number) => {
                  return(
                    <tr key={id} className="odd:bg-white/[0.02] even:bg-transparent hover:bg-white/[0.06] transition">
                      <td className="py-2 px-4 text-center">{user.email}</td>
                      <td className="py-2 px-4 text-center">{user.role}</td>
                      <td className="py-2 px-4 text-center">{user.isRegistered ? "Sì" : "No"}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveUser(e, user._id)}}
                          className="h-10 w-24 bg-red-500/90 hover:bg-red-500 rounded-xl text-white font-semibold transition"
                        >
                          Rimuovi
                        </button>
                      </td>
                    </tr>
                  )
                }): <tr><td colSpan={4} className="text-center w-full text-xl p-5 font-semibold text-white/70">Non ci sono utenti nella whitelist.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section == "dispositivi" && (
        <div className="p-10 flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold">DISPOSITIVI</h1>

          <form onSubmit={handleAddDispo} className="flex w-full gap-2 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
            <input onChange={(e) => setMac(e.target.value)} placeholder="Indirizzo MAC del dispositivo." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <input onChange={(e) => setCodifica(e.target.value)} placeholder="Codifica del dispositivo." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <select className="p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" onChange={(e) => setUnitaMisurata(e.target.value || undefined)}>
              <option value={undefined as unknown as string}>Nessuna unita'</option>
              {unitaList.map((unita: Unita, id: number) =>{
                return <option key={id} value={unita._id}>{unita.codifica.toUpperCase()}</option>
              })}
            </select>
            <button type="submit" className="px-4 bg-emerald-500/90 hover:bg-emerald-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"><FiPlus/> Aggiungi</button>
          </form>

          <form onSubmit={handleUpdateDispo} className="flex w-full gap-2 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
            <select  value={updatedId??""} onChange={(e) => {
              const selectedId = e.target.value;
              setUpdatedId(selectedId)
              const selectedDispo = dispoList.find((dispo: Dispo) => dispo._id === selectedId)
              if(selectedDispo){
                setUpdatedCodifica(selectedDispo.codifica);
                setUpdatedMac(selectedDispo.mac);
                setType(selectedDispo.type);
              }
            }} className="p-2 rounded-lg w-full bg-white/5 border border-white/10 focus:outline-none">
              <option value="" disabled>Seleziona un dispositivo da aggiornare.</option>
              {dispoList.length > 0 ? dispoList.map((dispo: Dispo) => <option key={dispo._id} value={dispo._id}>{dispo.codifica}</option>) : "Non ci sono dispositivi registrati."}
            </select>
            <input value={updatedCodifica??""} onChange={(e) => setUpdatedCodifica(e.target.value)} placeholder="Codifica aggiornata." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <input value={updatedMac??""} onChange={(e) => setUpdatedMac(e.target.value)} placeholder="MAC aggiornato." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <select className="p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" value={type} onChange={(e) => setType(e.target.value)}>
              <option value={"installato"}>Installato</option>
              <option value={"test"}>Test</option>
            </select>
            <button type="submit" className="px-4 bg-blue-500/90 hover:bg-blue-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"><MdUpdate/> Aggiorna</button>
          </form>

          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur overflow-auto scrollbar-elegant max-h-[70vh]">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-gray-900/70 border-b border-white/10 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">ID</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">MAC</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Codifica</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Unità Misurata</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {dispoList.length > 0 ? dispoList.map((dispo: Dispo, id: number) => {
                  return(
                    <tr key={id} className="odd:bg-white/[0.02] even:bg-transparent hover:bg-white/[0.06] transition">
                      <td className="py-2 px-4 text-center">{dispo._id}</td>
                      <td className="py-2 px-4 text-center">{dispo.mac}</td>
                      <td className="py-2 px-4 text-center">{dispo.codifica}</td>
                      <td className="py-2 px-4 text-center">{dispo.unita_misurata ? dispo.unita_misurata.codifica.toUpperCase() : "N/A"}</td>
                      <td className="py-2 px-4 text-center flex gap-2 justify-center">
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveDispo(e, dispo._id)}} className="h-10 w-24 bg-red-500/90 hover:bg-red-500 rounded-xl text-white font-semibold transition">Rimuovi</button>
                      </td>
                    </tr>
                  )
                }): <tr><td colSpan={5} className="text-center w-full text-xl p-5 font-semibold text-white/70">Non ci sono dispositivi registrati.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section == "unita" && (
        <div className="p-10 flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold">UNITA' MISURATE</h1>

          <form onSubmit={handleAddUnita} className="flex w-full gap-2 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
            <input onChange={(e) => setCodificaUnita(e.target.value)} placeholder="Codifica dell'unità." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <input type="number" onChange={(e) => setTempLimit(parseInt(e.target.value))} placeholder="Temperatura Limite." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <button type="submit" className="px-4 bg-emerald-500/90 hover:bg-emerald-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"><FiPlus/> Aggiungi</button>
          </form>

          <form onSubmit={handleUpdateUnita} className="flex w/full gap-2 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
            <select  onChange={(e) => setUpdatedUnitaId(e.target.value)} className="p-2 rounded-lg w-full bg-white/5 border border-white/10 focus:outline-none">
              {unitaList.length > 0 ? unitaList.map((unita: Unita) => <option key={unita._id} value={unita._id}>{unita.codifica.toUpperCase()}</option>) : "Non ci sono dispositivi registrati."}
            </select>
            <input onChange={(e) => setUpdatedCodificaUnita(e.target.value)} placeholder="Codifica dell'unità aggiornata." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <input type="number" onChange={(e) => setUpdatedTempLimit(parseInt(e.target.value))} placeholder="Temperatura Limite aggiornata." className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"/>
            <button type="submit" className="px-4 bg-blue-500/90 hover:bg-blue-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"><MdUpdate/> Aggiorna</button>
          </form>

          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur overflow-auto scrollbar-elegant max-h-[70vh]">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-900/70 border-b border-white/10 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text.white/80">ID</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text.white/80">Codifica</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text.white/80">Temperatura Limite</th>
                  <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wide text.white/80">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {unitaList.length > 0 ? unitaList.map((unita: Unita, id: number) => {
                  return(
                    <tr key={id} className="odd:bg-white/[0.02] even:bg-transparent hover:bg-white/[0.06] transition">
                      <td className="py-2 px-4 text-center">{unita._id}</td>
                      <td className="py-2 px-4 text-center">{unita.codifica.toUpperCase()}</td>
                      <td className="py-2 px-4 text-center">{unita.tempLimit}°C</td>
                      <td className="py-2 px-4 text-center">
                        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleRemoveUnita(e, unita._id)}} className="h-10 w-24 bg-red-500/90 hover:bg-red-500 rounded-xl text-white font-semibold transition">Rimuovi</button>
                      </td>
                    </tr>
                  )
                }): <tr><td colSpan={4} className="text-center w-full text-xl p-5 font-semibold text-white/70">Non ci sono dispositivi registrati.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section == "parametri" && (
        <div className="p-10 flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold">PARAMETRI</h1>

          {paramsLoading && <div className="text-white/60">Caricamento parametri…</div>}
          {paramsError && <div className="text-red-400">Impossibile caricare i parametri.</div>}

          {!paramsLoading && !paramsError && (
            <>
              {/* --- PARAMETRO: TEMPO MASSIMO --- */}
              <form onSubmit={handleUpdateMaxTime} className="flex flex-col w-full gap-4 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-xl">Tempo massimo di aggiornamento dispositivo</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Ore</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={maxH}
                      onChange={(e) => setMaxH(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value || "0")))}
                      placeholder="0"
                      className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Minuti</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={1}
                      value={maxM}
                      onChange={(e) => setMaxM(e.target.value === "" ? "" : Math.min(59, Math.max(0, parseInt(e.target.value || "0"))))}
                      placeholder="0"
                      className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-white/70 mb-1">Secondi</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={1}
                      value={maxS}
                      onChange={(e) => setMaxS(e.target.value === "" ? "" : Math.min(59, Math.max(0, parseInt(e.target.value || "0"))))}
                      placeholder="0"
                      className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-sm text-white/70">
                  Totale: <span className="font-semibold text-white">{totalMs.toLocaleString()} ms</span> ({pad2(hh)}:{pad2(mm)}:{pad2(ss)})
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 bg-blue-500/90 hover:bg-blue-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"
                  >
                    <MdUpdate/> Aggiorna
                  </button>
                </div>
              </form>

              {/* --- PARAMETRO: LISTA EMAIL --- */}
              <div className="flex flex-col w-full gap-4 bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-xl">Lista Email</h1>
                </div>

                <div className="flex gap-2">
                  <input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Aggiungi email (es. nome@dominio.com)"
                    className="p-2 rounded-lg w-full bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEmailToList();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addEmailToList}
                    className="px-4 bg-emerald-500/90 hover:bg-emerald-500 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition"
                    aria-label="Aggiungi email"
                    title="Aggiungi email"
                  >
                    <FiPlus /> Aggiungi
                  </button>
                </div>

                {emailList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {emailList.map((mail) => (
                      <span
                        key={mail}
                        className="inline-flex items-center gap-2 px-3 h-9 rounded-xl bg-white/10 border border-white/10 text-sm"
                      >
                        {mail}
                        <button
                          type="button"
                          onClick={() => removeEmailFromList(mail)}
                          className="p-1 rounded-lg hover:bg-white/10 transition"
                          aria-label={`Rimuovi ${mail}`}
                          title={`Rimuovi ${mail}`}
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">Nessuna email presente.</div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveEmailList}
                    disabled={savingEmails}
                    className={`px-4 rounded-xl flex justify-center items-center gap-2 text-white font-semibold transition ${
                      savingEmails ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-500/90 hover:bg-blue-500"
                    }`}
                  >
                    <MdUpdate /> {savingEmails ? "Salvataggio..." : "Salva lista"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      
 

      <Modal
        open={confirmOpen}
        title="Confermi l'aggiornamento dei parametri?"
        onCancel={closeConfirmParams}
        onConfirm={confirmUpdateMaxTime}
        confirmLabel="Aggiorna"
      >
        {confirmParams && (
          <div className="space-y-2">
            <p>Stai aggiornando <span className="font-semibold">maxDispoUpdateTime</span>.</p>
            <div className="text-sm text-white/80">
              Da
              <span className="mx-1 font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10">{msToLabel(confirmParams.prevMs)}</span>
              a
              <span className="mx-1 font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10">{msToLabel(confirmParams.newMs)}</span>
            </div>
            <p className="text-xs text-white/60">Premi ESC o clicca fuori per annullare.</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Settings
