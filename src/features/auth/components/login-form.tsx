import { useForm } from "react-hook-form"
import { NavLink } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLogin } from "@/lib/auth"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/icons/spinner"
import { AxiosError } from "axios"
import { ErrorResponse } from "@/types/error"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useLogin()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        const data = (error as AxiosError<ErrorResponse>)?.response?.data
        if (data?.message === "Invalid credentials") {
          form.setError("email", {
            type: "manual",
            message: "Invalid email or password.",
          })
        } else {
          form.setError("root", {
            type: "manual",
            message: "An error occurred. Please try again later.",
          })
        }
      }
    })
  }

  return (
    <Card className="max-w-[500px] mx-auto bg-card/90">
      <Card.Header className="space-y-px">
        <Card.Title className="scroll-m-20 text-3xl font-extrabold tracking-tight">Login</Card.Title>
        <Card.Description className="text-muted-foreground">Please enter your email to continue</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form className="w-[min(100%,500px)] mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Email</Form.Label>
                    <Form.Control>
                      <Input placeholder="someone@gmail.com" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="password"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Password</Form.Label>
                    <Form.Control>
                      <Input type="password" {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>
            <Button type="submit" size="lg" disabled={loginMutation.isPending}>
              Login
              {loginMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                  <Spinner className="w-6 h-6 text-white" />
                </div>
              )}
            </Button>
            <div className="mt-6 flex flex-col gap-4 text-sm">
              <span>
                <span className="text-gray-300">New to Naerospace?</span>{' '}
                <NavLink to="/register" className="text-secondary">Create an account</NavLink>
              </span>
            </div>
          </form>
        </Form>
      </Card.Content>
    </Card>
  )
}