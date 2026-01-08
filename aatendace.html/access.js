async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('cameraElement').srcObject = stream;
    // Camera started—show video stream
  } catch (error) {
    alert("Camera access denied or not available.");
    // Handle permission denied or no camera
  }
}
