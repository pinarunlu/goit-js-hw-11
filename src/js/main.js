import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const API_KEY = '46197993-0238acfcd6230053ff5f60fb7';
const BASE_URL = 'https://pixabay.com/api/';


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.querySelector('.search-input');
    const gallery = document.querySelector('.gallery'); 
    const loader = document.querySelector('.loader'); 

 
    loader.style.display = 'none';

  
    function refreshGallery() {
        gallery.innerHTML = "";
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const query = input.value.trim(); 
        if (!query) {
            iziToast.error({
                title: 'Error',
                message: 'Please enter a search query.',
            });
            return; 
        }

      
        refreshGallery();

        
        setTimeout(async () => {
            try {
               
                loader.style.display = 'block';

                const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true`);
                const data = await response.json(); 

         
                loader.style.display = 'none';

                if (data.hits.length === 0) {
                    iziToast.info({
                        title: 'Info',
                        message: 'Sorry, there are no images matching your search query. Please try again!',
                    });
                    return; 
                }

                input.value = '';

              
                data.hits.forEach(hit => {
                    const item = document.createElement('div');
                    item.classList.add('gallery-item');

                    const link = document.createElement('a');
                    link.href = hit.largeImageURL;
                    link.classList.add('gallery-link');

                    const img = document.createElement('img');
                    img.src = hit.webformatURL;
                    img.alt = hit.tags;
                    img.classList.add('gallery-image');

                    link.appendChild(img);
                    item.appendChild(link);

                    const info = document.createElement('div');
                    info.classList.add('info');

                    info.innerHTML = `
                        <p class="info-item"><b>Likes</b> ${hit.likes}</p>
                        <p class="info-item"><b>Views</b> ${hit.views}</p>
                        <p class="info-item"><b>Comments</b> ${hit.comments}</p>
                        <p class="info-item"><b>Downloads</b> ${hit.downloads}</p>
                    `;
                    item.appendChild(info);

                    gallery.appendChild(item);
                });

              
                const lightbox = new SimpleLightbox('.gallery-link', {
                    captionsData: 'alt',
                    captionDelay: 250,
                });
                lightbox.refresh();

            } catch (error) {
               
                loader.style.display = 'none';
                iziToast.error({
                    title: 'Error',
                    message: 'Failed to fetch images. Please try again.',
                });
                console.error('Error:', error);
            }
        }, 100); 
    });
});
