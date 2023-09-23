# ElevenLabs API Wrapper
Wrapper for the ElevenLabs API<br>

## Requirements
- [Node.js](https://nodejs.org/en/)
- [ElevenLabs Account](https://elevenlabs.io/)
- nothing else. it builds on top of built-in node modules.

## How to use
1. Create a new project
2. Use `npm install @arellak/elevenlabs-wrapper` to install the package

```js
// import ElevenLabs Wrapper
import ElevenLabs from "@arellak/elevenlabs-wrapper";

// Create a new instance of ElevenLabs
const elevenLabs = new ElevenLabs(
    {
        apiKey: "YOUR_API_KEY",
        outputFolder: "./output"
    }
);
```
## Constructor Options<br>
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| apiKey | string | Your ElevenLabs API Key | undefined | - |
| outputFolder | string | folder where files will be saved | ./output | created automatically if it doesn't exist |
<br>

## Methods
```js
// Converts text to speech, saves the file to the output folder and returns the relative path to the file.
// Output file is in the following format: date-time.mp3
elevenLabs.tts(
    text,
    voiceId,
    modelId = "eleven_multilingual_v2",
    voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75
    },
    params = {
        output_format: "mp3_44100_128",
        optimize_streaming_latency: 0
    }
);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| text | string | text to be converted to speech | undefined | - |
| voiceId | string | voice id to be used | undefined | - |
| modelId | string | model id to be used | eleven_multilingual_v2 | [eleven_monolingual_v1, eleven_multilingual_v2] |
| voiceSettings | object | voice settings | {stability: 0.5, similarity_boost: 0.75} | {stability, similarity_boost, style, use_speaker_boost} |
| params | object | additional params | {output_format: "mp3_44100_128", optimize_streaming_latency: 0} | - |
<br>
### Streaming Latencies
0 (default) = No optimization.<br>
1 = Some optimization.<br>
2 = More optimization.<br>
3 = Max optimization.<br>
4 = Max optimizations & text normalizer off.
<hr>

```js
// Returns the remaining letters you have left for the month
elevenLabs.getRemainingLetters();

// Returns all the available models
elevenLabs.getModels();

// Returns all the available voices
elevenLabs.getVoices();

// Returns all the voices you created yourself
elevenLabs.getCustomVoices();

// Returns the IDs and names of the voices you created yourself
// Example: { name:"My Voice", id:"123456789" }
elevenLabs.getCustomVoiceIds();

// Returns default settings for voices
elevenLabs.getDefaultVoiceSettings();

// Returns settings for a specific voice
elevenLabs.getVoiceSettings(voiceId);

// Returns a given voice
elevenLabs.getVoice(voiceId);

// Returns the sample names and IDs for a given voice
// Example: { name:"My Sample", sampleId:"123456789" }
elevenLabs.getSampleIds(voiceId);

// Downloads audio for a given sample from a given voice
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: sample_date-time.mp3
elevenLabs.getAudioFromSample(voiceId, sampleId);

// Returns the history for the given Account
elevenLabs.getHistory();

// Returns the data for the given historyItemId
elevenLabs.getHistoryItem(historyItemId);

// Downloads the audio for the given historyItemId
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: history_date-time.mp3
elevenLabs.getAudioFromHistoryItem(historyItemId);

// Download an array of history items
// Saves them to the output folder specified in the constructor and returns an array of relative paths to the files.
// Output files are in the following format: history_date-time.zip
// Doesn't work yet.
elevenLabs.downloadHistoryItems(historyItemIds);

// Returns information about the user's account
elevenLabs.getUserInfo();

// Returns the user's subscription information
elevenLabs.getUserSubscriptionInfo();
```

```js
// Edit voice settings for a given voice
elevenLabs.editVoiceSettings(voiceId, voiceSettings);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
| voiceSettings | object | voice settings | {stability: 0.5, similarity_boost: 0.75} | {stability, similarity_boost, style, use_speaker_boost} |
<br>

```js
// Add a new voice with the given name, description, file paths and labels
// Returns the voice id
elevenLabs.addVoice(name, filePaths, optionalSettings);
```
| Option | Type | Description | default | notes | required |
| --- | --- | --- | --- | --- | --- |
| name | string | name of the voice | undefined | - | yes |
| filePaths | array | array of file paths | undefined | - | yes |
| optionalSettings | object | optional settings | {} | {description, labels} | no |

```js
// Usage example
const newVoiceId = await elevenLabs.addVoice(
    "TEST NAME", 
    [
        Path.resolve("./output/test3.mp3")
    ], 
    {
        labels: { 
            age: "early 20s"
        },
        description: "test description"
    }
);
```

```js
// Edit the voice with a given name and voice id
// include the optional settings you want to change
// returns status code if it was successful
elevenLabs.editVoice(name, voiceId, optionalSettings);
```
| Option | Type | Description | default | notes | required |
| --- | --- | --- | --- | --- | --- |
| name | string | name of the voice | undefined | - | yes |
| voiceId | string | voice id to be used | undefined | - | yes |
| optionalSettings | object | optional settings | {} | {description, file paths, labels} | no |

```js
// Usage example
const editedVoice = await elevenLabs.editVoice(
    "TEST NAME",
    "YOUR_VOICE_ID",
    {
        filePaths: [
            Path.resolve("./output/test3.mp3")
        ],
        labels: {
            age: "early 20s"
        }
    }
);
```

```js
// Deletes a voice
elevenLabs.deleteVoice(voiceId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
<br>

```js
// Deletes a sample with a given voice id and sample id
elevenLabs.deleteSample(voiceId, sampleId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
| sampleId | string | sample id to be used | undefined | - |
<br>

```js
// Deletes a history item with a given history item id
elevenLabs.deleteHistoryItem(historyItemId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| historyItemId | string | history item id to be used | undefined | - |
<br>

## Need help? 
Discord: @arellak<br>
E-Mail: [contact@arellak.de](mailto:contact@arellak.de)

## FAQ
### How do I get an API Key?
1. Register an Account at [ElevenLabs](https://elevenlabs.io/).
2. Click on the image on the top right.
3. Click on "Profile"
4. Show the API Key and copy it

### How do I get a voice id?
After registering an account and having a paid subscription, you can create your own custom voice on the website.<br>
If you don't want to use a custom voice, you can use the default voices. You can find the IDs for the default voices by using the `ElevenLabs.getVoices()` method.<br>
If you want to use a custom voice, you can use the `ElevenLabs.getCustomVoiceIds()` method to get the IDs for your custom voices.

### Something doesn't work. What should I do?
1. Check if you have the latest version of the package installed.
2. Did you follow all the steps at the beginning of this Readme?
3. Did you enter your API Key correctly?
4. Did you enter the correct voice ID?

If you did all the above and you are sure it's a problem with the package, please contact me on Discord, via E-Mail or create an issue.<br>
If you think it's a problem with ElevenLabs, please contact them directly since I'm not affiliated with them.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Credits
[ElevenLabs](https://elevenlabs.io/) for the API<br>
