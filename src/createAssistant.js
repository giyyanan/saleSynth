import OpenAI from "openai";
import * as fs from 'fs';
import path from 'path';

let config = null;

try {
	const configPath = path.join(process.cwd(), '/config.json');
	console.log("Accessing configuration file from " +configPath)
	
	const jsonString = fs.readFileSync(configPath, 'utf8');
	config = JSON.parse(jsonString);

	if(config.assistantID){
		console.log("\nAssistant ID already available in configuration.json\n")
		console.log(config.assistantID)
	} else{
		config.assistantID = ""
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});


		//code for creating an assistant form the gound up. you can provide any instructions. but every call create a new assistant 

		const assistant = await openai.beta.assistants.create({
			name: "saleSynthesizer",
			instructions: "you are going to generate and analyze sales call transcripts. you hould be capable of creating realistic call transcripts, summarizing these calls, and then answering user queries related to the transcript content.The format should be timestamp represented as [00:00:00], followed by the speaker (speaker), and the dialogue. Then you are going to provide a summary of the conversation, provide a feedback if the call went positive or negative, any notable red flags,. Additional you can provide any relevant metrics or sentiments bnased on the call context. Finally you are going to let users ask queries from the synthesise sales call. Also you should recognise languages like Spanish and french.I want to persist each and every conversation to a database like MongoDB",
			tools: [{ type: "code_interpreter" }],
			model: "gpt-4"
		});

		console.log("Assistant Created with ID : "+assistant.id)
		config.assistantID = assistant.id
		fs.writeFileSync(configPath,JSON.stringify(config));
	}
} catch (err) {
	console.error("Error occured in creating an assistant and saving ID to configuration", err);
  process.exit(1); // Exit the process with an error code
}