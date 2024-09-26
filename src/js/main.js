import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


// Pixabay API anahtarını tanımla
const API_KEY = '46197993-0238acfcd6230053ff5f60fb7'; // Kendi API anahtarınızı buraya ekleyin
const BASE_URL = 'https://pixabay.com/api/';

// DOM içeriği yüklendikten sonra çalışacak fonksiyonu tanımla
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.querySelector('.search-input');
    const gallery = document.querySelector('.gallery'); // Galeri alanını seçin

    // Form gönderildiğinde çalışacak olay dinleyicisi
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Formun varsayılan davranışını engelle

        const query = input.value.trim(); // Kullanıcıdan arama terimini al
        if (!query) {
            iziToast.error({
                title: 'Error',
                message: 'Please enter a search query.',
            });
            return; // Eğer arama terimi yoksa çık
        }

        // Önce galeriyi temizle
        gallery.innerHTML = '';

        // Yükleme göstergesini göster
        const loader = document.querySelector('.loader'); // Yükleme göstergesini seç
        loader.style.display = 'block'; // Yükleyiciyi göster

        try {
            const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true`);
            const data = await response.json(); // Yanıtı JSON formatında al

            // Yükleme göstergesini gizle
            loader.style.display = 'none';

            if (data.hits.length === 0) {
                iziToast.info({
                    title: 'Info',
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                });
                return; // Eğer sonuç yoksa çık
            }

            // Görselleri ekle
            data.hits.forEach(hit => {
                const item = document.createElement('div');
                item.classList.add('gallery-item');

                item.innerHTML = `
                    <a href="${hit.largeImageURL}" class="gallery-link">
                        <img src="${hit.webformatURL}" alt="${hit.tags}" class="gallery-image" />
                    </a>
                    <div class="info">
                        <p class="info-item"><b>Likes</b> ${hit.likes}</p>
                        <p class="info-item"><b>Views</b> ${hit.views}</p>
                        <p class="info-item"><b>Comments</b> ${hit.comments}</p>
                        <p class="info-item"><b>Downloads</b> ${hit.downloads}</p>
                    </div>
                `;
                gallery.appendChild(item);
            });

            // SimpleLightbox'u yenile
            const lightbox = new SimpleLightbox('.gallery-link', { /* opsiyonel ayarlar */ });
            lightbox.refresh();

        } catch (error) {
            loader.style.display = 'none'; // Yükleme göstergesini gizle
            iziToast.error({
                title: 'Error',
                message: 'Failed to fetch images. Please try again.',
            });
            console.error('Error:', error); // Hata mesajını konsola yazdır
        }
    });
});

