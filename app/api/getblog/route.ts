import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openAiStream";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing env var from OpenAI");
// }
interface RequestBody {
  model_promt?: string;
  prompt?: string;
}

export async function POST(req: Request): Promise<Response> {
  const { model_promt, prompt } = (await req.json()) as RequestBody;

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }], // Assuming you need to pass the prompt as a message
    max_tokens: 2048,
    temperature: 1.0,
    frequency_penalty: 1.0,
    top_p: 1,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  try {
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (error) {
    return new Response("Error processing request", { status: 500 });
  }
}
