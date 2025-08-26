import BagOpener from "./BagOpener";
import Conveyor from "./Conveyor"
import Conveyor2 from "./Conveyor2"
import Conveyor3 from "./Conveyor3";
import Conveyor4 from "./Conveyor4";
import Conveyor5 from "./Conveyor5";
import Conveyor6 from "./Conveyor6";
import Conveyor7 from "./Conveyor7";
import Tramoggia1 from "./Tramoggia1";
import Tramoggia2 from "./Tramoggia2";
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
            <Conveyor5 hasError={hasError("conveyor5")}/>
            <Conveyor6 hasError={hasError("conveyor6")}/>
            <Conveyor7  hasError={hasError("conveyor7")}/>
            <BagOpener hasError={hasError("aprisacchi")}/>
            <Vaglio hasError={hasError("vaglio")}/>
            <Tramoggia1 hasError={false}/>
            <Tramoggia2 hasError={false}/>
        </group>
    )
}

export default Macchinario