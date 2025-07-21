import { useSelector } from "react-redux";
import Overlay from "../components/Overlay.tsx";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";
import { useGetLastQuery } from "../services/apis/logsApi.ts";
import { DateTime } from "luxon";

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
    let errorList = []
    
    



        const { data, isLoading} = useGetLastQuery({daysBefore: 30}, {pollingInterval: 3000})
        if(!isLoading){
        const ultimo = data.data.reduce((a: any,b: any) => DateTime.fromISO(a.ts_registrazione) > DateTime.fromISO(b.ts_registrazione) ? a : b)
        const timeStampLocal = DateTime.fromISO(ultimo.ts_registrazione).toLocal().plus({hours: 2});
        elapsedTime = calcElapsedTime(timeStampLocal.toISO() ?? "")
        onlineSensorCount = data.data.filter((item: any) => !item.dispo_codifica.startsWith("ASI-VIRTUAL")).length
        errorCount = data.data.filter((item: any) => item.isInTempAlarm === true).length
        errorList = data.data.filter((item: any) => item.isInTempAlarm === true)
        .map((item:any) => {
            const localTime = DateTime.fromISO(item.ts_registrazione)
            .setZone("Europe/Rome")
            .plus({hours: 2});
            return {
                codifica: item.dispo_codifica,
                description: "Temperatura oltre la soglia",
                timestamp: localTime.toFormat("dd/MM/yyyy HH:mm:ss")
            }
        })
        /*.map((item: any) => {  
            const {itemData} = getDispoData(item._id)
            const tempLimit = itemData.tempLimit; const temp = itemData.temp;

            const messaggio = tempLimit !== undefined ? `Temperature oltre la soglia: ${temp.toFixed(1)}°C > ${tempLimit.toFixed(1)}` 
            : `Temperatura oltre la soglia: ${temp.toFixed(1)}°C (limite non disponibile)`
            return {
                codifica: item.dispo_codifica,
                messaggio,
                timestap: item.ts_registrazione
            }
        })

        console.log(errorList)
        Im making a hacking device for ethical use that has a core mcu (esp32-fn8) and a co-mcu (stm32f103c8t6). The esp32-s3 is the "brain"
        and controls the display, the buttons, and sends commands to the co-mcu (stm32) via UART (tx, rx). The co-mcu (stm32) is wired to all
        the peripherals: ST25R for NFC/RFID, IR leds, CC1101 for Sub-GHz and the user's GPIOs (SPI, UART, I2C). It also supports a crypto IC
        (still need to search one) that basically makes the device a crypto-wallet too! (Would like to expand on paying and selling with crypto.) 
        (And/Or make a crypto coin for the Nemesis device!!!).
        */
    }


    return (
        <div className="relative w-full overflow-clip min-h-screen">
            <Overlay email={user} role={role} errorCount={errorCount} onlineSensorCount={onlineSensorCount} elapsedTime={elapsedTime} errors={errorList}
            />
            {!isLoading && <InteractivePanel sensorData={data.data}/>}
        </div>

    )
}

export default Dashboard;