document.addEventListener('DOMContentLoaded', () => {
    updatePreview(); // Initial canvas setup
});

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');
let selectedImage = null;

function selectTemplate(element) {
    document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    selectedImage = new Image();
    selectedImage.src = element.querySelector('img').src;
    selectedImage.addEventListener('load', () => {
        updatePreview();
        downloadButton.style.display = 'block';
    }, { once: true });
    selectedImage.addEventListener('error', () => {
        alert('Грешка при зареждане на шаблона. Моля, проверете дали изображението съществува.');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Грешка при зареждане на изображението', canvas.width / 2, canvas.height / 2);
        downloadButton.style.display = 'none';
        selectedImage = null;
    }, { once: true });
}

function handleUpload() {
    const file = fileInput.files[0];
    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Моля, качете файл в JPEG или PNG формат.');
            fileInput.value = '';
            updatePreview();
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = new Image();
            selectedImage.src = e.target.result;
            selectedImage.addEventListener('load', () => {
                document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
                updatePreview();
                downloadButton.style.display = 'block';
            }, { once: true });
            selectedImage.addEventListener('error', () => {
                alert('Грешка при четене на файла. Моля, опитайте отново.');
                fileInput.value = '';
                updatePreview();
            }, { once: true });
        };
        reader.onerror = function() {
            alert('Грешка при четене на файла. Моля, опитайте отново.');
            fileInput.value = '';
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

function updatePreview() {
    const topText = topTextInput.value.toUpperCase();
    const bottomText = bottomTextInput.value.toUpperCase();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!selectedImage) {
        canvas.width = 500;
        canvas.height = 500;
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Избери шаблон или качи снимка', canvas.width / 2, canvas.height / 2);
        downloadButton.style.display = 'none';
        return;
    }

    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;
    ctx.drawImage(selectedImage, 0, 0);

    const fontSize = Math.floor(canvas.width / 10);
    const yOffset = canvas.height / 25;

    ctx.font = `bold ${fontSize}px Impact, Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.lineJoin = 'round';

    function drawText(text, x, y, baseline) {
        if (text) {
            ctx.textBaseline = baseline;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
    }

    drawText(topText, canvas.width / 2, yOffset, 'top');
    drawText(bottomText, canvas.width / 2, canvas.height - yOffset, 'bottom');
}

function downloadMeme() {
    if (!selectedImage) {
        alert('Моля, изберете шаблон или качете снимка.');
        return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `meme_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);
fileInput.addEventListener('change', handleUpload);
downloadButton.addEventListener('click', downloadMeme);