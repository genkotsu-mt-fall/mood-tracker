import z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "メールアドレスの形式が不正です。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

export const signupSchema = z
  .object({
    name: z.string().trim().optional(),
    email: z.email({ message: "メールアドレスの形式が不正です。" }),
    password: z
      .string()
      .min(8, { message: "パスワードは8文字以上で入力してください。" }),
    confirm: z
      .string()
      .min(1, { message: "確認用パスワードを入力してください。" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["confirm"],
  });

export type LoginFields = z.infer<typeof loginSchema>;
export type SignupFields = z.infer<typeof signupSchema>;
