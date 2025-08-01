import { request } from "./user.test.setup.js";

export const doRequest = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    data?: string | object,
    contentType?: string
) => {
    let requestSetup;

    switch (method) {
        case "GET":
            requestSetup = request.get(url);
            break;
        case "POST":
            requestSetup = request.post(url);
            break;
        case "PUT":
            requestSetup = request.put(url);
            break;
        case "DELETE":
            requestSetup = request.delete(url);
            break;
    }

    if (contentType) {
        requestSetup.set("Content-Type", contentType);
    }

    // mientras sea GET el método, no se envía data
    return method === "GET"
        ? await requestSetup.send()
        : await requestSetup.send(data);
};
