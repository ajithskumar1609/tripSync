/* eslint-disable no-undef */

const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) alert.parentElement.removeChild(alert)
}

// type is success or error

export const showAlert = (type, message) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}