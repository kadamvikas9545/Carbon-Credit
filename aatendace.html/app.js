const video = document.getElementById('video');
const qrResult = document.getElementById('qr-result');
const qrContainer = document.getElementById('qr-container');
const qrText = document.getElementById('qr-text');
const generateQRBtn = document.getElementById('generate-qr');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let scanning = false;

// Access webcam and scan QR code
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  video.srcObject = stream;
  scanning = true;
  scan();
}

function stopCamera() {
  scanning = false;
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  video.srcObject = null;
}

function scan() {
  if (!scanning) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      qrResult.textContent = 'QR Code Data: ' + code.data;
      stopCamera(); // stop after successful scan

      // Optionally send code.data to backend API for attendance marking
      // Example: markAttendanceQR(code.data);
      return;
    } else {
      qrResult.textContent = 'Scanning for QR code...';
    }
  }
  requestAnimationFrame(scan);
}

// Generate QR code from text input
generateQRBtn.addEventListener('click', () => {
  const text = qrText.value.trim();
  if (!text) return alert('Enter text to generate QR code.');
  qrContainer.innerHTML = '';
  QRCode.toCanvas(text, { width: 200, margin: 2 }, function (error, canvas) {
    if (error) return console.error(error);
    qrContainer.appendChild(canvas);
  });
});

// Start camera on page load or you can call this on button click
startCamera();