import { MatchResultSchema } from "@/lib/schemas";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod.mjs";

const client = new Anthropic;



export async function POST(request: Request){
    const {cv, jd} = await request.json();

    const response = await client.messages.parse({
        model: "claude-opus-5",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: `Compare this CV against this job description specifically tell the matchedskills, missing skills, job matching percentage also give the summary in a way that detail of this job match and mismatch is told in short words also send match and mismatch skills in bullet points \n\nCV:\n${cv}\n\nJob Description:\n${jd}`,
            },
        ],
        output_config: {format: zodOutputFormat(MatchResultSchema)},
    })

    return Response.json(response.parsed_output);

}