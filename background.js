chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return { redirectUrl: "https://supercast.xyz" };
    },
    { urls: ["*://warpcast.xyz/*"] },
    ["blocking"]
);