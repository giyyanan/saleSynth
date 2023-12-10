import OpenAI from "openai";
import * as fs from 'fs';
import path from 'path';

console.log("\n Checking for OPENAI_API_KEY\n")

let api_key =''
let config

try {
  const configPath = path.join(process.cwd(), '/config.json');
  console.log("Accessing configuration file from " +configPath)
  
  const jsonString = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(jsonString);

  console.log(config)

  if(config.OPENAI_API_KEY){
    console.log("\nAPI key already available in configuration.json\n")
    api_key = config.OPENAI_API_KEY
  } else{
   console.log("\nKey not available in config.jsobn. Checking for key in enviroinment variable OPENAI_API_KEY\n")
   api_key = process.env.OPENAI_API_KEY
 }
} catch{
  console.log("\n Error occured when checking for OPENAI_API_KEY\n")
}

const openai = new OpenAI({
  apiKey: api_key,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

if(api_key.length > 0){
  main();
} else{
  console.log("key not found")
}

