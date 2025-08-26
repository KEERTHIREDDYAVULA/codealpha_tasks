const audioElement = document.getElementById('audio-element');
const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeSpan = document.getElementById('current-time');
const totalDurationSpan = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistUl = document.getElementById('playlist');
const playbackSpeedSelect = document.getElementById('playback-speed-select');

let currentSongIndex = 0;
let isPlaying = false;

const playlist = [
  {
    title: "Inspiring Cinematic",
    artist: "Scott Buckley",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://placehold.co/250x250/63B3ED/FFFFFF?text=Inspiring"
  },
  {
    title: "Relaxing Ambient",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://placehold.co/250x250/9F7AEA/FFFFFF?text=Relaxing"
  },
  {
    title: "Upbeat Corporate",
    artist: "Bensound",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://placehold.co/250x250/F6AD55/FFFFFF?text=Upbeat"
  },
  {
    title: "Energetic Pop",
    artist: "Mixkit",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://placehold.co/250x250/F56565/FFFFFF?text=Energetic"
  },
  {
    title: "Smooth Jazz",
    artist: "Jazz Music",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://placehold.co/250x250/48BB78/FFFFFF?text=Jazz"
  }
];

function loadSong(index, autoPlay = false) {
  const song = playlist[index];
  audioElement.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  albumCover.src = song.cover;
  updatePlaylistHighlight(index);

  audioElement._autoPlayAfterLoad = autoPlay;
  audioElement.playbackRate = parseFloat(playbackSpeedSelect.value);

  playPauseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  playPauseBtn.disabled = true;
  audioElement.load();
}

function playSong() {
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  albumCover.classList.add('playing');
  audioElement.play().catch(() => pauseSong());
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  albumCover.classList.remove('playing');
  audioElement.pause();
}

function togglePlayPause() {
  if (isPlaying) pauseSong();
  else playSong();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex, true);
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex, true);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function updateProgress() {
  const { duration, currentTime } = audioElement;
  if (!isNaN(duration)) {
    progressBar.style.width = `${(currentTime / duration) * 100}%`;
    currentTimeSpan.textContent = formatTime(currentTime);
  }
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audioElement.duration;
  if (!isNaN(duration)) audioElement.currentTime = (clickX / width) * duration;
}

function setTotalDuration() {
  if (!isNaN(audioElement.duration)) {
    totalDurationSpan.textContent = formatTime(audioElement.duration);
  }
}

function setVolume() {
  audioElement.volume = volumeSlider.value;
}

function setPlaybackSpeed() {
  audioElement.playbackRate = parseFloat(playbackSpeedSelect.value);
}

function renderPlaylist() {
  playlistUl.innerHTML = '';
  playlist.forEach((song, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.innerHTML = `
      <div>
        <div class="playlist-title">${song.title}</div>
        <div class="playlist-artist">${song.artist}</div>
      </div>
      <span class="playlist-duration"></span>
    `;
    playlistUl.appendChild(li);

    const tempAudio = new Audio(song.src);
    tempAudio.addEventListener('loadedmetadata', () => {
      li.querySelector('.playlist-duration').textContent = formatTime(tempAudio.duration);
    });
  });
}

function updatePlaylistHighlight(activeIndex) {
  playlistUl.querySelectorAll('li').forEach((item, index) => {
    item.classList.toggle('active', index === activeIndex);
  });
}

playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audioElement.addEventListener('timeupdate', updateProgress);
audioElement.addEventListener('loadedmetadata', () => {
  setTotalDuration();
  if (audioElement._autoPlayAfterLoad) playSong();
  playPauseBtn.disabled = false;
});
audioElement.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
playbackSpeedSelect.addEventListener('change', setPlaybackSpeed);

playlistUl.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (li) {
    currentSongIndex = parseInt(li.dataset.index);
    loadSong(currentSongIndex, true);
  }
});

renderPlaylist();
loadSong(currentSongIndex);
audioElement.volume = volumeSlider.value;
