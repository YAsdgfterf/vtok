const SUPABASE_URL = "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const peerConnection = new RTCPeerConnection();
let mediaRecorder;
let recordedChunks = [];

// Start Live Stream (WebRTC)
function startLiveStream() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      document.getElementById('camera-stream').srcObject = stream;
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    })
    .catch(error => console.error('Error accessing media devices:', error));
}

// Screen Share
function startScreenShare() {
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    .then(stream => {
      const videoElement = document.getElementById('camera-stream');
      videoElement.srcObject = stream;
      
      mediaRecorder = new MediaRecorder(stream);
      recordedChunks = [];

      mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
      mediaRecorder.onstop = () => uploadRecordedVideo(new Blob(recordedChunks, { type: 'video/webm' }));

      mediaRecorder.start();
    })
    .catch(error => console.error('Error accessing screen share:', error));
}

// Search Functionality
function searchVideos() {
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const videos = document.querySelectorAll('.video');
  videos.forEach(video => {
    const videoTitle = video.getAttribute('data-title').toLowerCase();
    video.style.display = videoTitle.includes(searchQuery) ? 'block' : 'none';
  });
}

// Open & Close Upload Modal
function openUploadModal() {
  document.getElementById('upload-modal').style.display = 'block';
}

function closeUploadModal() {
  document.getElementById('upload-modal').style.display = 'none';
}

// Upload Video to Supabase
async function uploadVideo() {
  const fileInput = document.getElementById('upload-input');
  const file = fileInput.files[0];

  if (!file) {
    console.error("No file selected.");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  try {
    const { data, error } = await supabase.storage.from('videos').upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    console.log("Uploaded successfully:", data);
    alert("Video uploaded!");

    // Refresh video list
    fetchVideos();
  } catch (err) {
    console.error("Error uploading file:", err);
  }

  closeUploadModal();
}

// Start Recording and Upload to Supabase
function startRecording() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const videoElement = document.getElementById('camera-stream');
      videoElement.srcObject = stream;

      mediaRecorder = new MediaRecorder(stream);
      recordedChunks = [];

      mediaRecorder.ondataavailable = event => recordedChunks.push(event.data);
      mediaRecorder.onstop = () => uploadRecordedVideo(new Blob(recordedChunks, { type: 'video/webm' }));

      mediaRecorder.start();
    })
    .catch(error => console.error('Error accessing media devices:', error));
}

// Upload Recorded Video to Supabase
async function uploadRecordedVideo(blob) {
  const file = new File([blob], `recorded-${Date.now()}.webm`, { type: "video/webm" });
  const fileName = `recorded-${Date.now()}.webm`;

  try {
    const { data, error } = await supabase.storage.from("videos").upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    console.log("Recorded video uploaded:", data);
    alert("Recording uploaded!");

    fetchVideos();
  } catch (err) {
    console.error("Error uploading recorded video:", err);
  }
}

// Fetch and Display Videos from Supabase
async function fetchVideos() {
  try {
    const { data, error } = await supabase.storage.from('videos').list();

    if (error) {
      console.error("Error fetching videos:", error);
      return;
    }

    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";

    data.forEach(video => {
      const { data: videoUrl } = supabase.storage.from('videos').getPublicUrl(video.name);

      const videoElement = document.createElement("video");
      videoElement.src = videoUrl.publicUrl;
      videoElement.controls = true;
      videoElement.classList.add("video");
      videoElement.setAttribute('data-title', video.name);

      videoContainer.appendChild(videoElement);
    });

  } catch (err) {
    console.error("Error fetching videos:", err);
  }
}

// Load Videos on Page Load
document.addEventListener("DOMContentLoaded", fetchVideos);
