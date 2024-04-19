const buttonHtml = `<div class="mt-3 hidden rounded-lg px-2 py-3 pt-1.5 bg-overlay-light mdlg:block"><div class="flex flex-col items-center pt-1"> <form class="w-full" action="/"><button type="submit" class="rounded-lg font-semibold disabled:opacity-50 border bg-action-muted border-default px-4 py-2 text-sm w-full">Open in Supercast</button></form> </div></div>`
console.log('asdasfas')
function injectButton() {
    const asideArr = document.querySelectorAll('aside');
    const aside = asideArr[1];

    if (!aside) {
        console.error('Aside not found');
        return;
    }

    // find the div that contains the text 'Invite friends, earn warps'
    const hasInviteBox = Array.from(aside.children).find(div => div.textContent?.includes('Invite friends, earn warps'));

    if (!hasInviteBox) {
        console.error('Invite friends, earn warps not found');
        return;
    }
    const buttonDOM = new DOMParser().parseFromString(buttonHtml, 'text/html').body.firstChild;
    if (!buttonDOM) {
        console.error('Button DOM not found');
        return;
    }

    // get current url address
    let url = window.location.pathname;
    url = url.replace('/~/', '/');

    const supercastUrl = `https://supercast.xyz${url}`;

    // add the supercast url to the form action
    buttonDOM.querySelector('form').setAttribute('action', supercastUrl);


    // replace the second div with the buttonDOM
    aside.children[1].replaceWith(buttonDOM);
}

let attempts = 0;
const maxAttempts = 30;
const interval = 500;

const intervalId = setInterval(function () {
    const success = injectButton();
    attempts++;

    if (success || attempts >= maxAttempts) {
        clearInterval(intervalId);
    }
}, interval);