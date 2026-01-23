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



const Macchinario = ({ sensorData }: { sensorData: any }) => {
    const hasError = (unita: string) => {
        return sensorData?.some((s: any) => s.unita_misurata === unita && s.isInTempAlarm === true) ?? false;
    }


    return(
        <group>
            <Conveyor hasError={hasError("M1") || hasError("M2")}/>
            <Conveyor2 hasError={hasError("M3")}/>
            <Conveyor3 hasError={hasError("M4")}/>
            <Conveyor4 hasError={hasError("M12")}/>
            <Conveyor5 hasError={hasError("M13") || hasError("M14")}/>
            <Conveyor6 hasError={hasError("M6")}/>
            <Conveyor7  hasError={hasError("M10") || hasError("M11")}/>
            <BagOpener hasError={hasError("lacerasacchi")}/>
            <Vaglio hasError={hasError("M6") || hasError("M7") || hasError("M8")}/>
            <Tramoggia1 hasError={false}/>
            <Tramoggia2 hasError={false}/>
        </group>
    )
}

export default Macchinario