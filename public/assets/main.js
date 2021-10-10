const prefix = '/p/';

// Cryptography
function encode(str) {
    return encodeURIComponent(str.toString().split('').map((o, t) => t % 2 ? String.fromCharCode(2 ^ o.charCodeAt()) : o).join(''));
}

// Page Detection
try {
    let search = document.getElementById('search-bar');
    let provider = 'https://duckduckgo.com/';
    let suggelem = document.getElementById('searchsuggestions');
    let elemadd = (a, b, c) => Object.assign(b.appendChild(document.createElement(a)), c);

    // Search Suggestions
    search.addEventListener('input', () => {
        fetch(prefix + encode(`${provider}ac/?q=${search['value']}`)).then((a) => a.text()).then((a) => JSON.parse(`[${a.split('\n')[5].slice(0, -1)}]`)[0]).then((a) => {
            (suggelem.innerHTML = '');
            a.forEach((a) => elemadd('option', suggelem, {
                className: 'search-opt',
                value: a['phrase']
            }));
        });
    });

    // Submission and format detection
    document.getElementById('searchform').addEventListener('submit', () => {
        event.preventDefault();
        let v = search['value'];
        location.assign(/^(?:https?:\/\/)?\w+\.\w/.test(v)?/^(https?|ftp):/.test(v)?prefix+encode(v)+'/':prefix+encode('https://'+v)+'/':`${prefix}hvtrs8%2F-dwcidwcigm.aoo/?q=`+v);
    });
} catch {
    // Catch Media Page
    console.log('Uh, oh! ):');
}
