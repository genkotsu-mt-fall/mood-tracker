import { z } from "zod";
import { GroupResourceSchema } from "./resource";

export const GroupListResponseSchema = z.array(GroupResourceSchema);
export const GroupResponseSchema = GroupResourceSchema;
