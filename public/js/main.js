/* eslint-disable no-undef */

import { login, logout } from './login.js';
import { resendOtp, signup, verifyOtp } from './signup.js'
import { updateSettings } from './updateSetting.js';
import { deleteAccount, deactivateAccount } from './accountSetting.js';
import { sideScroll } from './category.js';
import { clearFilterPrice, filterPrice, filterRating, filterSort, filterDifficulty } from './allTour.js';
import { bookTour } from './stripe.js';
import { addItemToWishList, removeItemFromWishList } from './wishList.js';
import { forgotPassword } from './forgotPassword.js';
import { resetPassword } from './resetPassword.js';




// DOM SELECTION
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutButton = document.getElementById('log-out');
const verifyOtpForm = document.getElementById("otp-form");
const profileElement = document.getElementById('profile');
const subMenuElement = document.getElementById('sub-menu');
const rotateIcon = document.getElementById('icon');
const updateUserDataForm = document.getElementById('form-user-data');
const updateUserPasswordForm = document.getElementById('user-password-form');
const deactivateButton = document.getElementById('deactivate-btn');
const deleteButton = document.getElementById('delete-btn');
const resendOtpButton = document.getElementById('resend-otp');
const categoryListElement = document.getElementById('category-list');
const priceMinElement = document.getElementById('price-select-box-min');
const priceMaxElement = document.getElementById('price-select-box-max');
const clearFilterButton = document.getElementById('clear-btn')
const customerRatingElement = document.querySelector('.customer-rating-container');
const rating = document.querySelectorAll('.rating-check-box');
const sort = document.querySelectorAll('.sort-checkbox');
const difficulty = document.querySelectorAll('.difficulty-checkbox');
const sortingElement = document.querySelector('.sort-container');
const difficultyElement = document.querySelector('.difficulty-container');
const bookBtn = document.getElementById('book-tour');
const tourBookingSection = document.querySelector('.product-section-container');
const wishListSection = document.querySelector('.wishlist-section-container');
const wishListButtons = document.querySelectorAll('.wishlist-btn');
const wishListRemoveButtons = document.querySelectorAll('.remove-btn');
const forgotForm = document.getElementById('forgot-form');
const resetForm = document.getElementById('reset-form');

// login existing user

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}


// signup new User

if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        signup(name, email, password, confirmPassword)
    })
}


// logout 

if (logoutButton) logoutButton.addEventListener('click', logout)


// verify otp

if (verifyOtpForm) {
    verifyOtpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const otp = document.getElementById('otp').value;

        verifyOtp(email, otp);
    })
}

if (profileElement) {
    profileElement.addEventListener('click', () => {
        subMenuElement.classList.toggle('sub-menu-open');
        rotateIcon.classList.toggle('rotate-icon')
    })
}

// image read url

function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}


// updateUser Data

if (updateUserDataForm) {
    $("#photo").change(function () {
        readURL(this);
    });
    updateUserDataForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value)
        formData.append('email', document.getElementById('email').value)
        formData.append('photo', document.getElementById('photo').files[0]);

        updateSettings('data', formData);
    })
}

// update user Password

if (updateUserPasswordForm) {
    updateUserPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        updateSettings('password', { currentPassword, newPassword, confirmPassword })
    })
}
// Delete Account

if (deleteButton) deleteButton.addEventListener('click', deleteAccount);

// Deactivate Account

if (deactivateButton) deactivateButton.addEventListener('click', deactivateAccount);

// Resend otp

if (resendOtpButton) {
    resendOtpButton.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        resendOtp(email);
    })
}



if (priceMaxElement) {
    priceMaxElement.addEventListener('change', function () {
        const minPrice = priceMinElement.value;
        const maxPrice = priceMaxElement.value;
        console.log(maxPrice)
        filterPrice(minPrice, maxPrice)
    })
}

// CLEAR FILTER PRICE

if (clearFilterButton) clearFilterButton.addEventListener('click', clearFilterPrice)


// CUSTOMER RATING
if (rating) {
    rating.forEach((el) => {
        el.addEventListener('change', () => {
            if (el.checked === true) {
                console.log(el.value);
                filterRating(el.value);
            }
        })
    })
}

// SORTING

if (sort) {
    sort.forEach((el) => {
        el.addEventListener('change', () => {
            if (el.checked === true) {
                console.log(el.value);
                filterSort(el.value);
            }
        })
    })
}

// DIFFICULTY

if (difficulty) {
    difficulty.forEach((el) => {
        el.addEventListener('change', () => {
            filterDifficulty(el.value);
        })
    })
}








// CATEGORY NEXT AND PREVIOUS SCROLL

if (categoryListElement) {
    const button = document.getElementById('next-btn');
    button.onclick = function () {
        const container = document.getElementById('category-list');
        sideScroll(container, 'right', 25, 100, 10);
    };

    const back = document.getElementById('previous-btn');
    back.onclick = function () {
        const container = document.getElementById('category-list');
        sideScroll(container, 'left', 25, 100, 10);
    };
}

// CUSTOMER RATING ELEMENT TOGGLE
if (customerRatingElement) {
    $(document).ready(function () {
        $('.customer-rating-container').click(function () {
            $('.rating-menu').toggleClass('rating-menu-open');
        })
    })
}

// SORTING ELEMENT TOGGLE 
if (sortingElement) {
    $(document).ready(function () {
        $('.sort-container').click(function () {
            $('.sort-menu').toggleClass('sort-menu-open');
        })
    })
}

// DIFFICULTY ELEMENT TOGGLE

if (difficultyElement) {
    $(document).ready(function () {
        $('.difficulty-container').click(function () {
            $('.difficulty-menu').toggleClass('difficulty-menu-open');
        })
    })
}


// book tour

if (bookBtn) {
    bookBtn.addEventListener('click', (event) => {
        event.target.textContent = 'processing.....';
        const { tourId } = event.target.dataset
        bookTour(tourId);
    })
}


if (tourBookingSection) {
    wishListButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const { tourId } = event.target.dataset
            // console.log(tourId);
            addItemToWishList(tourId)
        })

    })
}


if (wishListSection) {
    console.log(tourBookingSection);
    wishListRemoveButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const { tourId } = event.target.dataset
            // console.log(tourId);
            removeItemFromWishList(tourId)
        })

    })
}


// FORGOT FORM 

console.log(forgotForm);

if (forgotForm) {
    forgotForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
    })
}


if (resetForm) {
    resetForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const resetToken = document.getElementById('reset-token').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        resetPassword(resetToken, password, confirmPassword);
    })
}