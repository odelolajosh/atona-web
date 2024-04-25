import { Spinner } from "@/components/icons/spinner";
import { Button } from "@/components/ui/button";

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Spinner />
  </div>
);

const ErrorFallback = () => (
  <div
    className="text-destructive w-screen h-screen flex flex-col justify-center items-center"
    role="alert"
  >
    <h2 className="scroll-m-20 pb-2 text-3xl font-medium tracking-tight">Network error :( </h2>
    <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
      Refresh
    </Button>
  </div>
);

export { LoadingFallback, ErrorFallback };
