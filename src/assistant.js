//https://platform.openai.com/docs/assistants/overview?lang=node.js
import * as fs from 'fs';
import OpenAI from 'openai';
import readline from 'readline';
import path from 'path';

// fetching the provided transcript file
let transcriptData = '';
if (process.argv[2]) {
    let filePath = process.argv[2];

    try {
        console.log(filePath)
        transcriptData = fs.readFileSync(filePath, 'utf8');
        console.log('\n ~~~Transcript succesfully parsed~~~ \n');
    } catch {
        console.log('\n Couldn not read file. Give proper path to access file\n')
        console.log('Alternatively you can ask assistant to generate a random sales call\n')
    }
}

// Initial bootup messages for the assistant

console.log("\nWelcome to SaleSynth a sales assistant powered by open AI\n")

if (transcriptData.length == 0) {
    console.log("No transcipt file provided for the assistant to synthesise a sales call\n")
    console.log("Alternatively you can prompt the assistant to generate a sample sales call in a desired format\n")
}

console.log("You can prompt the assistant for any queries related to the transcript\n");

console.log("To exit any time simply type `exit` or `stop`\n")


//checking for openAI API key in config.json or enviroinment variable

let openai_api_key = ''
let config

try {
    const configPath = path.join(process.cwd(), '/config.json');

    const jsonString = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(jsonString);

    if (config.OPENAI_API_KEY) {
        openai_api_key = config.OPENAI_API_KEY
    } else {
        openai_api_key = process.env.OPENAI_API_KEY
    }
} catch {
    console.log("\n Error occured when fetching for OPENAI_API_KEY\n")
}

//setting up OPENAI object to call API's

if (openai_api_key.length > 0) {

    const openai = new OpenAI({
        apiKey: openai_api_key,
        dangerouslyAllowBrowser: true,
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let assistant;
    let thread;

    async function main() {

        //using the predefined assistant from config.json
        const myAssistant = await openai.beta.assistants.retrieve(
            config.assistantID
        );

        assistant = myAssistant


        thread = await openai.beta.threads.create();

        let message

        //loading the transcript data to the assisatnt as a inital message on the thread
        if (transcriptData.length > 0) {
            message = await openai.beta.threads.messages.create(
                thread.id, {
                    role: "user",
                    content: "You are going to synthesize this sales call provided as a transcript and provide a summary" + transcriptData,
                }
            );

        } else {
            message = await openai.beta.threads.messages.create(
                thread.id, {
                    role: "user",
                    content: 'Check with the user in the begining only, if they want to generate a sample sales call transcription. Make surt to generate the transcription once in hte begining',
                }
            );

        }
   		
        //Creating a run instance on the thread to exceute the conversation

        let run = await openai.beta.threads.runs.create(
            thread.id, {
                assistant_id: assistant.id,
                instructions: "Start by introducing yourselves as SaleSynth and list your capabilities based on your instructions"
            }
        );
        let stat = "Initialising"

        //Wait till the run job is completed based on the run status

        while (run.status == 'in_progress' || run.status == 'queued') {
            run = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );

            console.log(stat += '.')
        }

        console.log(run.status)

        const aiResponse = await openai.beta.threads.messages.list(
            thread.id
        );

        console.log(aiResponse.data[0].content.splice(-1)[0].text.value)

    }

    // continuously feeding user inputs to the thread created for a complete conversation
    async function chat(prompt) {
        if (thread.id) {
            let run = await openai.beta.threads.runs.create(
                thread.id, {
                    assistant_id: assistant.id,
                    instructions: prompt,
                }
            );
            let stat = "generating"
            while (run.status == 'in_progress' || run.status == 'queued') {
                run = await openai.beta.threads.runs.retrieve(
                    thread.id,
                    run.id
                );

                console.log(stat += '.')
            }

            console.log(run.status)

            const aiResponse = await openai.beta.threads.messages.list(
                thread.id
            );

            console.log(aiResponse.data[0].content[0].text.value)
            console.log("\n\n")
        }
    }

    main()

    //seeking user inputs until termination of assistant
    const keepPrompting = () => {
        rl.question("\n:>\\", (userPrompt) => {
            if (userPrompt === 'exit' || userPrompt === 'stop') {
                console.log('Assistant is now powering off');
                rl.close();
            } else {
                chat(userPrompt)
                keepPrompting();
            }
        });
    };

    keepPrompting();

} else {
    console.log("Provide a valid OPENAI_API_KEY to access assistant. Check key with open-ai-test.js before using assistant")
}