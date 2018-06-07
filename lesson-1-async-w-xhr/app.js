(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    // let searchedForText;
    const responseContainer = document.querySelector('#response-container');
    var searchedForText = 'hippos';

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
    });


    var unsplashRequest = new XMLHttpRequest();

    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.onload = addImage;
    unsplashRequest.setRequestHeader('Authorization', 'Client-ID 9ae8c99681d73d47019c617956e205c3e00d36562aea8358f747fcbcbfd145cc');
    unsplashRequest.send();

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
})();
