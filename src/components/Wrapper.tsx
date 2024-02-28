import { PaperAirplaneIcon, GlobeEuropeAfricaIcon, BoltIcon, PowerIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useWs } from "@/provider/WsProvider"
import { NaeroIcon } from "./icons/Naero"

/******** Navigation ********/
const nav = [
  {
    name: "Overview",
    icon: GlobeEuropeAfricaIcon,
    path: "/",
  },
  // {
  //   name: "Flight",
  //   icon: PaperAirplaneIcon,
  //   path: "/fp",
  // },
  
  {
    name: "Chat",
    icon: ChatBubbleLeftEllipsisIcon,
    path: "/chat",
  },
  // {
  //   name: "Terminal",
  //   icon: CommandLineIcon,
  //   path: "/console",
  // },
  // {
  //   name: "Settings",
  //   icon: Cog6ToothIcon,
  //   path: "/config",
  // }
]

export default function Wrapper() {
  const ws = useWs("Wrapper");

  return (
    <div className={cn("w-full h-screen select-none max-w-screen font-clash bg-background")}>
      <nav role='list' className={cn('flex items-center content-center justify-between w-full h-16 px-4 text-white', {
        "bg-success/20": ws.status === 'CONNECTED',
        "bg-warning/20": ws.status === 'CONNECTING'
      })}>
        <div className='flex items-center content-center h-full'>
          <NaeroIcon className='flex items-center content-center w-24 h-12 py-1' />
          <ul className='grid h-full grid-cols-5 gap-2 py-1 ml-5'>
            {nav.map((item, index) => (
              <li key={index}>
                <NavLink className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center h-full px-3 rounded-md",
                  "hover:text-zinc-100 text-zinc-500",
                  {
                    "bg-zinc-500/20 text-zinc-100": isActive,
                  }
                )} to={item.path}>
                  <item.icon className='w-8 h-8 mx-auto' />
                  <span className='text-xs'>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex py-2 '>
          {/* {status !== 'CONNECTED' ? <div className='mx-4'>
            <label htmlFor="com" className="block text-sm font-medium text-white">
              Port
            </label>
            <select
              id="com"
              name="com"
              ref={comRef}
              onChange={(e) => {
                setSelectedPort(e.target.value.toUpperCase())
                window.electron.store.set('conn', 'selectedPort', e.target.value);
              }}
              className="z-50 block w-full py-1 pl-2 mt-1 text-base uppercase bg-transparent border border-gray-300 rounded-md pr-9 focus:outline-none sm:text-sm"
              defaultValue={selectedPort}
            >
              {ports.map((port, index) =>
                <option key={index} selected={port === selectedPort} value={port}>{port}</option>
              )}
            </select>
          </div> : null} */}

          {/* <div className='mx-4'>
            <label htmlFor="baud" className="block text-sm font-medium text-white">
              Baudrate
            </label>
            <select
              id="baud"
              name="baud"
              className="z-50 block w-full py-1 pl-2 mt-1 text-base bg-transparent border border-gray-300 rounded-md pr-9 focus:outline-none sm:text-sm"
              defaultValue="57600"
            >
              <option value="19200">19200</option>
              <option value="38400">38400</option>
              <option value="57600">57600</option>
              <option value="115200">115200</option>
              <option value="230400">230400</option>
            </select>
          </div> */}

          {/* {ws.status === 'CONNECTING' ? (
            <div className='flex flex-col items-center content-center justify-between cursor-not-allowed'>
              <BoltIcon className='w-6 h-6 mx-auto text-white' />
              <span className="text-sm text-gray-200">Connecting...</span>
            </div>
          ) : status === 'CONNECTED' ? (
            <div className='flex flex-col items-center content-center justify-between cursor-pointer' onClick={() => {
              ws.disconnect();
            }}>
              <PowerIcon className='w-6 h-6 mx-auto text-white' />
              <span>Disconnect</span>
            </div>
          ) : (
            <div className='flex flex-col items-center content-center justify-between cursor-pointer' onClick={() => {
              ws.connect();
            }}>
              <PowerIcon className='w-6 h-6 mx-auto text-white' />
              <span>Connect</span>
            </div>
          )} */}
        </div>
      </nav>
      <div className='w-full h-[calc(100vh-4rem)] overflow-hidden'>
        <Outlet />
      </div>
    </div>
  )
}
