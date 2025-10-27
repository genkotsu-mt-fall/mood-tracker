import { z } from "zod";
import { UserResourceSchema } from "./resource";

export const UserListResponseSchema = z.array(UserResourceSchema);
