// Define the button HTML outside the function to avoid recreating it unnecessarily
const buttonHtml = `<div id="supercast-button" class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="flex flex-col items-center pt-1"> <form class="w-full"><button type="submit" class="rounded-lg font-semibold disabled:opacity-50 border bg-action-muted border-default px-4 py-2 text-sm w-full">Open in Supercast</button></form> </div></div>`;

function getSupercastUrl() {
    let url = window.location.pathname;
    url = url.replace('/~/', '/');
    return `https://supercast.xyz${url}`;
}

function injectButton() {
    // Get the current URL path
    let urlPath = window.location.pathname;

    // Check if the URL matches the specified patterns
    const pattern1 = /^(?!.*\/~\/)(?:\/[^\/]+(?:\/[a-zA-Z0-9]*)?)$/;
    // const pattern2 = /^\/~\/channel(\/|$)/;

    checkDomExists = document.getElementById('supercast-button');

    if (!pattern1.test(urlPath)) {
        console.log('URL does not match the required patterns.');
        if (checkDomExists) {
            checkDomExists.remove();
        }
        return;
    }

    const asideArr = document.querySelectorAll('aside');
    const aside = asideArr[1];

    if (!aside) {
        console.error('Aside not found');
        return;
    }

    // Check if the button already exists
    let buttonDOM = aside.querySelector('#supercast-button');

    if (!buttonDOM) {
        // Create the button if it doesn't exist
        buttonDOM = new DOMParser().parseFromString(buttonHtml, 'text/html').body.firstChild;
        if (!buttonDOM) {
            console.error('Button DOM not found');
            return;
        }

        // Initially set the supercast url to the form action
        buttonDOM.querySelector('form').setAttribute('action', getSupercastUrl());

        // Insert the button into the aside
        const hasInviteBox = Array.from(aside.children).find(div => div.textContent?.includes('Invite friends, earn warps'));
        if (!hasInviteBox) {
            aside.children[1].replaceWith(buttonDOM);
        } else {
            const children = Array.from(aside.children);
            children.splice(1, 0, buttonDOM);
            aside.innerHTML = '';
            children.forEach(child => aside.appendChild(child));
        }
    } else {
        // Update the supercast url if the button already exists
        buttonDOM.querySelector('form').setAttribute('action', getSupercastUrl());
    }

    return true;
}

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function () {
    originalPushState.apply(history, arguments);
    injectButton();
};

history.replaceState = function () {
    originalReplaceState.apply(history, arguments);
    injectButton();
};

window.addEventListener('popstate', () => {
    injectButton();
});
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            injectButton();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });


let attempts = 0;
const maxAttempts = 30;
const interval = 1000;

setTimeout(() => {
    const intervalId = setInterval(() => {
        const success = injectButton();
        attempts++;

        if (success || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, interval);
}, 3000);