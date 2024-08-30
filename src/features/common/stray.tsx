import { MiniWrapper } from "@/components/wrapper"

// Our 404 page
const Stray = () => {
  return (
    <MiniWrapper>
      <div className="h-full w-full flex flex-col items-center justify-center text-center bg-background text-primary-foreground">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">404</h1>
        <p>Sorry, we couldn't find that page.</p>
      </div>
    </MiniWrapper>
  )
}

export { Stray }