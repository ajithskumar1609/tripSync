/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import axios from 'axios';
import { showAlert } from './alert.js';
import { errorMessage } from './errorMessage.js';

export async function login(email, password) {
    try {
        const res = await axios({
            method: 'post',
            url: "/api/v1/auth/login",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'Success') {
            showAlert('success', 'Logged in successfully')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }

        // console.log(res);
    } catch (err) {
        errorMessage(err.response.data.message)
    }
}

export const logout = async () => {
    try {

        const res = await axios({
            method: 'get',
            url: '/api/v1/auth/logout'
        })

        // console.log(res);
        if (res.data.status === 'Success') location.reload(true);

    } catch (err) {
        showAlert('error', err.response.data.message)
    }

}