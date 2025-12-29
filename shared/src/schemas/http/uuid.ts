import z from "zod";

/** URLパラメータなどで使うUUID（v4想定） */
export const UuidSchema = z.uuid();
export type Uuid = z.infer<typeof UuidSchema>;
