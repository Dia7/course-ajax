/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID 9ae8c99681d73d47019c617956e205c3e00d36562aea8358f747fcbcbfd145cc'
            }
        }).done(addImage)
            .fail(function (err) {
                requestError(err, 'image');
            });

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=cc86ccf1bac24bab9deab2c120e11230`
        }).done(addArticles)
            .fail(function (err) {
                requestError(err, 'articles');
            });


    });

    function addImage(images) {
        let htmlContent = '';

        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];

            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(data) {
        let htmlContent = '';
        // const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No articles Available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }

})();
