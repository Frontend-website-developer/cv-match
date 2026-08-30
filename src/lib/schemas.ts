import { z } from "zod";

export const MatchResultSchema = z.object({
    matchPercentage: z.number(),
    summary: z.string(),
    matchedSkills: z.array(z.string(" ")),
    missingSkills: z.array(z.string(" ")),
})