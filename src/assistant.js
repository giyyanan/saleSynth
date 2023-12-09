//https://platform.openai.com/docs/assistants/overview?lang=node.js

import OpenAI from 'openai';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("\nWelcome to SaleSynth an assistant powered by open AI\n")
console.log("keep prompting the assistant for any queries\n"); 
console.log("To exit any time simply type `exit` or `stop\n")

const keepPrompting = () => {
    rl.question("Enter your prompt Here", (userInput) => {
        if (userInput === 'exit' || userInput === 'stop') {
            console.log('Assistant is now powering off');
            rl.close();
        } else {
            console.log(`You entered: ${userInput}`);
            keepPrompting();
        }
    });
};

keepPrompting();

const openai = new OpenAI({
	apiKey:process.env.OPENAI_API_KEY,
	dangerouslyAllowBrowser:true,
});


// const assistant = await openai.beta.assistants.create({
// 	name: "saleSynth",
// 	instructions: "you are going to synthesise an sales call audio file or a transcript. you should also generate a random sales call if requested and then analyse based on that data. If its an audio file you are going to generate the transcripts. The format should be timestamp represented as [00:00:00], followed by the speaker (speaker), and the dialogue. Then you are going to provide a summary of the conversation, provide a feedback if the call went positive or negative, any notable red flags,. Additional you can provide any relevant metrics or sentiments bnased on the call context. Finally you are going to let users ask queries from the synthesise sales call. Also you should recognise languages like Spanish and french.I want to persist each and every conversation to a database like MongoDB",
// 	tools: [{ type: "code_interpreter" }],
// 	model: "gpt-4"
// });

let assistant;

async function main(prompt) {
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
			instructions: "Please address the user as Human. The user has a premium account."
		}
		);
	let stat = "generating"
	while(run.status == 'in_progress' || run.status == 'queued'){
		run = await openai.beta.threads.runs.retrieve(
			thread.id,
			run.id
			);

		console.log(stat+='.')
		// setTimeout(() => {stat=stat+'.';console.log(stat)},5000);
	}

	console.log(run.status)

	const messages = await openai.beta.threads.messages.list(
		thread.id
		);

	console.log(messages.data[0].content[0].text.value)
}

main(process.argv[2])