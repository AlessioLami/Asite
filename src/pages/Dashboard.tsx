import { useSelector } from "react-redux";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";
import { useGetLastQuery } from "../services/apis/logsApi.ts";
import { DateTime } from "luxon";
import { GoAlertFill } from "react-icons/go"
import { FaBug, FaCircle, FaClock, FaWifi } from "react-icons/fa";
import { VscSettings} from "react-icons/vsc"
import {BsCpuFill} from "react-icons/bs"
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/slices/authSlice.ts";

const calcElapsedTime = (data : string) => {
    const delta = Date.now() - new Date(data).getTime();
    const s = Math.floor(delta / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

   const parts = [
    d ? `${d}d` : '',
    h % 24 ? `${h % 24}h` : '',
    m % 60 ? `${m % 60}m` : '',
    s % 60 || (!d && !h && !m) ? `${s % 60}s` : ''
  ].filter(Boolean) 
  return `${parts.join(' ')}`;
}


const Dashboard = () => {

    


    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role).toUpperCase()
    let elapsedTime = ""
    let onlineSensorCount = 0
    let errorCount = 0
    let erroriAttendibili: any[] = []
    let erroriNonAttendibili : any[] = []
    
    



        const { data, isLoading} = useGetLastQuery({daysBefore: 60}, {pollingInterval: 3000})
        if(!isLoading){
        const ultimo = data.data.reduce((a: any,b: any) => DateTime.fromISO(a.ts_registrazione) > DateTime.fromISO(b.ts_registrazione) ? a : b)
        const timeStampLocal = DateTime.fromISO(ultimo.ts_registrazione).toLocal().plus({hours: 2});
        elapsedTime = calcElapsedTime(timeStampLocal.toISO() ?? "")
        onlineSensorCount = data.data.filter((item: any) => !item.dispo_codifica.startsWith("ASI-VIRTUAL")).length
        errorCount = data.data.filter((item: any) => item.isInTempAlarm === true).length


        data.data.filter((item: any) => item.isInTempAlarm === true).sort((a: any,b: any) => DateTime.fromISO(b.ts_registrazione).toMillis() - DateTime.fromISO(a.ts_registrazione).toMillis()).forEach((item: any) => {
            const ts = DateTime.fromISO(item.ts_registrazione).setZone("Europe/Rome").plus({hours: 2})
            const diffInMinutes = DateTime.now().setZone("Europe/Rome").diff(ts, "minutes").as("minutes")

            const error = {
                codifica: item.dispo_codifica,
                description: `Temperatura oltre la soglia di ${(item.temp_calc - item.tempLimit).toFixed(1)}°C`,
                limite: item.tempLimit,
                time: ts.toFormat("HH:mm:ss"),
                date: ts.toFormat("dd/MM/yyyy")
            }

            if(diffInMinutes <= 8){
                erroriAttendibili.push(error)
            }else{
                erroriNonAttendibili.push(error)
            }
            
       })
        


        
      
    }

    const navigate = useNavigate()

    return (
            <div className="relative w-full overflow-y-hidden h-screen bg-gray-800">
                {//<Overlay email={user} role={role} errorCount={errorCount} onlineSensorCount={onlineSensorCount} elapsedTime={elapsedTime} errors={errorList}
            }

               <div className="h-full">
                    <div className="flex justify-between px-5 py-3">
                        <div className="flex gap-5 items-center align-middle leading-none">
                            <h1 className="text-white text-2xl font-bold">Selezione Rifiuti Urbani</h1>
                            <h1 className={`text-${errorCount > 0 ? "red-500" : "green-500"} h-[30px] ${errorCount > 0 ? "bg-red-500/20" : "bg-green-500/20"} rounded-full px-2 text-lg flex font-semibold items-center align-middle truncate leading-none`}><FaCircle className= "h-4 w-4 mr-1" color={errorCount > 0 ? "red" : "green"}/>Stato:<span className="ml-1">{errorCount > 0 ? "KO" : "OK"}</span></h1>
                        </div>
                    <div className="flex gap-2 items-center justify-center align-middle">
                        <h1 className="rounded-full p-3 bg-blue-500/69 w-8 h-8 text-white font-semibold flex items-center justify-center">WI</h1>
                        <div className="flex flex-col">
                            <h1 className="text-white">{user}</h1>
                            <p className="text-gray-400">{role}</p>
                        </div>
                    </div>
                </div> 
                <div className="flex">
                    <div className="w-[500px] px-3 flex flex-col justify-between h-full">
                        <div className="bg-gray-900 rounded-xl p-3 flex flex-col gap-4">
                            <h1 className="text-white text-lg font-semibold">Stato del Sistema</h1>
                            <h1 className="flex text-lg items-center align-middle text-white font-semibold"><GoAlertFill color="#EF4444" className="h-4 mr-2"/>Stato <span className={`ml-auto ${errorCount>0?"bg-red-500/20 text-red-500":"bg-green-500/20 text-green-500"} px-2 rounded-md font-semibold`}>{errorCount>0?"KO":"OK"}</span></h1>
                            <h1 className="flex text-lg items-center align-middle text-white font-semibold"><FaBug color="#F59E0B" className="h-4 mr-2"/>Errori <span className={`ml-auto ${errorCount>0?"bg-yellow-500/20 text-yellow-500":"bg-green-500/20 text-green-500"} px-2 rounded-md font-semibold`}>{errorCount}</span></h1>
                            <h1 className="flex text-lg items-center align-middle text-white font-semibold"><FaWifi color="#10B981" className="h-4 mr-2"/>Dispositivi <span className={`ml-auto bg-green-500/20 text-green-500 px-2 rounded-md font-semibold`}>{onlineSensorCount}</span></h1>
                            <h1 className="flex text-lg items-center align-middle text-white font-semibold"><FaClock color="#3B82F6" className="h-4 mr-2"/>Ultimo update<span className={`ml-auto px-2 rounded-md font-semibold text-sm`}>{elapsedTime}</span></h1>
                            <h1></h1>
                        </div>
                        <div className="flex flex-col gap-3  mt-[20%] mb-[50%]">
                            <button onClick={() => navigate("/dispositivi")}className="flex items-center hover:cursor-pointer hover:bg-gray-900/69 text-xl font-bold text-white bg-gray-900 w-full rounded-xl p-3"><BsCpuFill className="mr-2"/>Log Dispositivi</button>
                            <button onClick={() => navigate("/sniffer")} className="flex items-center hover:cursor-pointer hover:bg-gray-900/69 text-xl font-bold text-white bg-gray-900 w-full rounded-xl p-3"><FaWifi className="mr-2"/>Sniffer</button>
                            <button onClick={() => navigate("/settings")}className="flex items-center hover:cursor-pointer hover:bg-gray-900/69 text-xl font-bold text-white bg-gray-900 w-full rounded-xl p-3"><VscSettings className="mr-2"/>Impostazioni</button>
                        </div> 

                        <button onClick={() => logout()}className="flex items-center text-xl font-bold hover:cursor-pointer hover:bg-blue-600/10 text-blue-500 bg-blue-600/20 w-full rounded-xl p-3"><FiLogOut className="mr-2"/>Logout</button>
                    </div>
                    {!isLoading && <InteractivePanel sensorData={data.data}/>}
                    <div className="h-screen w-[500px] px-3">
                        <h1 className="text-white text-xl font-semibold mb-5">Errori del Sistema ({erroriAttendibili.length})</h1>
                        <div className="flex flex-col gap-3">
                            {erroriAttendibili.length > 0 ? erroriAttendibili.map((error: any) => (
                                <div className="flex flex-col items-start bg-red-500/10 border-red-500/30 border-[0.1px] p-3 rounded-xl">
                                    <div className="flex justify-between w-full items-center"><h1 className="font-semibold flex items-center align-middle text-white text-lg"><FaCircle className="text-red-500 mr-2 h-2"/>{error.codifica}</h1><h1 className="text-gray-300 text-sm font-semibold">{error.time}</h1></div>
                                    <h1 className="text-white font-semibold">{error.description}</h1>
                                    <div className="flex justify-between w-full"><p className="text-gray-300 font-semibold text-sm">Limite temperatura: {error.limite}°C</p><p className="text-gray-300 text-sm font-semibold">{error.date}</p></div>
                                </div>
                            )) : ""}
                        </div>
                        <h1 className="text-white text-xl font-semibold mb-5">Errori non attendibili ({erroriNonAttendibili.length})</h1>
                        <div className="flex flex-col gap-3">
                            {erroriNonAttendibili.length > 0 ? erroriNonAttendibili.map((error: any) => (
                                  <div className="flex flex-col items-start bg-orange-500/10 border-orange-500/30 border-[0.1px] p-3 rounded-xl">
                                    <div className="flex justify-between w-full items-center"><h1 className="font-semibold flex items-center align-middle text-white text-lg"><FaCircle className="text-orange-500 mr-2 h-2"/>{error.codifica}</h1><h1 className="text-gray-300 text-sm font-semibold">{error.time}</h1></div>
                                    <h1 className="text-white font-semibold">{error.description}</h1>
                                    <div className="flex justify-between w-full"><p className="text-gray-300 font-semibold text-sm">Limite temperatura: {error.limite}°C</p><p className="text-gray-300 text-sm font-semibold">{error.date}</p></div>
                                </div>  
                            )) : <h1>Non ci sono errori non attendibili nel sistema!</h1>}
                        </div>

                    </div>


                </div>
            </div>

            
        </div>

    )
}

export default Dashboard;