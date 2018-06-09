(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 9ae8c99681d73d47019c617956e205c3e00d36562aea8358f747fcbcbfd145cc'
            }
        }).then(response => response.json())
            .then(addImage)
            .catch(err => requestError(err, 'images')
            );

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=cc86ccf1bac24bab9deab2c120e11230`)
            .then(response => response.json())
            .then(addArticles)
            .catch(err => requestError(err, 'articles'));
    });

    function addImage(data) {
        let htmlContent = '';
        const firstImage = data.results[0];

        if (firstImage) {
            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = 'Unfortunately, no image was returned for your search.';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(data) {
        let htmlContent = '';
        // const data = JSON.parse(this.responseText);
        const articles = data.response.docs;

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
