import 'babel-polyfill';

function enablePandasConnection() {
    window.sessionStorage.setItem('pandas', 'True');
}
function disablePandasConnection() {
    window.sessionStorage.removeItem('pandas');
}
function pandasIsActive() {
    return window.sessionStorage.getItem('pandas');
}
function enableClosePandasServer() {
    if (pandasIsActive()) {
        window.sessionStorage.setItem('closeServer', 'True');
    }
}
function disableClosePandasServer() {
    if (pandasIsActive()) {
        window.sessionStorage.removeItem('closeServer');
    }
}
function closeServer() {
    return window.sessionStorage.getItem('closeServer');
}
function getQueryValue(tag) {
    const url = window.location.href;
    const name = tag.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}=([^&#]*)|&|#|$`);
    return regex.exec(url)[1];
}

export {
    enableClosePandasServer,
    disableClosePandasServer,
    closeServer,
    enablePandasConnection,
    disablePandasConnection,
    pandasIsActive,
    getQueryValue
};
