//https://platform.openai.com/docs/assistants/overview?lang=node.js
import * as fs from 'fs';
import OpenAI from 'openai';
import readline from 'readline';

// fetching the provided transcript file
let data = '';
if(process.argv[2]){
	let filePath = process.argv[2];
	
	try {
		console.log(filePath)
		data = fs.readFileSync(filePath, 'utf8');
		console.log('\n ~~~Transcript succesfully parsed~~~ \n');
	}
	catch{
		console.log('\n Couldn not read file. Give proper path to access file\n')
		console.log('Alternatively you ask assistant to generate a random sales call\n')
	}
}

// Initial bootup messages for the assistant

console.log("\nWelcome to SaleSynth a sales assistant powered by open AI\n")

if(data.length ==0){
	console.log("No transcipt file provided for the assistant to synthesise a sales call\n")
	console.log("Alternatively you can prompt the assistant to generate a sample sales call in a desired format\n")
}

console.log("You can prompt the assistant for any queries related to the transcript\n"); 

console.log("To exit any time simply type `exit` or `stop`\n")

const openai = new OpenAI({
	apiKey:process.env.OPENAI_API_KEY,
	dangerouslyAllowBrowser:true,
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

//code for creating an assistant form the gound up. you can provide any instructions. but every call create a new assistant 

// const assistant = await openai.beta.assistants.create({
// 	name: "saleSynth",
// 	instructions: "you are going to synthesise an sales call audio file or a transcript. you should also generate a random sales call if requested and then analyse based on that data. If its an audio file you are going to generate the transcripts. The format should be timestamp represented as [00:00:00], followed by the speaker (speaker), and the dialogue. Then you are going to provide a summary of the conversation, provide a feedback if the call went positive or negative, any notable red flags,. Additional you can provide any relevant metrics or sentiments bnased on the call context. Finally you are going to let users ask queries from the synthesise sales call. Also you should recognise languages like Spanish and french.I want to persist each and every conversation to a database like MongoDB",
// 	tools: [{ type: "code_interpreter" }],
// 	model: "gpt-4"
// });

let assistant;

async function main(prompt) {
	//using a predefined assistant
	const myAssistant = await openai.beta.assistants.retrieve(
		"asst_XzcBcnhz5foM27x5865wpmRZ"
		);

	assistant = myAssistant


	const thread = await openai.beta.threads.create();

	const message = await openai.beta.threads.messages.create(
		thread.id,
		{
			role: "user",
			content: prompt,//"generate a sample sales call between a vr headset sales rep and a AR game company executive, with timeframe as [00:00:00] followed by a speaker name in braces()"
		}
		);

	let run = await openai.beta.threads.runs.create(
		thread.id,
		{ 
			assistant_id: assistant.id,
			instructions: "Please address the user as Mortal. The user has a premium account. So be polite and couteous"
		}
		);
	let stat = "generating"
	while(run.status == 'in_progress' || run.status == 'queued'){
		run = await openai.beta.threads.runs.retrieve(
			thread.id,
			run.id
			);

		console.log(stat+='.')
	}

	console.log(run.status)

	const messages = await openai.beta.threads.messages.list(
		thread.id
		);

	console.log(messages.data[0].content[0].text.value)

	const message = await openai.beta.threads.messages.create(
		thread.id,
		{
			role: "user",
			content: messages.data[0].content[0].text.value,
		}
		);
}

const keepPrompting = () => {
	rl.question("\n::", (userPrompt) => {
		if (userPrompt === 'exit' || userPrompt === 'stop') {
			console.log('Assistant is now powering off');
			rl.close();
		} else {
			main(userPrompt)
			keepPrompting();
		}
	});
};

keepPrompting();