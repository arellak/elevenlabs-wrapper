const base = async(endpoint, method, headers, body) => {
    const baseUrl = "https://api.elevenlabs.io/v1";
    return await fetch(baseUrl + endpoint, {
        method,
        headers,
        body: body ?? undefined,
    });
};

const get = async(endpoint, contentType, apiKey, accept) => {
    return await base(endpoint, "GET", {
        "Content-Type": contentType ?? "",
        "xi-api-key": apiKey ?? "",
        accept: accept ?? "",
    });
};

const jsonGet = async(endpoint, apiKey) => {
    return await get(endpoint, "application/json", apiKey, "application/json")
        .then((response) => response.json())
        .catch((error) => console.log(error));
};

const audioGet = async(endpoint, apiKey) => {
    return await get(endpoint, "", apiKey, "audio/mpeg")
        .then((response) => response.blob())
        .catch((error) => console.log(error));
};

const post = async(endpoint, headers, body) => {
    return await base(endpoint, "POST", headers, body);
};

const jsonPost = async(endpoint, apiKey, body) => {
    return await post(endpoint, {
        "Content-Type": "application/json",
        "xi-api-key": apiKey ?? "",
    }, JSON.stringify(body))
        .then((response) => response.json())
        .catch((error) => console.log(error));
};

const fullJsonPost = async(endpoint, apiKey, body) => {
    return await post(endpoint, {
        "Content-Type": "application/json",
        "xi-api-key": apiKey ?? "",
        accept: "application/json",
    }, JSON.stringify(body))
        .then((response) => response.json())
        .catch((error) => console.log(error));
};

const audioPost = async(endpoint, apiKey, body) => {
    return await post(endpoint, {
        accept: "audio/mpeg",
        "xi-api-key": apiKey ?? "",
        "Content-Type": "application/json",
    }, JSON.stringify(body))
        .then((response) => response.blob())
        .catch((error) => console.log(error));
};

const deleteReq = async(endpoint, apiKey) => {
    return await base(endpoint, "DELETE", {
        "Content-Type": "application/json",
        "xi-api-key": apiKey ?? "",
    }, {})
        .then((response) => response.json())
        .catch((error) => console.log(error));
};

export {base, get, post, jsonGet, audioGet, jsonPost, fullJsonPost, deleteReq, audioPost};
