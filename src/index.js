import axios from 'axios';

const refs = {
  formEl: document.querySelector('.search-form'),
  btnEl: document.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
};
refs.formEl.addEventListener('submit', handlerImg);

function handlerImg(evt) {
  evt.preventDefault();
  const searchImage = refs.formEl.searchQuery.value;
  console.log(searchImage);

  getImg(searchImage)
    .then(response => {
      console.log(response.data.hits);
      createMarkup(response.data.hits);
    })
    .catch(err => console.log(err));
}
// axios.defaults.headers.common['x-api-key'] =
//   '39106428-5c7ff9c9615a8fde7969ec155';

function getImg(inp) {
  return axios
    .get(
      `https://pixabay.com/api/?key=39106428-5c7ff9c9615a8fde7969ec155&q=${inp}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
    )
    .then(response => {
      console.log(response);
      return response;
    });
}
function createMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  return refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}
