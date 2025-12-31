import { z } from "zod";
import { PostResourceSchema, PostResourceWithIsMeSchema } from "./resource";

export const PostListResponseSchema = z.array(PostResourceSchema);
export const PostListResponseWithIsMeSchema = z.array(
  PostResourceWithIsMeSchema
);

export type PostListResponse = z.infer<typeof PostListResponseSchema>;
export type PostListResponseWithIsMe = z.infer<
  typeof PostListResponseWithIsMeSchema
>;
