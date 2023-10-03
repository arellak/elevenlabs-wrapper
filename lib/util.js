import fs from "fs";
import Path from "path";
import {finished, Readable} from "stream";

const createDirectories = (outputFolder) => {
    if(!fs.existsSync(Path.resolve(outputFolder))){
        fs.mkdirSync(Path.resolve(outputFolder), {recursive: true});
    }
};

const saveBlobToFile = async(blob, outputFolder, type) => {
    createDirectories(outputFolder);

    const date = new Date();
    const dateString = `${type}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const fileName = `./${outputFolder}/${dateString}.mp3`;

    await Bun.write(Path.resolve(fileName), blob);

    if(!fs.existsSync(Path.resolve(fileName))){
        return {code: -1, message: "Error while wrting file."};
    }

    return {code: 1, message: `File written successfully: ${fileName}`};
};

const saveZip = async(zip, outputFolder, type) => {
    createDirectories(outputFolder);
    const date = new Date();
    const dateString = `${type}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const fileName = `./${outputFolder}/${dateString}`;

    const stream = fs.createWriteStream(Path.resolve(`${fileName}.zip`));
    const result = finished(Readable.fromWeb(zip).pipe(stream), (err) => {
        if(err){
            console.log("Stream failed.", err);
        }
        else{
            console.log("Stream succeeded.");
        }
    });

    return result;
};

const buildFormData = ({name, description = "", labels = {}, filePaths}) => {
    const formData = new FormData();

    formData.append("name", name);
    if(description !== undefined && description.trim() !== "") formData.append("description", description);
    if(Object.keys(labels).length > 0) formData.append("labels", JSON.stringify(labels));

    for(const filePath of filePaths){
        const file = new File([fs.readFileSync(Path.resolve(filePath))], Path.basename(filePath), {type: "audio/mpeg"});
        formData.append("files", file);
    }

    return formData;
};

export {saveBlobToFile, createDirectories, saveZip, buildFormData};
