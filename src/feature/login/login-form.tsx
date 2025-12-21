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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
  }

  return (
    <div
      className="
    fixed inset-0 flex items-center justify-center
    bg-white md:bg-[url('https://media.istockphoto.com/id/1642381198/photo/customer-relationship-management.jpg?s=612x612&w=0&k=20&c=hewouH78IzuySSSq6QawNCBQCMPfaIfEvTYIdhTZYJs=')]
    bg-cover bg-center bg-no-repeat
  "
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

              {/* PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon raqamingiz</FormLabel>
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

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parolingiz</FormLabel>
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
