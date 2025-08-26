const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.getElementById('close-lightbox');
const prevImageBtn = document.getElementById('prev-image');
const nextImageBtn = document.getElementById('next-image');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentImageIndex = 0;
let filteredImages = [];

// Sample image data
const images = [
  { src: "https://picsum.photos/id/1018/600/400", alt: "Forest with sunlight", category: "nature" },
  { src: "https://picsum.photos/id/1015/600/400", alt: "Mountain lake", category: "nature" },
  { src: "https://picsum.photos/id/1016/600/400", alt: "Beach sunset", category: "nature" },
  { src: "https://picsum.photos/id/1019/600/400", alt: "Waterfall", category: "nature" },
  { src: "https://picsum.photos/id/1039/600/400", alt: "City street at night", category: "city" },
  { src: "https://picsum.photos/id/1037/600/400", alt: "Modern building exterior", category: "city" },
  { src: "https://picsum.photos/id/1045/600/400", alt: "Abstract light patterns", category: "abstract" },
  { src: "https://picsum.photos/id/1047/600/400", alt: "Colorful abstract art", category: "abstract" },
  { src: "https://picsum.photos/id/237/600/400", alt: "Cute puppy", category: "animals" },
  { src: "https://picsum.photos/id/219/600/400", alt: "Majestic lion", category: "animals" },
  { src: "https://picsum.photos/id/200/600/400", alt: "Elephant in the wild", category: "animals" }
];

/** Renders images */
function renderGallery(imagesToRender) {
  galleryGrid.innerHTML = '';
  imagesToRender.forEach((image, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'gallery-item bg-white p-2';
    imgContainer.dataset.index = index;

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    img.onerror = function () {
      this.onerror = null;
      this.src = 'https://placehold.co/600x400/CCCCCC/666666?text=Image+Load+Error';
      this.alt = 'Image failed to load';
    };

    imgContainer.appendChild(img);
    galleryGrid.appendChild(imgContainer);
  });
}

/** Opens lightbox */
function openLightbox(index) {
  currentImageIndex = index;
  showImage(currentImageIndex);
  lightbox.classList.remove('hidden');
  void lightbox.offsetWidth; // reflow
  lightbox.classList.add('opacity-100');
}

/** Closes lightbox */
function closeLightbox() {
  lightbox.classList.remove('opacity-100');
  lightbox.classList.add('hidden');
}

/** Shows image in lightbox */
function showImage(index) {
  if (filteredImages.length === 0) return;
  currentImageIndex = (index + filteredImages.length) % filteredImages.length;
  lightboxImg.src = filteredImages[currentImageIndex].src;
  lightboxImg.alt = filteredImages[currentImageIndex].alt;
  lightboxImg.onerror = function () {
    this.onerror = null;
    this.src = 'https://placehold.co/900x600/CCCCCC/666666?text=Image+Load+Error';
    this.alt = 'Image failed to load';
  };
}

/** Next/Prev image */
function nextImage() { showImage(currentImageIndex + 1); }
function prevImage() { showImage(currentImageIndex - 1); }

/** Filters */
function filterImages(category) {
  filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'hover:bg-blue-600', 'active:bg-blue-700'));
  filterButtons.forEach(btn => btn.classList.add('bg-gray-300', 'text-gray-800', 'hover:bg-gray-400', 'active:bg-gray-500'));

  const activeButton = document.querySelector(`.filter-btn[data-category="${category}"]`);
  if (activeButton) {
    activeButton.classList.add('active', 'bg-blue-500', 'hover:bg-blue-600', 'active:bg-blue-700');
    activeButton.classList.remove('bg-gray-300', 'text-gray-800', 'hover:bg-gray-400', 'active:bg-gray-500');
  }

  filteredImages = category === 'all' ? [...images] : images.filter(image => image.category === category);
  renderGallery(filteredImages);
}

// --- Event Listeners ---
galleryGrid.addEventListener('click', (event) => {
  const galleryItem = event.target.closest('.gallery-item');
  if (galleryItem) {
    const originalIndex = parseInt(galleryItem.dataset.index);
    const indexInFiltered = filteredImages.findIndex(img => img.src === images[originalIndex].src);
    if (indexInFiltered !== -1) {
      openLightbox(indexInFiltered);
    }
  }
});

closeLightboxBtn.addEventListener('click', closeLightbox);
prevImageBtn.addEventListener('click', prevImage);
nextImageBtn.addEventListener('click', nextImage);

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('hidden')) {
    if (event.key === 'ArrowRight') nextImage();
    else if (event.key === 'ArrowLeft') prevImage();
    else if (event.key === 'Escape') closeLightbox();
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => filterImages(button.dataset.category));
});

// Initial render
filterImages('all');
