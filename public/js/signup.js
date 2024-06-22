/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import axios from 'axios';
import { errorMessage } from './errorMessage.js';
import { showAlert } from './alert.js';


export const signup = async (name, email, password, confirmPassword) => {

    try {
        const res = await axios({
            method: 'post',
            url: '/api/v1/auth/signup',
            data: {
                name,
                email,
                password,
                confirmPassword
            }
        })

        console.log(res)
        if (res.data.status === 'Success') {
            showAlert('success', 'otp send Successfully')
            window.setTimeout(() => {
                location.assign('/verifyOtp')
            }, 1500)
        }

    } catch (err) {
        errorMessage(err.response.data.message)
    }

}

export const verifyOtp = async (email, otp) => {

    try {

        const res = await axios({
            method: 'post',
            url: '/api/v1/auth/verifyOtp',
            data: {
                email,
                otp
            }
        })

        if (res.data.status === 'Success') {
            showAlert('success', 'Signup successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }

    } catch (err) {
        errorMessage(err.response.data.message)
    }

}

export const resendOtp = async (email) => {
    try {
        const res = await axios({
            method: 'post',
            url: '/api/v1/auth/resendOtp',
            data: {
                email
            }
        })

        if (res.data.status === 'Success') {
            showAlert('success', 'otp send successfully')
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}