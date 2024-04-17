import { NaeroIcon } from "./Naero"

type LogoProps = {
  text: boolean
}

export const Logo = ({ text }: LogoProps) => (
  <span className='flex items-center content-center h-full gap-2'>
    <NaeroIcon className='flex items-center content-center w-24 h-12 py-1' />
    {text && (
      <h1 className='text-2xl font-extrabold text-white'>
        Naerospace
      </h1>
    )}
  </span>
)