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

export type MacchinaData = {
    _id: string;
    codifica: string;
    descrizione: string;
    tipo: string;
    unitaMisurate: {
        _id: string;
        codifica: string;
        tipo: string;
        tempLimit: number;
        dispositivo?: {
            _id: string;
            mac: string;
            codifica: string;
        };
    }[];
};

export type ErrorProps = {
    hasError: boolean;
    hasWarning: boolean;
    macchina?: MacchinaData;
}

const Macchinario = ({ sensorData, parameters, unita, macchine }: { sensorData: any; parameters: any; unita: any; macchine: any }) => {
    const maxDispoUpdateTime = Array.isArray(parameters) ? (parameters.find((p: any) => p.keySetting === "maxDispoUpdateTime")?.numberValue ?? 0) : 0;

    const getUnitaId = (codifica: string) => {
        if (!Array.isArray(unita)) return undefined;
        return unita.find((u: any) => u.codifica?.toUpperCase() === codifica.toUpperCase())?._id;
    }

    const getMacchina = (codifica: string): MacchinaData | undefined => {
        if (!Array.isArray(macchine)) return undefined;
        return macchine.find((m: MacchinaData) => m.codifica === codifica);
    }

    const hasError = (unitaCodifica: string) => {
        const unitaId = getUnitaId(unitaCodifica);
        if (!unitaId || !Array.isArray(sensorData)) return false;
        return sensorData.some((s: any) => s.unita_misurata === unitaId && s.isInTempAlarm === true);
    }

    const hasWarning = (unitaCodifica: string) => {
        const unitaId = getUnitaId(unitaCodifica);
        if (!unitaId || !Array.isArray(sensorData)) return false;
        const sensor = sensorData.find((s: any) => s.unita_misurata === unitaId);
        if (!sensor) return false;
        const ts = DateTime.fromISO(sensor.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
        const diffMs = DateTime.now().setZone("Europe/Rome").diff(ts, "milliseconds").as("milliseconds");
        return diffMs > maxDispoUpdateTime;
    }

    return(
        <group>
            <Conveyor hasError={hasError("M1") || hasError("M2")} hasWarning={hasWarning("M1") || hasWarning("M2")} macchina={getMacchina("rullo-01")}/>
            <Conveyor2 hasError={hasError("M3")} hasWarning={hasWarning("M3")} macchina={getMacchina("rullo-02")}/>
            <Conveyor3 hasError={hasError("M5")} hasWarning={hasWarning("M5")} macchina={getMacchina("rullo-03")}/>
            <Conveyor4 hasError={hasError("M12")} hasWarning={hasWarning("M12")} macchina={getMacchina("rullo-004")}/>
            <Conveyor5 hasError={hasError("M13") || hasError("M14")} hasWarning={hasWarning("M13") || hasWarning("M14")} macchina={getMacchina("rullo-005")}/>
            <Conveyor6 hasError={hasError("M9")} hasWarning={hasWarning("M9")} macchina={getMacchina("rullo-006")}/>
            <Conveyor7 hasError={hasError("M10") || hasError("M11")} hasWarning={hasWarning("M10") || hasWarning("M11")} macchina={getMacchina("rullo-007")}/>
            <BagOpener hasError={hasError("lacerasacchi")} hasWarning={hasWarning("lacerasacchi")}/>
            <Vaglio hasError={hasError("M6") || hasError("M7") || hasError("M8")} hasWarning={hasWarning("M6") || hasWarning("M7") || hasWarning("M8")} macchina={getMacchina("vaglio-01")}/>
            <Tramoggia1 hasError={false} hasWarning={false}/>
            <Tramoggia2 hasError={false} hasWarning={false}/>
        </group>
    )
}

export default Macchinario