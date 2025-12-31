import { z } from "zod";
import { FollowResourceSchema } from "./resource";

export const FollowResponseSchema = FollowResourceSchema;
export const FollowListResponseSchema = z.array(FollowResourceSchema);
