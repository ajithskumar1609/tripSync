// eslint-disable-next-line no-undef
import axios from 'axios'
import { showAlert } from './alert.js';

// eslint-disable-next-line no-undef
const stripe = Stripe('pk_test_51PXKkvSBqCRPakCmfhPODGJn52I9Z3BbCpsVprlzH3wOL0Q2LaTjEbmlmdbqWV8G3LqApDfhCJdR0H6Iqlj7ZTrF00UzE9uJcW');


export const bookTour = async (tourId) => {
    try {
        // Get the Checkout session from API
        const session = await axios(`/api/v1/booking/checkout-session/${tourId}`)
        // console.log(session);
        // Create checkout form  + charge for credit card
        stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        // console.log(err)
        showAlert('error', err)
    }
}