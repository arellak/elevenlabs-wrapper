import * as fs from "fs";
import * as Path from "path";

class ElevenLabs {
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

    async addVoice(name, description = "", filePaths, labels = {}){
        const formData = new FormData();

        formData.append("name", name);
        if(description !== "") formData.append("description", description);
        if(Object.keys(labels).length > 0) formData.append("labels", JSON.stringify(labels));

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

    async getRemainingLetters(){
        const userInfo = await this.getUserInfo();
        return userInfo === undefined ? undefined : userInfo.subscription.character_limit - userInfo.subscription.character_count;
    }

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

    async getCustomVoiceIds(){
        const voices = await this.getCustomVoices();
        return voices.map((voice) => {
            return {
                name: voice.name,
                voiceId: voice.voice_id,
            };
        });
    }

    async getDefaultVoiceSettings(){
        return await fetch(`${this.apiUrl}/voices/settings/default`, {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        }).then((response) => response.json());
    }

    async getVoiceSettings(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}/settings`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

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

    async getVoice(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}?with_settings=false`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

    async deleteVoice(voiceId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

    async getSampleIds(voiceId){
        const voice = await this.getVoice(voiceId);
        return voice.samples.map((sample) => {
            return {
                name: sample.file_name,
                sampleId: sample.sample_id,
            };
        });
    }

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

    async deleteSample(voiceId, sampleId){
        return await fetch(`${this.apiUrl}/voices/${voiceId}/samples/${sampleId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

    async getHistory(){
        return await fetch(`${this.apiUrl}/history`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

    async getHistoryItem(historyItemId){
        return await fetch(`${this.apiUrl}/history/${historyItemId}`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

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

    async deleteHistoryItem(historyItemId){
        return await fetch(`${this.apiUrl}/history/${historyItemId}`, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

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

    async getUserInfo(){
        return await fetch(`${this.apiUrl}/user`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "xi-api-key": this.apiKey || "",
            },
        }).then((response) => response.json());
    }

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
