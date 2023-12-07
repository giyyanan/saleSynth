import  OpenAI  from "openai";
import * as fs from 'fs';

//initialising open AI library with key for project @https://platform.openai.com/api-keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//firing a sample request to generate a transcript in the required format

async function generateTranscript() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "assistant", content: "reate a realistic transcript of a sales call between a VR headset sales rep and VR game executive. the foprmat should be timestamp represented as [00:00:00], followed by the speaker (speaker), and the dialogue " }],
    });

    const transcript = response.choices[0].message.content;
    //writing to a file on server filesystem
    fs.writeFileSync('transcript.txt', transcript);
  } catch (error) {
    console.error("Error generating transcript:", error);
  }
}

generateTranscript();

