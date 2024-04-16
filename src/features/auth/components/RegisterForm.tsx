import { useForm } from "react-hook-form"
import { Button, Input } from "@/components/ui"
import { NavLink } from "react-router-dom"
import { Spinner } from "@/components/icons/Spinner"
import { useRegister } from "@/lib/auth"
import { RegisterCredentialsDTO } from "../api"


export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentialsDTO>()

  const registerMutation = useRegister()

  const submit = handleSubmit(async (data) => {
    registerMutation.mutate(data, {
      onSuccess
    })
  })

  return (
    <form className="w-[min(100%,500px)] mx-auto mt-14" onSubmit={submit}>
      <h1 className="text-4xl font-bold text-white">Welcome to Naero Chat</h1>
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
          {registerMutation.isPending ? <Spinner /> : 'Create account'}
        </Button>
        <span>
          <span className="text-gray-300">Already have an account?</span>{' '}
          <NavLink to="/login" className="text-primary">Create an account</NavLink>
        </span>
      </div>
    </form>
  )
}