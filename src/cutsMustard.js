/*
https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#browser_compatibility

chrome 42
edge 14
firefox 39
ie -
opera 29
safari 10.1
*/
export default (window.fetch && window.history) ? true : false;
