/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import axios from "axios";
import { showAlert } from "./alert.js";

export const resetPassword = async (resetToken, password, confirmPassword) => {

    try {

        const res = await axios({
            method: 'patch',
            url: `/api/v1/auth/resetPassword/${resetToken}`,
            data: {
                password,
                confirmPassword
            }
        })

        // console.log(res)

        if (res.data.status === 'Success') {
            showAlert('success', 'password updated successfully')
        }

    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}