import {deleteReq, post, get, jsonGet, audioGet, fullJsonPost, audioPost} from "./apiHandler.js";
import {buildFormData, saveBlobToFile, saveZip} from "./util.js";

class ElevenLabs {
    /**
     *  Creates an instance of ElevenLabs.
     * @param {object} [options={apiKey: "", outputFolder: "./output"}]
     */
    constructor(options = {apiKey: "", outputFolder: ""}){
        this.apiKey = options.apiKey ?? "";
        this.outputFolder = options.outputFolder ?? "output";
    }

    /**
     *
     * @param {string} text
     * @param {string} voiceId
     * @param {string} optionalPath = ""
     * @param {string} modelId = "eleven_multilingual_v2"
     * @param {object} [voiceSettings = {stability: 0.5, similarity_boost: 0.75}]
     * @param {object} [params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}]
     * @return {Promise<object>} Status message
     */
    async tts(text, voiceId,  optionalPath = "", modelId = "eleven_multilingual_v2", voiceSettings = {stability: 0.5, similarity_boost: 0.75}, params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}){
        const body = {
            text,
            model_id: modelId,
            voice_settings: voiceSettings,
        };

        const searchParams = {
            output_format: params?.output_format,
            optimize_streaming_latency: params?.optimize_streaming_latency,
        };
        const urlSearchParams = new URLSearchParams(searchParams);

        const response = await audioPost(
            `/text-to-speech/${voiceId}?${urlSearchParams}`,
            this.apiKey,
            body,
        );

        const path = optionalPath === "" ? this.outputFolder + "/tts" : optionalPath;

        return saveBlobToFile(response, path, "AUDIO");
    }

    async #voiceFunc(name, optionalSettings = {}, voiceId = ""){
        const formData = await buildFormData({
            name,
            description: optionalSettings?.description ?? "",
            labels: optionalSettings?.labels ?? "",
            filePaths: optionalSettings?.filePaths ?? [],
        });

        return await post(voiceId === "" ? "/voices/add" : `/voices/${voiceId}/edit`, {
            accept: "application/json",
            "xi-api-key": this.apiKey ?? "",
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
     */
    async editVoice(name, voiceId, optionalSettings = {}){
        return this.#voiceFunc(name, optionalSettings, voiceId);
    }

    /**
     *
     * @return remaining letters you have left in your subscription
     */
    async getRemainingLetters(){
        const userInfo = await this.getUserInfo();
        return userInfo === undefined ? undefined : userInfo.subscription.character_limit - userInfo.subscription.character_count;
    }

    /**
     *
     * @return all the models that are available
     */
    async getModels(){
        return await jsonGet("/models", this.apiKey);
    }

    /**
     *
     * @return all the voices including the custom ones and the default ones
     */
    async getVoices(){
        return await jsonGet("/voices", this.apiKey);
    }

    /**
     *
     * @return all the voices you created
     */
    async getCustomVoices(){
        const voices = await this.getVoices();
        return voices.voices.filter((/** @type {{ category: string; }} */ voice) => voice.category === "cloned");
    }

    /**
     *
     * @return all the voice ids of voices you created
     */
    async getCustomVoiceIds(){
        const voices = await this.getCustomVoices();
        // eslint-disable-next-line camelcase
        return voices.map(({ name, voice_id }) => ({ name, voiceId: voice_id }));
    }

    /**
     *
     * @return default settings for voices
     */
    async getDefaultVoiceSettings(){
        return await jsonGet("/voices/settings/default", this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return settings for a specific voice
     */
    async getVoiceSettings(voiceId){
        return await jsonGet(`/voices/${voiceId}/settings`, this.apiKey);
    }

    /**
     *
     * @param {object} settings
     * @param {string} voiceId
     * @return status message
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
     */
    async getVoice(voiceId){
        return await jsonGet(`/voices/${voiceId}`, this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return status message
     */
    async deleteVoice(voiceId){
        return await deleteReq(`/voices/${voiceId}`, this.apiKey);
    }

    /**
     *
     * @param {string} voiceId
     * @return all the sample ids of a specific voice
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
     * @param {string} optionalPath = ""
     * @return {Promise<object>} status message
     */
    async getAudioFromSample(voiceId, sampleId, optionalPath = ""){
        const response = await get(
            `/voices/${voiceId}/samples/${sampleId}/audio`,
            "",
            this.apiKey,
            "audio/*",
        ).then((res) => res.blob());

        const path = optionalPath === "" ? this.outputFolder + "/samples" : optionalPath;

        return saveBlobToFile(response, path, "SAMPLE");
    }

    /**
     *
     * @param {string} voiceId
     * @param {string} sampleId
     * @return status message
     */
    async deleteSample(voiceId, sampleId){
        return await deleteReq(`/voices/${voiceId}/samples/${sampleId}`, this.apiKey);
    }

    /**
     *
     * @return history object
     */
    async getHistory(){
        return await jsonGet("/history", this.apiKey);
    }

    /**
     *
     * @param {string} historyItemId
     * @return history item object
     */
    async getHistoryItem(historyItemId){
        return await jsonGet(`/history/${historyItemId}`, this.apiKey);
    }

    /**
     *
     * @param {string} historyItemId
     * @param {string} optionalPath = ""
     * @return {Promise<object>} status message
     */
    async getAudioFromHistoryItem(historyItemId, optionalPath = ""){
        const response = await audioGet(`/history/${historyItemId}/audio`, this.apiKey);
        const path = optionalPath === "" ? this.outputFolder + "/history" : optionalPath;

        return saveBlobToFile(response, path, "HISTORY");
    }

    /**
     *
     * @param {string} historyItemId
     * @return status message
     */
    async deleteHistoryItem(historyItemId){
        return await deleteReq(`/history/${historyItemId}`, this.apiKey);
    }

    /**
     *
     * @param {array} historyItemIds
     * @param {string} optionalPath = ""
     * @return status message
     */
    async downloadHistoryItems(historyItemIds, optionalPath = ""){
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

        const path = optionalPath === "" ? this.outputFolder + "/history" : optionalPath;
        return saveZip(response.stream(), path, "HISTORY");
    }

    /**
     *
     * @return user object
     */
    async getUserInfo(){
        return await jsonGet("/user", this.apiKey);
    }

    /**
     *
     * @return subscription object
     */
    async getUserSubscriptionInfo(){
        return await jsonGet("/user/subscription", this.apiKey);
    }
}

export default ElevenLabs;
