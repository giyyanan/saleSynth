import  OpenAI  from "openai";
import * as fs from 'fs';

//initialising open AI library with key for project @https://platform.openai.com/api-keys
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//firing a sample request to generate a transcript in the required format

let prompt;

if(process.argv[2]){
  console.log("\n Sales call scenario provided. Asking AI to genrate a transcript. Wait for few miutes for the script to be generated \n")
  console.log(process.argv[2])
  prompt = process.argv[2]
} else{
  console.log("\n Call scenario not provided. Asking AI to imagine a simulated sales call . Wait for few miutes for the script to be generated \n")
  prompt = "create a realistic transcript of a sales call between a sales represenmtative and another companies procuremnt executive. You can choose whatever industry and product, make sure it s a realword product. But make sure both the executive and sales rep are talking about the same thing .The format should be timestamp represented as [00:00:00], followed by the speaker (speaker), and the dialogue"
}

async function generateTranscript() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt}],
    });

    const transcript = response.choices[0].message.content;
    console.log(transcript)
    //writing to a file on server filesystem
    fs.writeFileSync('./transcript.txt', transcript);
    console.log("\n Transcript saved to file transcript.txt in the current directory\n")
  } catch (error) {
    console.error("Error generating transcript:", error);
  }
}

generateTranscript();

