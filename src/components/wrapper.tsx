import { GlobeEuropeAfricaIcon, ChatBubbleLeftEllipsisIcon, VideoCameraIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useWs } from "@/providers/ws"
import { NaeroIcon } from "./icons/naero"
import { Logo } from "./icons/logo"

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
  {
    name: "Streams",
    icon: VideoCameraIcon,
    path: "/vs",
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

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const ws = useWs("Wrapper");

  return (
    <div className={cn("w-full h-dvh max-w-screen font-clash bg-background")}>
      <nav role='list' className={cn('flex items-center content-center justify-between w-full h-16 px-4 border-b border-border', {
        "bg-success/[0.05]": ws.status === 'CONNECTED',
        "bg-warning/[0.05]": ws.status === 'CONNECTING'
      })}>
        <div className='flex items-center content-center gap-4 h-full'>
          <NaeroIcon className='flex items-center content-center w-20 md:w-24 py-1' />
          <ul className='flex h-full gap-1 sm:gap-2 py-1'>
            {nav.map((item, index) => (
              <li key={index}>
                <NavLink className={({ isActive }) => cn(
                  "inline-flex flex-col h-14 items-center justify-center rounded-md bg-background px-3 sm:px-4 text-sm font-medium transition-colors hover:bg-muted/50 focus:bg-muted focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-muted/50",
                  {
                    "bg-muted/50 hover:bg-muted/30": isActive,
                  }
                )} to={item.path}>
                  <item.icon className='w-6 h-6 md:w-8 md:h-8 mx-auto' />
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
      <div className='w-full h-[calc(100dvh-4rem)] overflow-hidden'>
        {children}
      </div>
    </div>
  )
}

export function MiniWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("relative w-full h-screen max-w-screen")}>
      <nav role='list' className={cn('flex items-center content-center justify-between w-full h-16 px-4')}>
        <div className='flex items-center content-center h-full gap-2'>
          <Logo text />
        </div>
      </nav>
      <div className='w-full h-[calc(100vh-4rem)] overflow-hidden'>
        {children}
      </div>
    </div>
  )
}
