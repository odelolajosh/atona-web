type SvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
}

const Svg: React.FC<SvgProps> = ({ size = 24, ...props }) => {
  return (
    <svg {...props} width={size} height={size} xmlns="http://www.w3.org/2000/svg" />
  )
}

export default Svg;
export type { SvgProps };
