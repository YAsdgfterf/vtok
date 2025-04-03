// Search Functionality
function searchVideos() {
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const videos = document.querySelectorAll('.video');
  videos.forEach(video => {
    const videoTitle = video.id.toLowerCase();
    if (videoTitle.includes(searchQuery)) {
      video.style.display = 'block';
    } else {
      video.style.display = 'none';
    }
  });
}

// Upload Video
function openUploadModal() {
  document.getElementById('upload-modal').style.display = 'block';
}

function closeUploadModal() {
  document.getElementById('upload-modal').style.display = 'none';
}

function uploadVideo() {
  const fileInput = document.getElementById('upload-input');
  const file = fileInput.files[0];
  if (file) {
    // Here you can use an API to upload the file to your server
    console.log('Uploading video:', file.name);
    closeUploadModal();
  }
}

// Start Recording
let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const videoElement = document.getElementById('camera-stream');
      videoElement.srcObject = stream;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        // Here you can upload the recorded video URL
        console.log('Video recorded: ', url);
      };

      mediaRecorder.start();
    })
    .catch(error => console.error('Error accessing media devices:', error));
}
