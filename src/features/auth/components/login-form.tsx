import { useForm } from "react-hook-form"
import { NavLink } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLogin } from "@/lib/auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
      onSuccess
    })
  }

  return (
    <Card className="max-w-[500px] mx-auto bg-card/80">
      <CardHeader className="space-y-px">
        <CardTitle className="scroll-m-20 text-3xl font-extrabold tracking-tight">Login</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">Please enter your email to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="w-[min(100%,500px)] mx-auto space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="someone@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg">Login</Button>
            <div className="mt-6 flex flex-col gap-4">
              <span>
                <span className="text-gray-300">New to Naerospace?</span>{' '}
                <NavLink to="/register" className="text-secondary">Create an account</NavLink>
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}