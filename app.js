const SUPABASE_URL = "https://ywykbhqrmarptijohyvy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eWtiaHFybWFycHRpam9oeXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDk5NjMsImV4cCI6MjA1OTIyNTk2M30.swH8nbMUPz-Lyld0k5fomNRi3TiOGKVwsCF3Bods6WE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let videoContainer = document.getElementById('video-feed');

// Fetch and display videos
async function fetchVideos() {
  try {
    const { data, error } = await supabase.storage.from('videos').list();

    if (error) {
      console.error("Error fetching videos:", error);
      return;
    }

    // Clear the current video feed
    videoContainer.innerHTML = "";

    data.forEach(video => {
      const { data: videoUrlData } = supabase.storage.from('videos').getPublicUrl(video.name);
      const videoUrl = videoUrlData.publicUrl;

      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;
      videoElement.controls = true;
      videoElement.classList.add("video");
      videoElement.setAttribute('data-title', video.name);

      videoContainer.appendChild(videoElement);
    });
  } catch (err) {
    console.error("Error fetching videos:", err);
  }
}

// Upload Video and Show it After Uploading
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

    // Immediately fetch and display the uploaded video
    fetchVideos();
  } catch (err) {
    console.error("Error uploading file:", err);
  }

  closeUploadModal();
}

// Open & Close Upload Modal
function openUploadModal() {
  document.getElementById('upload-modal').style.display = 'block';
}

function closeUploadModal() {
  document.getElementById('upload-modal').style.display = 'none';
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

// Load Videos on Page Load
document.addEventListener("DOMContentLoaded", fetchVideos);
