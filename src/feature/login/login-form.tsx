import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/service/api";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import Admin from "@/components/layout/admin";

export function LoginForm() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "+998900001122",
      password: "Admin@12345",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const { data } = await api.post("/auth/login", values);

      // 🟢 Zustandga yozish
      login(data.accessToken, data.refreshToken, data.user);

      console.log("LOGIN RESPONSE:", data);

      // 🟥 ROLE CHECK (if / else)
      if (data.user.role === "ADMIN") {
        navigate("/admin", { elements: <Admin /> });
      } else if (data.user.role === "TEACHER") {
        navigate("/tdashboard");
      } else if (data.user.role === "MANAGER") {
        navigate("/manager-dashboard");
      } else {
        navigate("/"); // default
      }

    } catch (err) {
      console.error("Login error:", err);
      form.setError("password", {
        message: "Telefon raqam yoki parol xato",
      });
    }
  }

  return (
    <div
      className="
        fixed inset-0 flex items-center justify-center
        bg-white md:bg-[url('https://www.leadsquared.com/wp-content/uploads/2024/09/role-of-crm-in-marketing.png')]
        bg-cover bg-center bg-no-repeat
      "
      fixed
      inset-0
      flex
      items-center
      justify-center
      bg-white
      bg-cover
      bg-center
      bg-no-repe
    >
      <Card className="w-full max-w-md bg-gray-200 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-semibold">Xush kelibsiz</h1>
                <p className="text-sm text-muted-foreground">
                  CRM hisobingizga kiring
                </p>
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon raqam</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+998 90 123 00 22"
                        className="h-11"
                        {...field}
                      />
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
                    <FormLabel>Parol</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Parolni kiriting"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base">
                Kirish
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
