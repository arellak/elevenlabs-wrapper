import {deleteReq, post, get, jsonGet, audioGet, fullJsonPost, audioPost} from "./apiHandler.js";
import {buildFormData, createDirectories, saveBlobToFile, saveZip} from "./util.js";

class ElevenLabs {
    /**
     *  Creates an instance of ElevenLabs.
     * @param {object} [options={apiKey: "", outputFolder: "./output"}]
     * @memberof ElevenLabs
     */
    constructor(options = {apiKey: "", outputFolder: ""}){
        this.apiKey = options.apiKey || "";
        this.outputFolder = options.outputFolder || "./output";
        createDirectories(this.outputFolder);
    }

    /**
     *
     * @param {string} text
     * @param {string} voiceId
     * @param {string} [modelId = "eleven_multilingual_v2"]
     * @param {object} [voiceSettings = {stability: 0.5, similarity_boost: 0.75}]
     * @param {object} [params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}]
     * @return {Promise<string>} Status message
     * @memberof ElevenLabs
     */
    async tts(text, voiceId, modelId = "eleven_multilingual_v2", voiceSettings = {stability: 0.5, similarity_boost: 0.75}, params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}){
        const body = {
            text,
            model_id: modelId,
            voice_settings: voiceSettings,
        };

        const response = await audioPost(
            `/text-to-speech/${voiceId}?output_format=${params.output_format}&optimize_streaming_latency=${params.optimize_streaming_latency}`,
            this.apiKey,
            body,
        );

        return saveBlobToFile(response, this.outputFolder + "/tts", "AUDIO");
    }

    async #voiceFunc(name, optionalSettings = {}, voiceId = ""){
        const formData = buildFormData({
            name,
            description: optionalSettings?.description || "",
            labels: optionalSettings?.labels || "",
            filePaths: optionalSettings?.filePaths || [],
        });

        return await post(voiceId === "" ? "/voices/add" : `/voices/${voiceId}/edit`, {
            accept: "application/json",
            "xi-api-key": this.apiKey || "",
        },
        formData)
            .then((response) => response.json())
            .catch((error) => console.log(error));
    }

    /**
     *
     * @param {string} name
     * @param {array} filePaths
     * @param {object} [optionalSettings={}]
     * @return voiceId
     * @memberof ElevenLabs
     */
    async addVoice(name, filePaths, optionalSettings = {}){
        optionalSettings.filePaths = filePaths;
        return this.#voiceFunc(name, optionalSettings);
    }

    /**
     *
     * @param {string} name
     * @param {string} voiceId
     * @param {object} [optionalSettings = {}]
     * @return status message
     * @memberof ElevenLabs
     */
    async editVoice(name, voiceId, optionalSettings = {}){
        return this.#voiceFunc(name, optionalSettings, voiceId);
    }

    /**
     *
     * @return remaining letters you have left in your subscription
     * @memberof ElevenLabs
     */
    async getRemainingLetters(){
        const userInfo = await this.getUserInfo();
        return userInfo === undefined ? undefined : userInfo.subscription.character_limit - userInfo.subscription.character_count;
    }

    /**
     *
     * @return all the models that are available
     * @memberof ElevenLabs
     */
    async getModels(){
        return await jsonGet("/models", this.apiKey);
    }

    /**
     *
     * @return all the voices including the custom ones and the default ones
     * @memberof ElevenLabs
     */
    async getVoices(){
        return await jsonGet("/voices", this.apiKey);
    }

    /**
     *
     * @return all the voices you created
     * @memberof ElevenLabs
     */
    async getCustomVoices(){
        const voices = await this.getVoices();
        return voices.voices.filter((/** @type {{ category: string; }} */ voice) => voice.category === "cloned");
    }

    /**
     *
     * @return all the voice ids of voices you created
     * @memberof ElevenLabs
     */
    async getCustomVoiceIds(){
        const voices = await this.getCustomVoices();
        // eslint-disable-next-line camelcase
        return voices.map(({ name, voice_id }) => ({ name, voiceId: voice_id }));
    }

    /**
     *
     * @return default settings for voices
     * @memberof ElevenLabs
     */
    async getDefaultVoiceSettings(){
        return await jsonGet("/voices/settings/default", this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return settings for a specific voice
     * @memberof ElevenLabs
     */
    async getVoiceSettings(voiceId){
        return await jsonGet(`/voices/${voiceId}/settings`, this.apiKey);
    }

    /**
     *
     * @param {object} settings
     * @param {string} voiceId
     * @return status message
     * @memberof ElevenLabs
     */
    async editVoiceSettings(settings, voiceId){
        return await fullJsonPost(`/voices/${voiceId}/settings/edit`,
            this.apiKey,
            settings,
        );
    }

    /**
     *
     * @param {string} voiceId
     * @return a specific voice object
     * @memberof ElevenLabs
     */
    async getVoice(voiceId){
        return await jsonGet(`/voices/${voiceId}`, this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteVoice(voiceId){
        return await deleteReq(`/voices/${voiceId}`, this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return all the sample ids of a specific voice
     * @memberof ElevenLabs
     */
    async getSampleIds(voiceId){
        const voice = await this.getVoice(voiceId);
        return voice.samples.map((/** @type {{ file_name: string; sample_id: string; }} */ sample) => {
            return {
                name: sample.file_name,
                sampleId: sample.sample_id,
            };
        });
    }

    /**
     *
     * @param {string} voiceId
     * @param {string} sampleId
     * @return status message
     * @memberof ElevenLabs
     */
    async getAudioFromSample(voiceId, sampleId){
        const response = await get(
            `/voices/${voiceId}/samples/${sampleId}/audio`,
            "",
            this.apiKey,
            "audio/*",
        ).then((res) => res.blob());

        return saveBlobToFile(response, this.outputFolder + "/samples", "SAMPLE");
    }

    /**
     *
     * @param {string} voiceId
     * @param {string} sampleId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteSample(voiceId, sampleId){
        return await deleteReq(`/voices/${voiceId}/samples/${sampleId}`, this.apiKey);
    }

    /**
     *
     * @return history object
     * @memberof ElevenLabs
     */
    async getHistory(){
        return await jsonGet("/history", this.apiKey);
    }

    /**
     *
     * @param {string} historyItemId
     * @return history item object
     * @memberof ElevenLabs
     */
    async getHistoryItem(historyItemId){
        return await jsonGet(`/history/${historyItemId}`, this.apiKey);
    }

    /**
     *
     * @param {string} historyItemId
     * @return status message
     * @memberof ElevenLabs
     */
    async getAudioFromHistoryItem(historyItemId){
        const response = await audioGet(`/history/${historyItemId}/audio`, this.apiKey);
        return saveBlobToFile(response, this.outputFolder + "/history", "HISTORY");
    }

    /**
     *
     * @param {string} historyItemId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteHistoryItem(historyItemId){
        return await deleteReq(`/history/${historyItemId}`, this.apiKey);
    }

    /**
     *
     * @param {array} historyItemIds
     * @return status message
     * @memberof ElevenLabs
     */
    async downloadHistoryItems(historyItemIds){
        const response = await post(
            "/history/download",
            {
                accept: "*/*",
                "xi-api-key": this.apiKey,
                "Content-Type": "application/json",
            },
            JSON.stringify(
                {
                    history_item_ids: historyItemIds,
                },
            ),
        ).then((res) => res.blob());

        return saveZip(response.stream(), this.outputFolder + "/history");
    }

    /**
     *
     * @return user object
     * @memberof ElevenLabs
     */
    async getUserInfo(){
        return await jsonGet("/user", this.apiKey);
    }

    /**
     *
     * @return subscription object
     * @memberof ElevenLabs
     */
    async getUserSubscriptionInfo(){
        return await jsonGet("/user/subscription", this.apiKey);
    }
}

export default ElevenLabs;