# ElevenLabs API Wrapper
<h2 align="center">
Wrapper for the ElevenLabs API
</h2>

<p align="center">
<img src="https://img.shields.io/github/contributors/arellak/elevenlabs-wrapper" />
<img src="https://img.shields.io/github/issues/arellak/elevenlabs-wrapper" />
<img src="https://img.shields.io/github/issues-pr/arellak/elevenlabs-wrapper" />
<img src="https://img.shields.io/github/stars/arellak/elevenlabs-wrapper" />
</p>

<p align="center">
Check out the <a href="https://www.npmjs.com/package/@arellak/elevenlabs-wrapper">npm</a> page!
</p>

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
// Output file is in the following format: TTS_date-time.mp3
// Returns an object with the following structure: { code: CODE, message: "STATUS_MESSAGE" }
await elevenLabs.tts(
    text,
    voiceId,
    optionalPath = "",
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
| optionalPath | string | optional path to save the file to | "" | - |
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
await elevenLabs.getRemainingLetters();

// Returns all the available models
await elevenLabs.getModels();

// Returns all the available voices
await elevenLabs.getVoices();

// Returns all the voices you created yourself
await elevenLabs.getCustomVoices();

// Returns the IDs and names of the voices you created yourself
// Example: { name:"My Voice", id:"123456789" }
await elevenLabs.getCustomVoiceIds();

// Returns default settings for voices
await elevenLabs.getDefaultVoiceSettings();

// Returns settings for a specific voice
await elevenLabs.getVoiceSettings(voiceId);

// Returns a given voice
await eleveawait nLabs.getVoice(voiceId);

// Returns the sample names and IDs for a given voice
// Example: { name:"My Sample", sampleId:"123456789" }
await elevenLabs.getSampleIds(voiceId);

// Downloads audio for a given sample from a given voice
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: SAMPLE_date-time.mp3
// Optional Path is the same as in the tts method.
// Returns an object with the following structure: { code: CODE, message: "STATUS_MESSAGE" }
await elevenLabs.getAudioFromSample(voiceId, sampleId, optionalPath = "");

// Returns the history for the given Account
await elevenLabs.getHistory();

// Returns the data for the given historyItemId
await elevenLabs.getHistoryItem(historyItemId);

// Downloads the audio for the given historyItemId
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: HISTORY_date-time.mp3
// Optional Path is the same as in the tts method.
// Returns an object with the following structure: { code: CODE, message: "STATUS_MESSAGE" }
await elevenLabs.getAudioFromHistoryItem(historyItemId, optionalPath = "");

// Download an array of history items
// Saves them to the output folder specified in the constructor and returns an array of relative paths to the files.
// Optional Path is the same as in the tts method.
// Output files are in the following format: HISTORY_date-time.zip
await elevenLabs.downloadHistoryItems(historyItemIds, optionalPath = "");

// Returns information about the user's account
await elevenLabs.getUserInfo();

// Returns the user's subscription information
await elevenLabs.getUserSubscriptionInfo();

await elevenLabs.getProjects();

await elevenLabs.getProjectById("ID");

// Additional parameters:
// acxVolumeNormalization = false, author = "", fromDocument = "", fromUrl = "", isbnNumber = "", qualityPreset = "standard", title = ""
await elevenLabs.addProject("DEFAULT_MODEL_ID", "DEFAULT_PARAGRAPH_VOICE_ID", "DEFAULT_TITLE_VOICE_ID", "NAME", "PRONOUNCIATION_DICTIONARY_LOCATORS");

await elevenLabs.deleteProject("PROJECT_ID");

await elevenLabs.convertProject("PROJECT_ID");

await elevenLabs.getProjectSnapshots("PROJECT_ID");

await elevenLabs.streamProjectAudio("PROJECT_ID", "PROJECT_SNAPSHOT_ID");

await elevenLabs.getChapters("PROJECT_ID");

await elevenLabs.getChapterById("PROJECT_ID", "CHAPTER_ID");

await elevenLabs.deleteChapter("PROJECT_ID", "CHAPTER_ID");

await elevenLabs.convertChapter("PROJECT_ID", "CHAPTER_ID");

await elevenLabs.getChapterSnapshots("PROJECT_ID", "CHAPTER_ID");

await elevenLabs.streamChapterAudio("PROJECT_ID", "CHAPTER_ID", "CHAPTER_SNAPSHOT_ID");
```

```js
// Edit voice settings for a given voice
await elevenLabs.editVoiceSettings(voiceId, voiceSettings);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
| voiceSettings | object | voice settings | {stability: 0.5, similarity_boost: 0.75} | {stability, similarity_boost, style, use_speaker_boost} |
<br>

```js
// Add a new voice with the given name, description, file paths and labels
// Returns the voice id
await elevenLabs.addVoice(name, filePaths, optionalSettings);
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
        "./output/test3.mp3",
    ], 
    {
        labels: { 
            age: "early 20s"
        },
        description: "test description",
    },
);
```

```js
// Edit the voice with a given name and voice id
// include the optional settings you want to change
// returns status code if it was successful
await elevenLabs.editVoice(name, voiceId, optionalSettings);
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
            "./output/test3.mp3",
        ],
        labels: {
            age: "early 20s",
        },
    },
);
```

```js
// Deletes a voice
await elevenLabs.deleteVoice(voiceId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
<br>

```js
// Deletes a sample with a given voice id and sample id
await elevenLabs.deleteSample(voiceId, sampleId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
| sampleId | string | sample id to be used | undefined | - |
<br>

```js
// Deletes a history item with a given history item id
await elevenLabs.deleteHistoryItem(historyItemId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| historyItemId | string | history item id to be used | undefined | - |
<br>

## Need help? 
Discord: @arellak<br>
E-Mail: [nimble0@protonmail.com](mailto:nimble0@protonmail.com)

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
