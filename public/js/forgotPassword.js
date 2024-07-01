import axios from "axios"
import { showAlert } from "./alert.js"

export const forgotPassword = async (email) => {
    try {

        const res = await axios({
            method: 'post',
            url: '/api/v1/auth/forgotPassword',
            data: {
                email: email
            }
        })
        // console.log(res);

        if (res.data.status === 'Success') {
            showAlert('success', 'reset password token send successfully')
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}