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

// Receipt header elements
const headerLine1 = document.getElementById('header-line1');
const headerLine2 = document.getElementById('header-line2');
const headerDate = document.getElementById('header-date');

// Canvas contexts
const processedCtx = processedCanvas.getContext('2d');

// Default canvas size
processedCanvas.width = 512;
processedCanvas.height = 512;

// Header height in pixels - space to add at the top of the canvas
const HEADER_HEIGHT = 100;

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

// Set current date in the header date input
function setCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  headerDate.value = `${month}.${day}.${year} ${hours}:${minutes}`;
}

// Load default image on startup
window.addEventListener('DOMContentLoaded', function() {
  setCurrentDate();
  loadDefaultImage();
  
  // Add event listeners for header text inputs
  headerLine1.addEventListener('input', updateAsciiArt);
  headerLine2.addEventListener('input', updateAsciiArt);
  headerDate.addEventListener('input', updateAsciiArt);
});

// Function to load the default image
function loadDefaultImage() {
  const defaultImagePath = 'assets/obama.png';
  
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    
    // Resize canvas to match image aspect ratio plus header space
    const maxDimension = 1024;
    let w, h;
    
    if (img.width >= img.height) {
      w = maxDimension;
      h = (img.height / img.width) * maxDimension;
    } else {
      h = maxDimension;
      w = (img.width / img.height) * maxDimension;
    }
    
    // Resize processed canvas and add header height
    processedCanvas.width = w;
    processedCanvas.height = h + HEADER_HEIGHT;

    // Update ASCII art with a slight delay to ensure canvas is ready
    setTimeout(() => {
        updateAsciiArt();
    }, 300);
  };
  
  img.onerror = () => {
    console.error('Error loading default image:', defaultImagePath);
  };
  
  img.src = defaultImagePath;
}

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
        
        // Resize canvas to match image aspect ratio plus header height
        const maxDimension = 1024;
        let w, h;
        
        if (img.width >= img.height) {
          w = maxDimension;
          h = (img.height / img.width) * maxDimension;
        } else {
          h = maxDimension;
          w = (img.width / img.height) * maxDimension;
        }
        
        // Resize processed canvas and add header height
        processedCanvas.width = w;
        processedCanvas.height = h + HEADER_HEIGHT;
    
        setTimeout(() => {
            updateAsciiArt();
        }, 300);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Function to draw receipt header
function drawReceiptHeader() {
    const canvasWidth = processedCanvas.width;
    
    // Clear the header area
    processedCtx.fillStyle = '#ffffff';
    processedCtx.fillRect(0, 0, canvasWidth, HEADER_HEIGHT);
    
    // Get header text values
    const title = headerLine1.value || "[TITLE]";
    const subtitle = headerLine2.value || "[SUBTITLE]";
    const date = headerDate.value || "";
    
    // Calculate positions
    const leftMargin = 20;
    const rightMargin = canvasWidth - 20;
    const titleY = 40;
    const subtitleY = 70;
  
    // Set consistent text baseline for all text
    processedCtx.textBaseline = 'middle';
    
    // Draw title (top line)
    processedCtx.textAlign = 'left';
    processedCtx.font = 'bold 36px "Courier New", monospace';
    processedCtx.fillStyle = '#000000';
    processedCtx.fillText(title, leftMargin, titleY);
    
    // Draw subtitle (second line - left side)
    processedCtx.textAlign = 'left';
    processedCtx.font = '28px "Courier New", monospace';
    processedCtx.fillText(subtitle, leftMargin, subtitleY);
    
    // Draw date (second line - right side)
    processedCtx.textAlign = 'right';
    processedCtx.fillText(date, rightMargin, subtitleY);
    
    // Draw dotted line at bottom of header
    processedCtx.beginPath();
    processedCtx.setLineDash([5, 5]);
    processedCtx.moveTo(0, HEADER_HEIGHT - 10);
    processedCtx.lineTo(canvasWidth, HEADER_HEIGHT - 10);
    processedCtx.stroke();
    processedCtx.setLineDash([]);
}

// Function to update the ASCII art
function updateAsciiArt() {
  if (!originalImage) return;
  
  const brightness = parseFloat(brightnessSlider.value);
  const resolution = parseInt(resolutionSlider.value);
  const spacing = parseFloat(spacingSlider.value);
  
  // Clear the canvas
  processedCtx.fillStyle = '#ffffff';
  processedCtx.fillRect(0, 0, processedCanvas.width, processedCanvas.height);
  
  // Draw the receipt header
  drawReceiptHeader();
  
  // Calculate the number of columns and rows
  const canvasWidth = processedCanvas.width;
  const canvasHeight = processedCanvas.height - HEADER_HEIGHT; // Adjust for header
  
  const cols = resolution;
  const rows = Math.floor((cols * canvasHeight) / canvasWidth / 2); // Adjust for character aspect ratio
  
  const cellWidth = canvasWidth / cols;
  const cellHeight = canvasHeight / rows;
  
  // Set the black background for the ASCII art area
  processedCtx.fillStyle = '#000000';
  processedCtx.fillRect(0, HEADER_HEIGHT, canvasWidth, canvasHeight);
  
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
      
      // Draw character (offset by header height)
      processedCtx.fillText(char, x * cellWidth, HEADER_HEIGHT + y * cellHeight);
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
  
  // Reset header fields to defaults
  headerLine1.value = "[TITLE]";
  headerLine2.value = "[SUBTITLE]";
  setCurrentDate();
  
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