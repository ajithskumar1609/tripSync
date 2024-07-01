/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
import axios from "axios";
import { showAlert } from "./alert.js";


export const deleteAccount = async () => {
    const isConfirm = window.confirm('Are you sure account permanently delete');
    try {
        if (isConfirm) {
            const res = await axios({
                method: 'delete',
                url: '/api/v1/users/deleteMe',
            });

            if (res) {
                showAlert('success', 'You account has been deleted');
                window.setInterval(() => {
                    location.assign('/')
                }, 1500)
            }
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}


export const deactivateAccount = async () => {
    const isConfirm = window.confirm('Are you sure account temporary delete');
    try {
        if (isConfirm) {
            const res = await axios({
                method: 'patch',
                url: '/api/v1/users/deactivateMe',
            })

            if (res.data.status === 'Success') {
                showAlert('success', 'You account has been temporary delete')
                window.setInterval(() => {
                    location.assign('/')
                }, 1500)
            }
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}