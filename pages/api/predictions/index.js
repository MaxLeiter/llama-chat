import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  console.log(req.body.systemPrompt);

  const prediction = await replicate.predictions.create({
    // See https://replicate.com/replicate/llama-2-70b-chat/versions
    version: req.body.version,

    stream: true,

    // This is the text prompt that will be submitted by a form on the frontend
    input: {
      prompt: req.body.prompt,
      system_prompt: req.body.systemPrompt,
      max_new_tokens: req.body.maxTokens,
      temperature: req.body.temperature,
      repetition_penalty: 1,
      top_p: req.body.topP,
    },
  });

  console.log({ prediction });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
