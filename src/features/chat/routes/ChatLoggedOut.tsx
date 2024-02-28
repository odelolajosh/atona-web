import React from "react"
import { useTypedChat } from "../hooks/useChat"
import { uuid } from "@/lib/uid"
import { storage } from "@/lib/storage"
import { useForm } from "react-hook-form"
import { Button, Input } from "@/components/ui"
import { Presence, User, UserStatus } from "@chatscope/use-chat"
import chatAPI from "../lib/api"

type ChatLoggedOutProps = {
  onLogin: (userId: string) => void
}

const getMacAddress = () => {
  return uuid();
}

export const ChatLoggedOut: React.FC<ChatLoggedOutProps> = ({ onLogin }) => {
  const { register, handleSubmit } = useForm<{ name: string }>()
  const [loading, setLoading] = React.useState(false)
  const { setCurrentUser } = useTypedChat()

  const submit = handleSubmit(async ({ name }) => {
    try {
      setLoading(true)
      const macAddress = getMacAddress()
      const result: any = await chatAPI.post('/users', { name, macAddress })
      const user = result.user
      const currentUser = new User({
        id: user.uuid,
        presence: new Presence({ status: user.online ? UserStatus.Available : UserStatus.Away }),
        username: user.name,
        avatar: user.avatar,
        data: {}
      })
      storage.set('user', JSON.stringify(currentUser))
      setCurrentUser(currentUser)
      onLogin(currentUser.id)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  })

  return (
    <div className="w-full h-full">
      <form className="w-[min(100%,500px)] mx-auto mt-14" onSubmit={submit}>
        <h1 className="text-4xl font-bold text-white">Welcome to Naero Chat</h1>
        <p className="text-lg text-gray-300">Please enter your username to continue</p>
        <div className="flex flex-col mt-8">
          <label htmlFor="name" className="text-white">Username</label>
          <Input id="name" className="mt-2 tracking-wide text-lg" {...register('name', { required: true })} placeholder="Naero" autoFocus autoComplete="off" required />
        </div>
        <div className="mt-6">
          <Button type="submit">
            {loading ? (
              <svg className="animate-spin h-6 w-6 mx-auto text-text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  )
}