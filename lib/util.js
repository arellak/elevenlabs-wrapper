import fss from "node:fs";
import fs from "node:fs/promises";
import Path from "node:path";
import {finished, Readable} from "node:stream";

const createDirectories = async(outputFolder) => {
    await fs.mkdir(Path.resolve(outputFolder), {recursive: true});
};

const saveBlobToFile = async(blob, fileType, outputFolder, type) => {
    await createDirectories(outputFolder);
    const buffer = await blob.arrayBuffer();
    const array = new Uint8Array(buffer);

    const date = new Date();
    const dateString = `${type}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const fileName = `./${outputFolder}/${dateString}.${fileType}`;
    try{
        await fs.writeFile(Path.resolve(fileName), array);
    }
    catch(error){
        return {code: -1, message: error};
    }

    return {code: 1, message: `File written successfully: ${fileName}`};
};

const saveZip = async(zip, outputFolder, type) => {
    await createDirectories(outputFolder);
    const date = new Date();
    const dateString = `${type}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const fileName = `./${outputFolder}/${dateString}`;

    const stream = fss.createWriteStream(Path.resolve(`${fileName}.zip`));
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

const buildFormData = async({name, description = "", labels = {}, filePaths}) => {
    const formData = new FormData();

    formData.append("name", name);
    if(description !== undefined && description.trim() !== "") formData.append("description", description);
    if(Object.keys(labels).length > 0) formData.append("labels", JSON.stringify(labels));

    for(const filePath of filePaths){
        const file = new File([await fs.readFile(Path.resolve(filePath))], Path.basename(filePath), {type: "audio/mpeg"});
        formData.append("files", file);
    }

    return formData;
};

export {createDirectories, saveBlobToFile, saveZip, buildFormData};
