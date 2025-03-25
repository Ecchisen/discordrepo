document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    const config = {
        imageCount: 27,
        videoCount: 8,
        imageExtensions: ['.jpg', '.jpeg', '.png', '.webp']
    };

    // Generate and display media
    const mediaData = generateMediaData(config);
    shuffleArray(mediaData);
    displayMedia(mediaData);
});

function generateMediaData(config) {
    const mediaData = [];
    
    // Image data
    for (let i = 1; i <= config.imageCount; i++) {
        mediaData.push({
            type: 'image',
            src: `img/img${i}.jpg`, 
            filename: `img${i}`
        });
    }

    // Video links (Google Drive direct preview)
    const driveVideos = [
        'https://drive.google.com/file/d/1Hdl-bSH2RbmadHLGv4h71r3VDQn0_RIu/view?usp=sharing',
        'https://drive.google.com/file/d/1UpG3Wgyt_3DXhc-Wrp2AJS8nHjZwhdwl/view?usp=sharing',
        'https://drive.google.com/file/d/1JKCjW0XQR1whlVKLFNjILy7FcvMf2GTv/view?usp=sharing',
        'https://drive.google.com/file/d/1eqc8wotZqjbocaWsxNYjGQ28S7umW3Kl/view?usp=sharing',
        'https://drive.google.com/file/d/1Qnw1JjEoq0N27P8k5WaIcq8UyFnL2zwu/view?usp=sharing',
        'https://drive.google.com/file/d/1IsVpfO-ue1KJMtX0hU9U28UK5UxnXg9d/view?usp=sharing',
        'https://drive.google.com/file/d/1oIa0ON_MjU1nP9jjOXuL7ADEOBBDbx_A/view?usp=sharing',
        'https://drive.google.com/file/d/1lR_dszLLXx4xYSFssKeZMHG8bebvY5aH/view?usp=sharing'
    ];

    driveVideos.forEach((url, index) => {
        mediaData.push({
            type: 'video',
            src: getDirectDownloadLink(url),
            filename: `vid${index + 1}`
        });
    });

    return mediaData;
}

function getDirectDownloadLink(shareLink) {
    try {
        const fileId = shareLink.match(/\/file\/d\/([^\/]+)/)?.[1];
        if (!fileId) throw new Error('Invalid Google Drive link');
        return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch (error) {
        console.error('Error processing Google Drive link:', error);
        return '';
    }
}

function displayMedia(mediaData) {
    const memoryWall = document.getElementById('memory-wall');
    memoryWall.innerHTML = '<div class="loading-spinner">Loading memories...</div>';

    mediaData.forEach((media, index) => {
        const memoryItem = createMemoryItem(media, index);
        if (memoryItem) {
            memoryWall.appendChild(memoryItem);
        }
    });

    // Remove loading state
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
}

function createMemoryItem(media, index) {
    if (!media.src) return null;

    const memoryItem = document.createElement('div');
    memoryItem.className = `memory-item ${media.type}-item`;
    memoryItem.setAttribute('data-index', index);

    if (media.type === 'image') {
        const img = new Image();
        img.src = media.src;
        img.alt = `Memory ${media.filename}`;
        img.loading = 'lazy';
        img.onerror = () => {
            console.warn(`Failed to load image: ${media.src}`);
            memoryItem.remove();
        };
        memoryItem.appendChild(img);
    } else if (media.type === 'video') {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        videoContainer.dataset.src = media.src;

        const iframe = document.createElement('iframe');
        iframe.src = media.src;
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; fullscreen';
        iframe.allowFullscreen = true;
        iframe.title = `Video ${media.filename}`;
        iframe.loading = 'lazy';

        videoContainer.appendChild(iframe);
        memoryItem.appendChild(videoContainer);
    }

    return memoryItem;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
