import { useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { FiArrowLeft } from 'react-icons/fi';
import { useGetLogsQuery } from '../services/apis/logsApi';
import { DateTime } from "luxon"
import { toast, Toaster } from 'sonner';

type DateRange = {
  from: Date;
  to: Date;
}

const Dispositivi = () => {
  const today = new Date(); 
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate()-5);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: fiveDaysAgo,
    to: today,
  });

  const handleDateChange = (range: {from?: Date, to?: Date}) => {
    if(!range.from || !range.to) return;
    setDateRange({from: range.from, to: range.to})

    refetch()
  };

  const { data, error, refetch } = useGetLogsQuery({
    dateStart: dateRange? DateTime.fromJSDate(dateRange.from).toISO({includeOffset: false}) : undefined,
    dateStop: dateRange ? DateTime.fromJSDate(dateRange.to).toISO({includeOffset: false}) : undefined,
  });

  if(error){
    toast.error("Nessun log trovato in quel periodo.");
  }

  const latestLogMap = new Map();

  if(data?.logDispo){
    for(const log of data.logDispo){
    if(!latestLogMap.has(log.codifica)){
        latestLogMap.set(log.codifica, log);
        }
    }
  }

  const convertToPercent = (mv: number) => {
  const min = 2650;
  const max = 3100;
  return Math.max(0, Math.min(100, ((mv - min) / (max - min)) * 100));
  };


  const getColor = (percent: number) => {
  if (percent >= 70) return '#00c950';
  if (percent >= 40) return '#f0b100';
  return '#fb2c36'; 
    };

  const chartData = [...latestLogMap.values()].map((log) => {
    const percent = convertToPercent(log.batt_level);
    return{
        name: log.codifica,
        percent,
        fill: getColor(percent),
    }
  }).sort((a,b) => b.percent-a.percent)

  return (
    <div className="flex p-10 gap-10">
      <Toaster position='top-center' richColors/>
      <div className="flex flex-col gap-10 w-full max-w-[300px]">
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="flex align-middle items-center gap-2 bg-gray-300 rounded-xl font-bold p-2 max-w-[300px]"
          >
            <FiArrowLeft />Panoramica
          </a>
          <h1 className="text-5xl font-black">DISPOSITIVI</h1>
        </div>
        <Calendar
          mode="range"
          required={true}
          selected={dateRange}
          onSelect={handleDateChange}
          className="mx-[-20px] py-2 w-full"
        />
        <div className='w-full flex flex-col justify-start text-start'>
           <h2 className='text-xl font-bold mb-2'>Livello di Batteria dei Sensori</h2> 
           <div className='w-full'>
            {chartData.map((log, id) => (
                (<div key={id} className='flex text-xs justify-between text-start font-semibold'>{log.name}<h1 className='rounded p-1 mt-1 pr-1 ' style={{width: `${log.percent-20}%`, backgroundColor: `${log.fill}`} }>{log.percent.toPrecision(2)}</h1></div>)
            ))} 
           </div>
       </div>
      </div>
      <div>
       <table className="w-full border-3 rounded-xl text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-center">Codifica</th>
                                    <th className="py-2 px-4 border-b text-center">ID</th>
                                    <th className="py-2 px-4 border-b text-center">Liv. Batteria</th>
                                    <th className="py-2 px-4 border-b text-center">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.logDispo.length > 0 ? data?.logDispo.map((log: any, id: number) => {
                                    
                                 const formattedDate = DateTime
                                .fromISO(log.ts_registrazione, { zone: 'utc' }) 
                                .setZone('local') 
                                .toFormat('dd-MM HH:mm'); 

                                    return(
                                        <tr key={id}>
                                            <td className="py-2 px-4 text-center">{log.codifica}</td>
                                            <td className='py-2 px-4 text-center'>{log._id}</td>
                                            <td className="py-2 px-4 text-center">{convertToPercent(log.batt_level).toPrecision(2)}%</td>
                                            <td className='py-2 px-4 text-center'>{formattedDate}</td>
                                        </tr>
                                    )
                                }): <tr><td colSpan={4} className="text-center w-full text-xl p-5 font-semibold">Non ci sono log in questo periodo.</td></tr>}
                </tbody>
            </table> 
      </div>
    </div>
  );
};

export default Dispositivi;
