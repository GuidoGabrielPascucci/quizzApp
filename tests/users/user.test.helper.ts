import { request } from "./user.test.setup.js";

export const doRequest = async (
    url: string,
    data: string | object,
    contentType?: string
) => {
    let requestSetup = request.post(url);
    if (contentType) {
        requestSetup.set("Content-Type", contentType);
    }
    return await requestSetup.send(data);
};
