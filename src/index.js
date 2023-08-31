import axios from 'axios';
// all modules
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '480px',
  position: 'center-center',
  distance: '10px',
  opacity: 0.7,

  fontSize: '18px',

  cssAnimationStyle: 'zoom',
});
const refs = {
  formEl: document.querySelector('.search-form'),
  btnEl: document.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  loadEl: document.querySelector('.load-more'),
};
refs.loadEl.classList.add('hidden');
refs.formEl.addEventListener('submit', handlerImg);

const BASE_URL = 'https://pixabay.com/';
const END_POINT = 'api/';
const API_KEY = 'key=39106428-5c7ff9c9615a8fde7969ec155';
let page = 1;

function handlerImg(evt) {
  evt.preventDefault();
  refs.loadEl.classList.remove('hidden');
  searchImage = refs.formEl.searchQuery.value;

  getImg(searchImage)
    .then(response => {
      console.log(response.data.hits);
      if (response.data.hits.length === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      createMarkup(response.data.hits);
    })
    .catch(err => console.log(err));
  refs.galleryEl.innerHTML = '';
}

refs.loadEl.addEventListener('click', onLoad);
function onLoad() {
  console.log(page);
  page += 1;
  getImg(searchImage, page)
    .then(response => {
      const totalHits = response.data.totalHits;
      const totalPage = totalHits / 40;
      let currentTotalHits = page * 40;
      if (page > totalPage) {
        refs.loadEl.classList.add('hidden');
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      Notiflix.Notify.info(`Hooray! We found ${currentTotalHits} images.`);
      createMarkup(response.data.hits);
    })
    .catch(err => console.log(err));
}

async function getImg(inp, page) {
  const response = await axios.get(
    `${BASE_URL}${END_POINT}?${API_KEY}&q=${inp}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return response;
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
  <img src="${webformatURL}" alt="${tags}" width=300 loading="lazy" />
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
