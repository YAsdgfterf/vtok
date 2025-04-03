const SUPABASE_URL = "https://ywykbhqrmarptijohyvy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eWtiaHFybWFycHRpam9oeXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDk5NjMsImV4cCI6MjA1OTIyNTk2M30.swH8nbMUPz-Lyld0k5fomNRi3TiOGKVwsCF3Bods6WE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch a random video from Supabase and display it in an iframe
async function displayRandomVideo() {
  try {
    // Fetch all videos from Supabase
    const { data, error } = await supabase.storage.from('videos').list();

    if (error) {
      console.error("Error fetching videos:", error);
      return;
    }

    // Select a random video from the list
    const randomVideo = data[Math.floor(Math.random() * data.length)];

    // Get the public URL for the selected video
    const { data: videoUrlData } = supabase.storage.from('videos').getPublicUrl(randomVideo.name);
    const videoUrl = videoUrlData.publicUrl;

    // Embed the video in an iframe
    const iframe = document.createElement("iframe");
    iframe.src = videoUrl;
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; fullscreen";
    iframe.id = "video-iframe";

    // Append the iframe to the body
    document.body.innerHTML = ""; // Clear the body to make space for the iframe
    document.body.appendChild(iframe);

    // Make the iframe take up the whole screen using CSS
    document.getElementById('video-iframe').style.width = "100%";
    document.getElementById('video-iframe').style.height = "100vh"; // Fullscreen height

  } catch (err) {
    console.error("Error fetching random video:", err);
  }
}

// Load a random video when the page loads
document.addEventListener("DOMContentLoaded", displayRandomVideo);
