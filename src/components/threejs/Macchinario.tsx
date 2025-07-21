import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";
import Vaglio from "./Vaglio";

export type ErrorProps = {
    hasError: boolean;
}



const Macchinario = (sensorData: any) => {


    const hasError = (unita: string) => {
        return sensorData.sensorData.sensorData.some((s: any) => s.unita_misurata === unita && s.isInTempAlarm === true);
    }


    return(
        <group>
            <Conveyor hasError={hasError("conveyor")}/>
            <Conveyor2 hasError={hasError("conveyor2")}/>
            <Conveyor3 hasError={hasError("conveyor3")}/>
            <Conveyor4 hasError={hasError("conveyor4")}/>
            <BagOpener hasError={hasError("aprisacchi")}/>
            <Vaglio hasError={hasError("vaglio")}/>
        </group>
    )
}

export default Macchinario