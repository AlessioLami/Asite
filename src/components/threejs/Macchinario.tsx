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
import { DateTime } from "luxon";

export type ErrorProps = {
    hasError: boolean;
    hasWarning: boolean;
}

const Macchinario = ({ sensorData, parameters, unita }: { sensorData: any; parameters: any; unita: any }) => {
    const maxDispoUpdateTime = parameters?.find((p: any) => p.keySetting === "maxDispoUpdateTime")?.numberValue ?? 0;

    const getUnitaId = (codifica: string) => {
        return unita?.find((u: any) => u.codifica?.toUpperCase() === codifica.toUpperCase())?._id;
    }

    const hasError = (unitaCodifica: string) => {
        const unitaId = getUnitaId(unitaCodifica);
        if (!unitaId) return false;
        return sensorData?.some((s: any) => s.unita_misurata === unitaId && s.isInTempAlarm === true) ?? false;
    }

    const hasWarning = (unitaCodifica: string) => {
        const unitaId = getUnitaId(unitaCodifica);
        if (!unitaId) return false;
        const sensor = sensorData?.find((s: any) => s.unita_misurata === unitaId);
        if (!sensor) return false;
        const ts = DateTime.fromISO(sensor.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
        const diffMs = DateTime.now().setZone("Europe/Rome").diff(ts, "milliseconds").as("milliseconds");
        return diffMs > maxDispoUpdateTime;
    }

    return(
        <group>
            <Conveyor hasError={hasError("M1") || hasError("M2")} hasWarning={hasWarning("M1") || hasWarning("M2")}/>
            <Conveyor2 hasError={hasError("M3")} hasWarning={hasWarning("M3")}/>
            <Conveyor3 hasError={hasError("M4")} hasWarning={hasWarning("M4")}/>
            <Conveyor4 hasError={hasError("M12")} hasWarning={hasWarning("M12")}/>
            <Conveyor5 hasError={hasError("M13") || hasError("M14")} hasWarning={hasWarning("M13") || hasWarning("M14")}/>
            <Conveyor6 hasError={hasError("M6")} hasWarning={hasWarning("M6")}/>
            <Conveyor7 hasError={hasError("M10") || hasError("M11")} hasWarning={hasWarning("M10") || hasWarning("M11")}/>
            <BagOpener hasError={hasError("lacerasacchi")} hasWarning={hasWarning("lacerasacchi")}/>
            <Vaglio hasError={hasError("M6") || hasError("M7") || hasError("M8")} hasWarning={hasWarning("M6") || hasWarning("M7") || hasWarning("M8")}/>
            <Tramoggia1 hasError={false} hasWarning={false}/>
            <Tramoggia2 hasError={false} hasWarning={false}/>
        </group>
    )
}

export default Macchinario