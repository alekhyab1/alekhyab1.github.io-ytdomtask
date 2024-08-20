const API_KEY = "AIzaSyAHWTUJnReCTI_M9mlPoa6B_oaJatwmJYo"; 
const searchInput = document.getElementById('searchInput');
const videoContainer = document.getElementById('videoContainer');
const paginationDiv = document.getElementById('pagination');
let currentQuery = '';
let nextPageToken = '';
let prevPageToken = '';

document.getElementById('searchInput').addEventListener('input', function() {
    if (this.value.length > 3) {
        currentQuery = this.value
        searchVideos(currentQuery, '');
    }
});

function searchVideos(query, pageToken) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=15&q=${query}&pageToken=${pageToken}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayVideos(data.items);
            nextPageToken = data.nextPageToken || '';
            prevPageToken = data.prevPageToken || '';
            setupPagination();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayVideos(videos) {
    videoContainer.innerHTML = ''; 
    videos.forEach(video => {
        const videoEl = document.createElement('div');
        videoEl.classList.add('thumbnail');
        videoEl.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
            <div class="video-info">
                <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">${video.snippet.title}</a>
                <p>${video.snippet.description}</p>
            </div>
        `;
        videoContainer.appendChild(videoEl);
    });
}

function setupPagination() {
    paginationDiv.innerHTML = '';
    if (prevPageToken) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => searchVideos(currentQuery, prevPageToken);
        paginationDiv.appendChild(prevButton);
    }
    if (nextPageToken) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => searchVideos(currentQuery, nextPageToken);
        paginationDiv.appendChild(nextButton);
    }
}