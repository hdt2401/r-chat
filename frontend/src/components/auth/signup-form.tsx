import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/auth"
import { useNavigate } from "react-router"

const signUpScheme = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
  email: z.email("Invalid email address").trim(),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters").max(11, "Phone number must be at most 11 characters"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
})

type SignUpData = z.infer<typeof signUpScheme>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpData>({
    resolver: zodResolver(signUpScheme),
  })
  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data: SignUpData) => {
    const { username, password, email, phone, firstName, lastName } = data
    await signUp(username, password, email, phone, firstName, lastName)
    navigate('/signin')
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...register("username")}
                  id="username"
                
                />
                {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input {...register("password")} id="password" type="password" />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">
                      Phone
                    </FieldLabel>
                    <Input {...register("phone")} id="phone" />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </Field>
                </Field>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">Firstname</FieldLabel>
                    <Input {...register("firstName")} id="firstName" type="firstName" />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">
                      Lastname
                    </FieldLabel>
                    <Input {...register("lastName")} id="lastName" />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
