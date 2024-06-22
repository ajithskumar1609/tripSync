/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import axios from 'axios';
import { showAlert } from "./alert.js";


export const updateSettings = async (type, data) => {

    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe'

    try {

        const res = await axios({
            method: 'patch',
            url,
            data
        })

        if (res.data.status === 'Success') {
            showAlert('success', `update ${type.toUpperCase()} successfully`);
            window.setTimeout(() => {
                location.reload()
            }, 1500);
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }


}
