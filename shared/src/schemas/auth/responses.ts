import { z } from "zod";

export const AuthLoginResponseSchema = z
  .object({
    accessToken: z.string().min(1),
  })
  .strict();
export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;

// 必要最低限。実装に合わせて拡張OK
export const AuthSignupResponseSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    name: z.string().nullable().optional(),
  })
  .strict();
export type AuthSignupResponse = z.infer<typeof AuthSignupResponseSchema>;
