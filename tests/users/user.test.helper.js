import { request } from "./user.test.setup.js";

export const doRequest = async (url, data, contentType) => {
    let requestSetup = request.post(url);
    if (contentType) {
        requestSetup.set('Content-Type', contentType);
    }
    return await requestSetup.send(data);
}
