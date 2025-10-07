import { z } from "zod";
import { GroupResourceSchema } from "./resource";
// Envelope未使用なら下2行だけでOK
export const GroupListResponseSchema = z.array(GroupResourceSchema);
export const GroupResponseSchema = GroupResourceSchema;

// Envelopeを採用するなら：
// import { makeItemEnvelope, makeListEnvelope } from "../http/common";
// export const GroupListResponseSchema = makeListEnvelope(GroupResourceSchema);
// export const GroupResponseSchema = makeItemEnvelope(GroupResourceSchema);
