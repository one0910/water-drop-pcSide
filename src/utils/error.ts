/**
，由於ant design proComponent的組件<ProTable/>的組件在渲染時會出下面的錯誤訊息
，所以裡這一個做錯誤訊息的過濾，讓瀏覽器的控制台不會輸出這些錯誤，不過這只是暫時的解法，治標不治本
findDOMNode is deprecated and will be removed in the next major release. 
Instead, add a ref directly to the element you want to reference.
*/
const consoleError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('Warning: findDOMNode is deprecated')
  ) {
    return;
  }
  consoleError(...args);
};