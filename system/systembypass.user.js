// ==UserScript==
// @name         System Bypasser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass Key Systems
// @author       Scott Ferren
// @license       CC BY 4.0
// @match        *://gateway.platoboost.com/a/8?id=*
// @match        *://*.linkvertise.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    function handlePlatoboostUrl() {
        if (!currentUrl.includes("&tk=297h")) {
            const tkInclude = getCookie('TK_INCLUDE');
            if (tkInclude === '1') {
                setCookie('TK_INCLUDE', '2', 1);
                const newUrl = currentUrl + "&tk=297h";
                window.location.href = newUrl;
            } else {
                setCookie('TK_INCLUDE', '1', 1);
            }
        }

        const dontfoidElement = document.getElementById('dontfoid');
        if (dontfoidElement) {
            dontfoidElement.remove();
            console.log('%c Removed hidden popup successfully ', 'color: lime; font-weight: bold; font-size: 16px;');
            console.log('ID: dontfoid');
        }
    }

    function handleLinkvertiseUrl() {
        const intervalId = setInterval(() => {
            const headlineElement = document.querySelector('.content-component__headline.ng-star-inserted');
            if (headlineElement && /platoboost/i.test(headlineElement.textContent)) {
                clearInterval(intervalId);
                setCookie('TK_INCLUDE', '1', 1); 
                history.back();
            }
        }, 1000);
    }

    if (/https:\/\/gateway\.platoboost\.com\/a\/8\?id=/.test(currentUrl)) {
        handlePlatoboostUrl();
    }

    if (currentUrl.includes("linkvertise.com")) {
        handleLinkvertiseUrl();
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
})();
