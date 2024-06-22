/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */


export function filterPrice(minPrice, maxPrice) {
    $(document).ready(function () {
        const url = `/filteredTour?price[gte]=${minPrice}&price[lte]=${maxPrice}`;
        $.get(url, function (data, status) {
            if (status === 'success') {
                $('.tour-list-section').html(data);
            } else {
                console.log(data);
            }
        })
    })

}


export function clearFilterPrice() {
    location.reload();
}


export function filterRating(rating) {
    $(document).ready(function () {
        const url = `/filteredTour?ratingsAverage[gte]=${rating}`;
        $.get(url, function (data, status) {
            if (status === 'success') {
                console.log(data)
                $('.tour-list-section').html(data);
            } else {
                console.log(data);
            }
        })
    })
}

export function filterSort(value) {
    $(document).ready(function () {
        const url = `/filteredTour?sort=${value}`;
        $.get(url, function (data, status) {
            if (status === 'success') {
                console.log(data)
                $('.tour-list-section').html(data);
            } else {
                console.log(data);
            }
        })
    })
}
export function filterDifficulty(value) {
    $(document).ready(function () {
        const url = `/filteredTour?difficulty=${value}`;
        $.get(url, function (data, status) {
            if (status === 'success') {
                console.log(data)
                $('.tour-list-section').html(data);
            } else {
                console.log(data);
            }
        })
    })
}