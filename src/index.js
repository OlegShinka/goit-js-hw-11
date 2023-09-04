import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '480px',
  position: 'center-center',
  distance: '10px',
  opacity: 0.7,
  fontSize: '18px',
  cssAnimationStyle: 'zoom',
});

const galleryLightBox = new SimpleLightbox('.gallery a');

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
let page;
let searchImage;

function handlerImg(evt) {
  evt.preventDefault();
  refs.loadEl.classList.remove('hidden');
  searchImage = refs.formEl.searchQuery.value;
  //перевірка на пустий запит
  if (searchImage === '') {
    refs.loadEl.classList.add('hidden');
    Notiflix.Notify.warning(
      'Sorry, the input field cannot be empty. Please try again.'
    );
    refs.galleryEl.innerHTML = '';
    return;
  }

  //   refs.galleryEl.innerHTML = '';
  page = 1;
  getImg(searchImage, page)
    .then(response => {
      console.log(response.data.hits);
      const totalHits = response.data.totalHits;
      const nameImage = response.data.hits;
      if (nameImage.length === 0) {
        refs.loadEl.classList.add('hidden');
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      createMarkup(response.data.hits);
      galleryLightBox.refresh();
    })
    .catch(err => console.log(err));
  refs.galleryEl.innerHTML = '';
}

refs.loadEl.addEventListener('click', onLoad);
function onLoad() {
  page += 1;

  getImg(searchImage, page)
    .then(response => {
      const totalHits = response.data.totalHits;
      const totalPage = totalHits / 40;
      //   let currentTotalHits = page * 40;
      if (page > totalPage) {
        refs.loadEl.classList.add('hidden');
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }

      createMarkup(response.data.hits);
      galleryLightBox.refresh();
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
    <a href="${largeImageURL}" class="js-link"><img src="${webformatURL}" alt="${tags}" width=300 loading="lazy" /></a>
  <div class="info">
  <div class="info-desc"><p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>${likes}</b>
    </p></div>
    
    <div class="info-desc"><p class="info-item">
      <b>Views</b>
    </p><p class="info-item">
      <b>${views}</b>
    </p>
    </div>

    <div class="info-desc"><p class="info-item">
      <b>Comments</b>
    </p><p class="info-item">
      <b>${comments}</b>
    </p>
    </div>

    <div class="info-desc"><p class="info-item">
      <b>Downloads</b>
    </p><p class="info-item">
      <b>${downloads}</b>
    </p></div> 
    
  </div>
</div>`
    )
    .join('');
  return refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}
