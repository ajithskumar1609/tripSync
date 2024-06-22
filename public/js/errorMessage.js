/* eslint-disable no-undef */
const errorElement = document.getElementById('error-message');

const hideErrorMessage = () => {
    window.setTimeout(() => {
        errorElement.innerText = ''
    }, 3000)
}

export const errorMessage = (message) => {
    errorElement.innerText = message;
    hideErrorMessage();
}

