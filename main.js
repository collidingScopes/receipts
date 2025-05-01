
// DOM elements
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const brightnessSlider = document.getElementById('brightness-slider');
const resolutionSlider = document.getElementById('resolution-slider');
const spacingSlider = document.getElementById('spacing-slider');
const brightnessValue = document.getElementById('brightness-value');
const resolutionValue = document.getElementById('resolution-value');
const spacingValue = document.getElementById('spacing-value');
const processedCanvas = document.getElementById('canvas-processed');

// Canvas contexts
const processedCtx = processedCanvas.getContext('2d');

// Default canvas size
processedCanvas.width = 512;
processedCanvas.height = 512;

// Unicode block levels (darkest to lightest)
const blocks = [
  "\u2588", // Full block
  "\u2589", // 7/8 block
  "\u258A", // 3/4 block
  "\u258B", // 5/8 block
  "\u258C", // 1/2 block
  "\u258D", // 3/8 block
  "\u258E", // 1/4 block
  "\u258F", // 1/8 block
  " "       // Space
];

// Variables to store image and settings
let originalImage = null;

// Initialize value displays
brightnessValue.textContent = brightnessSlider.value;
resolutionValue.textContent = resolutionSlider.value;
spacingValue.textContent = spacingSlider.value;

// Handle file upload button
uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        
        // Resize canvas to match image aspect ratio
        const maxDimension = 1024;
        let w, h;
        
        if (img.width >= img.height) {
          w = maxDimension;
          h = (img.height / img.width) * maxDimension;
        } else {
          h = maxDimension;
          w = (img.width / img.height) * maxDimension;
        }
        
        // Resize processed canvas
        processedCanvas.width = w;
        processedCanvas.height = h;
    
        setTimeout(() => {
            updateAsciiArt();
        }, 300);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Function to update the ASCII art
function updateAsciiArt() {
  if (!originalImage) return;
  
  const brightness = parseFloat(brightnessSlider.value);
  const resolution = parseInt(resolutionSlider.value);
  const spacing = parseFloat(spacingSlider.value);
  
  // Clear the canvas
  processedCtx.fillStyle = '#000000';
  processedCtx.fillRect(0, 0, processedCanvas.width, processedCanvas.height);
  
  // Calculate the number of columns and rows
  const canvasWidth = processedCanvas.width;
  const canvasHeight = processedCanvas.height;
  
  const cols = resolution;
  const rows = Math.floor((cols * canvasHeight) / canvasWidth / 2); // Adjust for character aspect ratio
  
  const cellWidth = canvasWidth / cols;
  const cellHeight = canvasHeight / rows;
  
  // Create a temporary canvas to sample pixels from the original image
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = originalImage.width;
  tempCanvas.height = originalImage.height;
  tempCtx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);
  const imageData = tempCtx.getImageData(0, 0, originalImage.width, originalImage.height);
  const pixels = imageData.data;
  
  // Set font for drawing characters
  processedCtx.font = `${cellWidth * spacing}px monospace`;
  processedCtx.textAlign = 'left';
  processedCtx.textBaseline = 'top';
  processedCtx.fillStyle = '#ffffff';
  
  // Process each cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Sample image at grid position
      const imgX = Math.floor((x / cols) * originalImage.width);
      const imgY = Math.floor((y / rows) * originalImage.height);
      const index = (imgY * originalImage.width + imgX) * 4;
      
      // Calculate brightness
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const pixelBrightness = ((r + g + b) / (3 * 255)) * brightness;
      
      // Map brightness to block character
      const blockIndex = Math.floor((1 - pixelBrightness) * (blocks.length - 1));
      const char = blocks[Math.min(Math.max(blockIndex, 0), blocks.length - 1)];
      
      // Draw character
      processedCtx.fillText(char, x * cellWidth, y * cellHeight);
    }
  }
}

// Handle slider changes
brightnessSlider.addEventListener('input', function() {
  brightnessValue.textContent = this.value;
  if (originalImage) {
      updateAsciiArt();
  }
});

resolutionSlider.addEventListener('input', function() {
  resolutionValue.textContent = this.value;
  if (originalImage) {
      updateAsciiArt();
  }
});

spacingSlider.addEventListener('input', function() {
  spacingValue.textContent = this.value;
  if (originalImage) {
      updateAsciiArt();
  }
});

// Handle save button
saveBtn.addEventListener('click', function() {
  if (!originalImage) return;
  
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.download = 'receipt.png';
  link.href = processedCanvas.toDataURL('image/png');
  link.click();
});

// Handle reset button
resetBtn.addEventListener('click', function() {
  brightnessSlider.value = 1.1;
  resolutionSlider.value = 150;
  spacingSlider.value = 2.1;
  
  brightnessValue.textContent = brightnessSlider.value;
  resolutionValue.textContent = resolutionSlider.value;
  spacingValue.textContent = spacingSlider.value;
  
  
  if (originalImage) {
      updateAsciiArt();
  }
});

// Add retro terminal typing effect to the title
const title = document.querySelector('h1');
const originalText = title.textContent;
title.textContent = "";
let i = 0;

function typeWriter() {
  if (i < originalText.length) {
    title.textContent += originalText.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  } else {
    // Add cursor at the end
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    title.appendChild(cursor);
  }
}

setTimeout(typeWriter, 500);