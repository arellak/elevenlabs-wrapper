# ElevenLabs API Wrapper
Wrapper for the ElevenLabs API<br>

## How to use
1. Create a new project
2. Use `npm install @arellak/elevenlabs-wrapper` to install the package

```js
// import ElevenLabs Wrapper
import { ElevenLabs } from "elevenlabs";

// Create a new instance of ElevenLabs
const elevenlabs = new ElevenLabs(
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

## Methods
```js
// Converts text to speech, saves the file to the output folder and returns the relative path to the file.
// Output file is in the following format: date-time.mp3
ElevenLabs.tts(
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

```js
// Returns all the available models
ElevenLabs.getModels();

// Returns all the available voices
ElevenLabs.getVoices();

// Returns all the voices you created yourself
ElevenLabs.getCustomVoices();

// Returns the IDs and names of the voices you created yourself
// Example: { name:"My Voice", id:"123456789" }
ElevenLabs.getCustomVoiceIds();

// Returns default settings for voices
ElevenLabs.getDefaultVoiceSettings();

// Returns settings for a specific voice
ElevenLabs.getVoiceSettings(voiceId);

// Returns a given voice
ElevenLabs.getVoice(voiceId);

// Returns the sample names and IDs for a given voice
// Example: { name:"My Sample", sampleId:"123456789" }
ElevenLabs.getSampleIds(voiceId);

// Downloads audio for a given sample from a given voice
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: sample_date-time.mp3
ElevenLabs.getAudioFromSample(voiceId, sampleId);

// Returns the history for the given Account
ElevenLabs.getHistory();

// Returns the data for the given historyItemId
ElevenLabs.getHistoryItem(historyItemId);

// Downloads the audio for the given historyItemId
// Saves it to the output folder specified in the constructor and returns the relative path to the file.
// Output file is in the following format: history_date-time.mp3
ElevenLabs.getAudioFromHistoryItem(historyItemId);

// Download an array of history items
// Saves them to the output folder specified in the constructor and returns an array of relative paths to the files.
// Output files are in the following format: history_date-time.zip
// Doesn't work yet.
ElevenLabs.downloadHistoryItems(historyItemIds);

// Returns information about the user's account
ElevenLabs.getUserInfo();

// Returns the user's subscription information
ElevenLabs.getUserSubscriptionInfo();
```

```js
// Edit voice settings for a given voice
ElevenLabs.editVoiceSettings(voiceId, voiceSettings);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| settings | object | voice settings | {stability: 0.5, similarity_boost: 0.75} | {stability, similarity_boost, style, use_speaker_boost} |
| voiceId | string | voice id to be used | undefined | - |

```js
// Deletes a voice
ElevenLabs.deleteVoice(voiceId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |

```js
// Deletes a sample with a given voice id and sample id
ElevenLabs.deleteSample(voiceId, sampleId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| voiceId | string | voice id to be used | undefined | - |
| sampleId | string | sample id to be used | undefined | - |

```js
// Deletes a history item with a given history item id
ElevenLabs.deleteHistoryItem(historyItemId);
```
| Option | Type | Description | default | notes |
| --- | --- | --- | --- | --- |
| historyItemId | string | history item id to be used | undefined | - |

## Need help? 
Discord: @arellak
E-Mail: [contact@arellak.de](mailto:contact@arellak.de)