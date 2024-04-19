import { NaeroIcon } from "./naero"

type LogoProps = {
  text?: boolean
}

export const Logo = ({ text }: LogoProps) => (
  <span className='flex items-center content-center h-full gap-2'>
    <NaeroIcon width={32} />
    {text && (
      <h1 className='text-2xl font-medium text-white'>
        Naerospace
      </h1>
    )}
  </span>
)