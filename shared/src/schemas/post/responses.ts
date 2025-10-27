import { z } from "zod";
import { PostResourceSchema } from "./resource";

export const PostListResponseSchema = z.array(PostResourceSchema);

export type PostListResponse = z.infer<typeof PostListResponseSchema>;
