import { z } from "zod";

export const AuthLoginBodySchema = z.object({
  email: z.email("メールアドレスの形式が不正です。"),
  password: z.string().min(1, "パスワードを入力してください。"),
});
export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>;

export const AuthSignupBodySchema = z
  .object({
    name: z.string().trim().optional(),
    email: z.email("メールアドレスの形式が不正です。"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
    confirm: z.string().min(1, "確認用パスワードを入力してください。"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["confirm"],
  });
export type AuthSignupBody = z.infer<typeof AuthSignupBodySchema>;
