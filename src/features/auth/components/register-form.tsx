import { useForm } from "react-hook-form"
import { NavLink } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRegister } from "@/lib/auth"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/icons/spinner"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
})

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const registerMutation = useRegister()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerMutation.mutate(values, {
      onSuccess
    })
  }

  return (
    <Card className="max-w-[500px] mx-auto bg-card/90">
      <Card.Header className="space-y-px">
        <Card.Title className="scroll-m-20 text-3xl font-extrabold tracking-tight">Create an account</Card.Title>
        <Card.Description className="text-lg text-muted-foreground">Please enter your email to continue</Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form className="w-[min(100%,500px)] mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Username</Form.Label>
                    <Form.Control>
                      <Input placeholder="someone" {...field} />
                    </Form.Control>
                    <Form.Description>
                      We need to know your name.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Email</Form.Label>
                    <Form.Control>
                      <Input placeholder="someone@gmail.com" {...field} />
                    </Form.Control>
                    <Form.Description>
                      This can be your organization email.
                    </Form.Description>
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
                      <Input type="password"  {...field} />
                    </Form.Control>
                    <Form.Description>
                      We recommend using a strong password.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            <Button type="submit" size="lg">
              Create account
              {registerMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                  <Spinner className="w-6 h-6 text-white" />
                </div>
              )}
            </Button>
            <div className="mt-6 flex flex-col gap-4">
              <span>
                <span className="text-gray-300">Already have an account?</span>{' '}
                <NavLink to="/login" className="text-secondary">Login</NavLink>
              </span>
            </div>
          </form>
        </Form>
      </Card.Content>
    </Card>
  )
}