saleSynth

v 1.0.0

An AI sales assistant that can gnerate simulated sales call transcript or read an existing transcript and Synthesize it.

Users can ask queries on the trainscript to gain more insights.

Current version supports only command line execution.


Requiremnts:

. openAI API key.

. Assistant ID if you are able to genrate one. Othersise you can use createAssistant.js script to create a new assistant. The ID will be saved to config.json

setting up the enviroinment

. Subscribe to Open AI API. It requires payment, after which you can get a API key.
  KINDLY MAKE SURE TO PROVIDE THE API KEY IN config.JSON FILE BEFORE EXECUTING ANY CODE.
  visit https://platform.openai.com/api-keys for generating API keys.

. Save the key genberate under OPEN_AI_KEY in config.json file. 

. You can also set up the API key as an enviroinment variable and access it via process.env.OPEN_AI_KEY.

	for more inforamtion on API and Authentication, you can can refer openAI official documentation.

Scripts and Usage

1. open-ai-test.js

   checks if the provided open AI key is valid. Genrerally advise this as the first step to ensure functionality.
   If you get a API response with assistant as the Role, the key is good and ready to be used with the assistant.

2. generateTranscript.js

   usage ` node generateTranscript.js ~"prompt(optional)" ` 

 * This scipt generates a sample transcript . you can provide the sales scenario as a command line arguemnt enclosed within quotes.
	Failure to do so will lead to AI mis interpreting the sceanrio and providing random outputs.
	If you require a desired format make sure to indicate it in the text.

 * If you dont provide a scenario, there is default scenario provided within the script that will be used for the sales sceanrio.

 * The end result will be displayed on the terminal and saved to file called transcript.txty in the cuurrent execution directory.

3. createAssistant.js

	usage `node createAssistant.js`

 * Will utilise the OPEN_AI_KEY to create a nbew assistant for synthesizing sales call and will store the ID to config.json file.

 * If you want to generate a brand new assistant , make sure ID is "" empty string , under assitantID in config.json file.

4. assistant.js

	usage `node assistant.js ~"file path to transcript(optional)"`

 * This script is main function, that takes in a transcript and synthesise, for users to ask any queries based on that.
   If a file is not provided make sure to provide a scenario and ask the AI assistant to generate the script.
   Failure to do so will make the AI assistant behave in ageneralised manner, as it wouldn't have any context to work with.

 * The script works on the assumption that that an assistant has been created and ID provided in the code base.
   Failuire will result in erronour script termination.
 
 * You can terminate the assistant by typing `exit` or `stop` at any point in the converasation.

Future Improvemnts

 * provide a raw audio file .mp3 or .wav for transcribing real world calls

 * Persit the converations to a DataBase.

 * Provide GUI Web interface for seamless User Experience.

 * Use Regex matcher to validate OPENAI_API_KEY and AssitantID