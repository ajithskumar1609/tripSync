/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import axios from "axios"
import { showAlert } from "./alert.js"

export const addItemToWishList = async (tourId) => {

    try {
        const res = await axios(`/api/v1/wishList/addToWishList/${tourId}`)
        console.log(res);

        if (res.data.status === 'Success') {
            showAlert('success', 'Item add to wishlist');
            location.reload(true);
        }
    } catch (err) {
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}
export const removeItemFromWishList = async (tourId) => {

    try {
        const isConfirm = window.confirm('Are you deleted the item')

        if (isConfirm) {
            const res = await axios({
                method: 'delete',
                url: `/api/v1/wishList/removeItemFromWishList/${tourId}`
            })
            console.log(res);

            if (res.data.status === 'Success') {
                showAlert('success', 'Item was deleted')
                location.reload(true);
            }
        }

    } catch (err) {
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}