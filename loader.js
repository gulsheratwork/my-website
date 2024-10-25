(function () {
    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://gulsheratwork.github.io/my-website/';
    iframe.style.width = '100%';
    iframe.style.height = '600px';  // Adjust height as needed
    iframe.style.border = 'none';

    // Append iframe to the body
    document.body.appendChild(iframe);
})();
