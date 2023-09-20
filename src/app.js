import {ElevenLabs} from "./elevenlabs.js";

const elevenLabs = new ElevenLabs("API-KEY", "./output");

await elevenLabs.tts("Hello World", "VOICE-ID");
