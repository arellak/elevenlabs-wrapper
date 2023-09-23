import * as fs from "fs";
import * as Path from "path";

class ElevenLabs {
    /**
     *  Creates an instance of ElevenLabs.
     * @param {object} [options={apiKey: "", outputFolder: "./output"}]
     * @memberof ElevenLabs
     */
    constructor(options = {apiKey: "", outputFolder: "./output"}){
        this.apiKey = options.apiKey;
        this.apiUrl = "https://api.elevenlabs.io/v1";
        this.outputFolder = options.outputFolder;

        this.#createFolders(this.outputFolder);
    }

    #createFolders(path){
        const folders = path.split("/");
        let folderPath = ".";

        folders.forEach((folder) => {
            if(!fs.existsSync(Path.resolve(folderPath, folder))){
                fs.mkdirSync(Path.resolve(folderPath, folder));
            }

            folderPath += `/${folder}`;
        });
    }


    /**
     *
     * @param {string} text
     * @param {string} voiceId
     * @param {string} [modelId = "eleven_multilingual_v2"]
     * @param {object} [voiceSettings = {stability: 0.5, similarity_boost: 0.75}]
     * @param {object} [params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}]
     * @return Status message
     * @memberof ElevenLabs
     */
    async tts(text, voiceId, modelId = "eleven_multilingual_v2", voiceSettings = {stability: 0.5, similarity_boost: 0.75}, params = {output_format: "mp3_44100_128", optimize_streaming_latency: 0}){
        const body = {
            text,
            model_id: modelId,
            voice_settings: voiceSettings,
        };
        const response = await fetch(`${this.apiUrl}/text-to-speech/${voiceId}?output_format=${params.output_format}&optimize_streaming_latency=${params.optimize_streaming_latency}`, {
            method: "POST",
            headers: {
                accept: "audio/mpeg",
                "xi-api-key": this.apiKey || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((res) => res.blob());

        const buffer = await response.arrayBuffer();
        const array = new Uint8Array(buffer);

        const date = new Date();
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const fileName = `./${this.outputFolder}/${dateString}.mp3`;
        fs.writeFileSync(Path.resolve(fileName), array);

        if(!fs.existsSync(fileName)){
            return "Error while wrting file.";
        }

        return `File written successfully: ${fileName}`;
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
        const formData = new FormData();

        formData.append("name", name);
        if(optionalSettings.description !== undefined && optionalSettings.description !== "") formData.append("description", optionalSettings.description);
        if(Object.keys(optionalSettings.labels).length > 0) formData.append("labels", JSON.stringify(optionalSettings.labels));

        for(const filePath of filePaths){
            const file = new File([fs.readFileSync(filePath)], Path.basename(filePath), {type: "audio/mpeg"});
            formData.append("files", file);
        }

        const response = await fetch(`${this.apiUrl}/voices/add`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
            body: formData,
        }).then((res) => res.json());

        return response;
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
        const formData = new FormData();

        formData.append("name", name);
        if(optionalSettings.description !== undefined && optionalSettings.description !== "") formData.append("description", optionalSettings.description);
        if(Object.keys(optionalSettings.labels).length > 0) formData.append("labels", JSON.stringify(optionalSettings.labels));

        if(optionalSettings.filePaths !== undefined){
            for(const filePath of optionalSettings.filePaths){
                const file = new File([fs.readFileSync(filePath)], Path.basename(filePath), {type: "audio/mpeg"});
                formData.append("files", file);
            }
        }

        const response = await fetch(`${this.apiUrl}/voices/${voiceId}/edit`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
            body: formData,
        }).then((res) => res.json());

        return response;
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
        return await fetch(`${this.apiUrl}/models`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json()).catch((error) => {
            console.log(error);
        });
    }


    /**
     *
     * @return all the voices including the custom ones and the default ones
     * @memberof ElevenLabs
     */
    async getVoices(){
        return await fetch(`${this.apiUrl}/voices`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json()).catch((error) => {
            console.log(error);
        });
    }


    /**
     *
     * @return all the voices you created
     * @memberof ElevenLabs
     */
    async getCustomVoices(){
        const voices = await fetch(`${this.apiUrl}/voices`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());

        return voices.voices.filter((voice) => voice.category === "cloned");
    }


    /**
     *
     * @return all the voice ids of voices you created
     * @memberof ElevenLabs
     */
    async getCustomVoiceIds(){
        const voices = await this.getCustomVoices();
        return voices.map((voice) => {
            return {
                name: voice.name,
                voiceId: voice.voice_id,
            };
        });
    }


    /**
     *
     * @return default settings for voices
     * @memberof ElevenLabs
     */
    async getDefaultVoiceSettings(){
        return await fetch(`${this.apiUrl}/voices/settings/default`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} voiceId
     * @return settings for a specific voice
     * @memberof ElevenLabs
     */
    async getVoiceSettings(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}/settings`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {object} settings
     * @param {string} voiceId
     * @return status message
     * @memberof ElevenLabs
     */
    async editVoiceSettings(settings, voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}/settings/edit`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} voiceId
     * @return a specific voice object
     * @memberof ElevenLabs
     */
    async getVoice(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}?with_settings=false`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} voiceId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteVoice(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} voiceId
     * @return all the sample ids of a specific voice
     * @memberof ElevenLabs
     */
    async getSampleIds(voiceId){
        const voice = await this.getVoice(voiceId);
        return voice.samples.map((sample) => {
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
        const response = await fetch(`${this.apiUrl}/voices/${voiceId}/samples/${sampleId}/audio`, {
            method: "GET",
            headers: {
                accept: "audio/*",
                "xi-api-key": this.apiKey || "",
            },
        }).then((res) => res.blob());

        // save audio to file
        const buffer = await response.arrayBuffer();
        const array = new Uint8Array(buffer);

        const date = new Date();
        const dateString = `sample_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const fileName = `./${this.outputFolder}/${dateString}.mp3`;
        fs.writeFileSync(Path.resolve(fileName), array);

        if(!fs.existsSync(fileName)){
            return "Error while wrting file.";
        }

        return `File written successfully: ${fileName}`;
    }


    /**
     *
     * @param {string} voiceId
     * @param {string} sampleId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteSample(voiceId, sampleId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}/samples/${sampleId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @return history object
     * @memberof ElevenLabs
     */
    async getHistory(){
        return await fetch(`${this.apiUrl}/history`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} historyItemId
     * @return history item object
     * @memberof ElevenLabs
     */
    async getHistoryItem(historyItemId){
        return await fetch(`${this.apiUrl}/history/${historyItemId}`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {string} historyItemId
     * @return status message
     * @memberof ElevenLabs
     */
    async getAudioFromHistoryItem(historyItemId){
        const response = await fetch(`${this.apiUrl}/history/${historyItemId}/audio`, {
            method: "GET",
            headers: {
                accept: "audio/mpeg",
                "xi-api-key": this.apiKey || "",
            },
        }).then((res) => res.blob());

        // save audio to file
        const buffer = await response.arrayBuffer();
        const array = new Uint8Array(buffer);

        const date = new Date();
        const dateString = `history_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const fileName = `./${this.outputFolder}/${dateString}.mp3`;
        fs.writeFileSync(Path.resolve(fileName), array);

        if(!fs.existsSync(fileName)){
            return "Error while wrting file.";
        }

        return `File written successfully: ${fileName}`;
    }


    /**
     *
     * @param {string} historyItemId
     * @return status message
     * @memberof ElevenLabs
     */
    async deleteHistoryItem(historyItemId){
        return await fetch(`${this.apiUrl}/history/${historyItemId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @param {array} historyItemIds
     * @return status message
     * @memberof ElevenLabs
     */
    async downloadHistoryItems(historyItemIds){
        const response = await fetch(`${this.apiUrl}/history/download`, {
            method: "POST",
            headers: {
                accept: "*/*",
                "xi-api-key": this.apiKey || "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    history_item_ids: historyItemIds,
                },
            }),
        }).then((res) => res.blob());

        const buffer = await response.arrayBuffer();
        const array = new Uint8Array(buffer);

        const date = new Date();
        const dateString = `history_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const fileName = `./${this.outputFolder}/${dateString}.zip`;
        fs.writeFileSync(Path.resolve(fileName), array);

        if(!fs.existsSync(fileName)){
            return "Error while wrting file.";
        }

        return `File written successfully: ${fileName}`;
    }


    /**
     *
     * @return user object
     * @memberof ElevenLabs
     */
    async getUserInfo(){
        return await fetch(`${this.apiUrl}/user`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }


    /**
     *
     * @return subscription object
     * @memberof ElevenLabs
     */
    async getUserSubscriptionInfo(){
        return await fetch(`${this.apiUrl}/user/subscription`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }
}

export default ElevenLabs;
