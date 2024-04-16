import React, { useMemo } from "react"
import { useTypedChat } from "../hooks/useChat"
import { uuid } from "@/lib/utils"
import { storage } from "@/lib/storage"
import { useForm } from "react-hook-form"
import { Button, Input } from "@/components/ui"
import { Presence, User, UserStatus } from "@chatscope/use-chat"
import chatAPI from "../lib/api"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Spinner } from "@/components/icons/Spinner"

const getMacAddress = uuid

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<{ name: string }>()
  const [loading, setLoading] = React.useState(false)
  const { setCurrentUser } = useTypedChat()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const submit = handleSubmit(async ({ name }) => {
    try {
      setLoading(true)
      const macAddress = getMacAddress()
      const user = await chatAPI.authenticateUser(name, macAddress)
      const currentUser = new User({
        id: user.uuid,
        presence: new Presence({ status: user.online ? UserStatus.Available : UserStatus.Away }),
        username: user.name,
        avatar: user.avatarUrl,
        data: {}
      })
      storage.set('user', currentUser)
      setCurrentUser(currentUser)
      navigate('/chat')
      setLoading(false)
    } catch (err) {
      setError('name', { message: "Username already taken" })
      setLoading(false)
    }
  })

  const signupLink = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.set("auth", "new")
    return `?${params.toString()}`
  }, [searchParams])

  return (
    <form className="w-[min(100%,500px)] mx-auto mt-14" onSubmit={submit}>
      <h1 className="text-4xl font-bold text-white">Welcome back</h1>
      <p className="text-lg text-gray-300">Please enter your username to continue</p>
      <div className="flex flex-col mt-8">
        <label htmlFor="name" className="text-white">Username</label>
        <Input id="name" className="mt-2 tracking-wide text-lg" {...register('name', { required: true })} placeholder="Naero" autoFocus autoComplete="off" required />
        {errors.name && <p className="text-error mt-2">{errors.name.message}</p>}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {errors.root && <p className="text-error">{errors.root.message}</p>}
        <Button type="submit">
          {loading ? <Spinner /> : 'Login'}
        </Button>
        <span>
          <span className="text-gray-300">New to Naero Chat?</span>{' '}
          <a href={signupLink} className="text-primary">Create an account</a>
        </span>
      </div>
    </form>
  )
}

const Register = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<{ name: string }>()
  const [loading, setLoading] = React.useState(false)
  const { setCurrentUser } = useTypedChat()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const submit = handleSubmit(async ({ name }) => {
    try {
      setLoading(true)
      const macAddress = getMacAddress()
      const user = await chatAPI.registerUser(name, macAddress)
      const currentUser = new User({
        id: user.uuid,
        presence: new Presence({ status: user.online ? UserStatus.Available : UserStatus.Away }),
        username: user.name,
        avatar: user.avatarUrl,
        data: {}
      })
      storage.set('user', currentUser)
      setCurrentUser(currentUser)
      navigate('/chat')
      setLoading(false)
    } catch (err) {
      setError('name', { message: "Username already taken" })
      setLoading(false)
    }
  })

  const loginLink = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("auth")
    return `?${params.toString()}`
  }, [searchParams])

  return (
    <form className="w-[min(100%,500px)] mx-auto mt-14" onSubmit={submit}>
      <h1 className="text-4xl font-bold text-white">Welcome to Naero Chat</h1>
      <p className="text-lg text-gray-300">Please enter your username to continue</p>
      <div className="flex flex-col mt-8">
        <label htmlFor="name" className="text-white">Username</label>
        <Input id="name" className="mt-2 tracking-wide text-lg" {...register('name', { required: true })} placeholder="Naero" autoFocus autoComplete="off" required />
        {errors.name && <p className="text-error mt-2">{errors.name.message}</p>}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {errors.root && <p className="text-error">{errors.root.message}</p>}
        <Button type="submit">
          {loading ? <Spinner /> : 'Create account'}
        </Button>
        <span>
          <span className="text-gray-300">Already have an account?</span>{' '}
          <a href={loginLink} className="text-primary">Login</a>
        </span>
      </div>
    </form>
  )
}

export const ChatLoggedOut = () => {
  const [searchParams] = useSearchParams()
  const isNew = searchParams.get("auth") === "new"

  return (
    <div className="w-full h-full">
      {isNew ? <Register /> : <Login />}
    </div>
  )
}