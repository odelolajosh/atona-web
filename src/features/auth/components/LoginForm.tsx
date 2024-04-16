import { useForm } from "react-hook-form"
import { Button, Input } from "@/components/ui"
import { NavLink } from "react-router-dom"
import { Spinner } from "@/components/icons/Spinner"
import { useLogin } from "@/lib/auth"
import { RegisterCredentialsDTO } from "../api"


export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentialsDTO>()

  const loginMutation = useLogin()

  const submit = handleSubmit(async (data) => {
    loginMutation.mutate(data, {
      onSuccess
    })
  })

  return (
    <form className="w-[min(100%,500px)] mx-auto mt-14" onSubmit={submit}>
      <h1 className="text-4xl font-bold text-white">Welcome back</h1>
      <p className="text-lg text-gray-300">Please enter your username to continue</p>
      <div className="flex flex-col mt-8">
        <label htmlFor="name" className="text-white">Email</label>
        <Input id="name" className="mt-2 tracking-wide text-lg" {...register('email', { required: true })} placeholder="Naero" autoFocus autoComplete="off" required />
        {errors.email && <p className="text-error mt-2">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col mt-8">
        <label htmlFor="name" className="text-white">Password</label>
        <Input id="name" className="mt-2 tracking-wide text-lg" {...register('password', { required: true })} placeholder="Naero" autoFocus autoComplete="off" required />
        {errors.password && <p className="text-error mt-2">{errors.password.message}</p>}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {errors.root && <p className="text-error">{errors.root.message}</p>}
        <Button type="submit">
          {loginMutation.isPending ? <Spinner /> : 'Login'}
        </Button>
        <span>
          <span className="text-gray-300">New to Naerospace?</span>{' '}
          <NavLink to="/register" className="text-primary">Create an account</NavLink>
        </span>
      </div>
    </form>
  )
}