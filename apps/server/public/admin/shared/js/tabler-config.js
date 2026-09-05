(() => {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/assets/tabler/css/tabler.min.css';
    document.head.appendChild(cssLink);

    const jsScript = document.createElement('script');
    jsScript.src = '/assets/tabler/js/tabler.min.js';
    jsScript.defer = true;
    document.head.appendChild(jsScript);
})();
