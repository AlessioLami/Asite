import { useSelector } from "react-redux";
import Overlay from "../components/Overlay.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";
import { useGetLogsQuery } from "../services/apis/logsApi.ts";
import { useEffect, useState } from "react";

const calcElapsedTime = (data : Date) => {
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

    const [dateStop, setDateStop] = useState(new Date().toISOString())

    useEffect(() => {
        const interval = setInterval(() => {
        setDateStop(new Date().toISOString());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

    const user = useSelector((state: RootState) => state.auth.user)
    const role = useSelector((state: RootState) => state.auth.role).toUpperCase()
    let elapsedTime = ""
    let onlineSensorCount = 0
    let errorCount = 9

    const { data, isLoading} = useGetLogsQuery({dateStart: "2025-07-02T05:55Z", dateStop: dateStop}, {pollingInterval: 10000})
    if(!isLoading){
        console.log(data)

    elapsedTime = calcElapsedTime(data.assetQueryList.lastDate)
    onlineSensorCount = data.assetQueryList.uniqueDispo[0] === null ? 0 : data.assetQueryList.uniqueDispo.length  
    }

    
    
    return (
        <div className="relative w-full overflow-clip min-h-screen">
            <Overlay email={user} role={role} errorCount={errorCount} onlineSensorCount={onlineSensorCount} elapsedTime={elapsedTime}/>
            <InteractivePanel/>
        </div>

    )
}

export default Dashboard;