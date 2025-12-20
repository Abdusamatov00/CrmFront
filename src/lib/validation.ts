import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .nonempty({ message: "Telefon nomer kiritilishi shart !" }),
  password: z
    .string()
    .nonempty({ message: "Parol kiritilishi shart !" })
    .min(8, { message: "Parol kamida 8 ta belgidan ko'p bo'lishi kerak" }),
});
