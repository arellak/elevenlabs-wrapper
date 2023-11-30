import ElevenLabs from "../lib/elevenlabs.js";

const elevenLabs = new ElevenLabs({
    apiKey: "API_KEY",
});

const tts = await elevenLabs.tts("Hello World!", "YOUR_VOICE_ID");
console.log(tts);

const addVoice = await elevenLabs.addVoice("test", ["./output/test1.mp3", "./output/test2.mp3"]);
console.log(addVoice);

const editVoice = await elevenLabs.editVoice("test1", "VOICE_ID", ["./output/test3.mp3"]);
console.log(editVoice);

const remainingLetters = await elevenLabs.getRemainingLetters();
console.log(remainingLetters);

const models = await elevenLabs.getModels();
console.log(models);

const voices = await elevenLabs.getVoices();
console.log(voices);

const customVoices = await elevenLabs.getCustomVoices();
console.log(customVoices);

const customVoiceIds = await elevenLabs.getCustomVoiceIds();
console.log(customVoiceIds);

const defaultVoiceSettings = await elevenLabs.getDefaultVoiceSettings();
console.log(defaultVoiceSettings);

const editedVoiceSettings = await elevenLabs.editVoiceSettings({stability: 0.3, similarity_boost: 0.4, style: 1}, "VOICE_ID");
console.log(editedVoiceSettings);

const voiceSettings = await elevenLabs.getVoiceSettings("VOICE_ID");
console.log(voiceSettings);

const voice = await elevenLabs.getVoice("VOICE_ID");
console.log(voice);

const deleteVoice = await elevenLabs.deleteVoice("VOICE_ID");
console.log(deleteVoice);

const sampleIds = await elevenLabs.getSampleIds("VOICE_ID");
console.log(sampleIds);

const audioSamples = await elevenLabs.getAudioFromSample("VOICE_ID", "SAMPLE_ID");
console.log(audioSamples);

const deleteSample = await elevenLabs.deleteSample("VOICE_ID", "SAMPLE_ID");
console.log(deleteSample);

const history = await elevenLabs.getHistory();
console.log(history);

const historyItem = await elevenLabs.getHistoryItem("HISTORY_ITEM_ID");
console.log(historyItem);

const audioHistoryItem = await elevenLabs.getAudioFromHistoryItem("HISTORY_ITEM_ID");
console.log(audioHistoryItem);

const deleteHistoryItem = await elevenLabs.deleteHistoryItem("HISTORY_ITEM_ID");
console.log(deleteHistoryItem);

const downloadHistoryItems = await elevenLabs.downloadHistoryItems(["HISTORY_ITEM_ID_1", "HISTORY_ITEM_ID_2"]);
console.log(downloadHistoryItems);

const userInfo = await elevenLabs.getUserInfo();
console.log(userInfo);

const subscriptionInfo = await elevenLabs.getUserSubscriptionInfo();
console.log(subscriptionInfo);

const projects = await elevenLabs.getProjects();
console.log(projects);

const specificProject = await elevenLabs.getProjectById("ID");
console.log(specificProject);

const addProject = await elevenLabs.addProject("DEFAULT_MODEL_ID", "DEFAULT_PARAGRAPH_VOICE_ID", "DEFAULT_TITLE_VOICE_ID", "NAME", "PRONOUNCIATION_DICTIONARY_LOCATORS");
console.log(addProject);

const deleteProject = await elevenLabs.deleteProject("PROJECT_ID");
console.log(deleteProject);

const convertProject = await elevenLabs.convertProject("PROJECT_ID");
console.log(convertProject);

const projectSnapshots = await elevenLabs.getProjectSnapshots("PROJECT_ID");
console.log(projectSnapshots);

const streamProjectAudio = await elevenLabs.streamProjectAudio("PROJECT_ID", "PROJECT_SNAPSHOT_ID");
console.log(streamProjectAudio);

const chapters = await elevenLabs.getChapters("PROJECT_ID");
console.log(chapters);

const chapterById = await elevenLabs.getChapterById("PROJECT_ID", "CHAPTER_ID");
console.log(chapterById);

const deleteChapter = await elevenLabs.deleteChapter("PROJECT_ID", "CHAPTER_ID");
console.log(deleteChapter);

const convertChapter = await elevenLabs.convertChapter("PROJECT_ID", "CHAPTER_ID");
console.log(convertChapter);

const chapterSnapshots = await elevenLabs.getChapterSnapshots("PROJECT_ID", "CHAPTER_ID");
console.log(chapterSnapshots);

const streamChapterAudio = await elevenLabs.streamChapterAudio("PROJECT_ID", "CHAPTER_ID", "CHAPTER_SNAPSHOT_ID");
console.log(streamChapterAudio);
