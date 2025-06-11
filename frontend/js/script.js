document.addEventListener('DOMContentLoaded', () => {
    // Избираме всички елементи с клас 'template-item img' (изображения на шаблони)
    const templateItems = document.querySelectorAll('.template-item img');

    // Проверяваме дали има намерени шаблони и извеждаме съобщение в конзолата
    if (templateItems.length === 0) {
        console.error('Няма намерени .template-item елементи!');
    } else {
        console.log('Намерени', templateItems.length, 'шаблона.');
    }

    // Добавяме слушател за събитие 'click' към всеки шаблон
    templateItems.forEach(img => {
        img.addEventListener('click', () => {
            console.log('Клик върху шаблон:', img.src);
            selectTemplate(img); // Извикваме функцията за избор на шаблон
        });
    });

    // Проверяваме за избрано настроение от предишната страница (mood_selection.html)
    const storedMood = sessionStorage.getItem('selectedMood');
    if (storedMood) {
        console.log('Открито настроение:', storedMood);
        loadDefaultMemeByMood(storedMood); // Зареждаме дефолтно меме според настроението
        sessionStorage.removeItem('selectedMood'); // Изчистваме настроението от sessionStorage, за да не се зарежда постоянно
    } else {
        updatePreview(); // Ако няма избрано настроение, показваме сивия placeholder
    }
});

// Вземаме референции към елементите на HTML Canvas и input полетата
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d'); // Вземаме 2D контекст за рисуване върху Canvas
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');

let selectedImage = null; // Променлива, която ще съхранява текущото избрано изображение (шаблон или качено)

// Обект, който съпоставя настроения с URL адреси на дефолтни изображения
const defaultMemeImages = {
    good: 'https://placehold.co/600x400/0077aa/ffffff?text=Щастливо+меме%0A:)&font=impact', // Примерно щастливо меме
    neutral: 'https://placehold.co/600x400/87CEEB/000000?text=Неутрално+меме%0A:|&font=impact', // Примерно неутрално меме
    bad: 'https://placehold.co/600x400/FF6347/FFFFFF?text=Тъжно+меме%0A:((&font=impact' // Примерно тъжно меме
};

/**
 * Зарежда дефолтно изображение за меме въз основа на избраното настроение.
 * @param {string} mood - Настроението ('good', 'neutral', 'bad').
 */
function loadDefaultMemeByMood(mood) {
    const imageUrl = defaultMemeImages[mood]; // Вземаме URL адреса на изображението според настроението
    if (imageUrl) {
        // Премахваме класа 'selected' от всички елементи с шаблони, тъй като зареждаме дефолтно изображение
        document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));

        selectedImage = new Image(); // Създаваме нов обект Image
        selectedImage.crossOrigin = "Anonymous"; // Важно за зареждане на изображения от различни домейни
        selectedImage.src = imageUrl; // Задаваме URL на изображението

        selectedImage.addEventListener('load', () => {
            updatePreview(); // Актуализираме Canvas с новото изображение
            downloadButton.style.display = 'block'; // Показваме бутона за изтегляне
        }, { once: true }); // Слушателят ще се изпълни само веднъж

        selectedImage.addEventListener('error', (e) => {
            console.error('Грешка при зареждане на дефолтно изображение:', e);
            // При грешка, връщаме Canvas в начално състояние (без изображение)
            selectedImage = null;
            updatePreview();
        }, { once: true });
    } else {
        console.warn('Невалидно настроение за дефолтно меме:', mood);
        updatePreview(); // Ако настроението е невалидно, показваме сивия placeholder
    }
}

/**
 * Обработва избора на шаблон за меме от страничната лента.
 * @param {HTMLImageElement} img - Елементът <img> на избрания шаблон.
 */
function selectTemplate(img) {
    // Премахваме класа 'selected' от всички елементи с шаблони
    document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
    // Добавяме класа 'selected' към родителския елемент на кликнатото изображение
    img.parentElement.classList.add('selected');

    fileInput.value = ''; // Изчистваме предишно избран файл, ако има такъв

    selectedImage = new Image();
    selectedImage.crossOrigin = "Anonymous"; // Активираме зареждане от различни домейни

    let imgSrc = img.src;
    // Използваме прокси за изображения от различни домейни, ако не са вече проксирани
    if (imgSrc.startsWith('http') && !imgSrc.includes('api.allorigins.win')) {
        imgSrc = `https://api.allorigins.win/raw?url=${encodeURIComponent(imgSrc)}`;
    }
    selectedImage.src = imgSrc;

    selectedImage.addEventListener('load', () => {
        updatePreview(); // Прерисуваме Canvas с новото изображение
        downloadButton.style.display = 'block'; // Уверяваме се, че бутонът за изтегляне е видим
    }, { once: true });

    selectedImage.addEventListener('error', (e) => {
        console.error('Грешка при зареждане на изображението:', e);
        // Използваме потребителска кутия за съобщения вместо alert()
        showMessageBox('Грешка при зареждане на шаблона. Моля, изберете друг шаблон.', 'Грешка');
        selectedImage = null;
        updatePreview();
    }, { once: true });
}

/**
 * Обработва качването на персонализиран файл с изображение.
 */
function handleUpload() {
    const file = fileInput.files[0]; // Вземаме първия избран файл
    if (file) {
        // Проверяваме типа на файла
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showMessageBox('Моля, качете файл в JPEG или PNG формат.', 'Грешка');
            fileInput.value = '';
            updatePreview();
            return;
        }

        const reader = new FileReader(); // Създаваме FileReader обект
        reader.onload = function(e) {
            selectedImage = new Image();
            selectedImage.src = e.target.result; // Задаваме src на изображението като data URL
            selectedImage.addEventListener('load', () => {
                // Премахваме класа 'selected' от всички елементи с шаблони при качване на файл
                document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
                updatePreview();
                downloadButton.style.display = 'block';
            }, { once: true });

            selectedImage.addEventListener('error', () => {
                showMessageBox('Грешка при четене на файла. Моля, опитайте отново.', 'Грешка');
                fileInput.value = '';
                updatePreview();
            }, { once: true });
        };
        reader.onerror = function() {
            showMessageBox('Грешка при четене на файла. Моля, опитайте отново.', 'Грешка');
            fileInput.value = '';
            updatePreview();
        };
        reader.readAsDataURL(file); // Прочитаме файла като data URL
    } else {
        updatePreview();
    }
}

/**
 * Актуализира Canvas с избраното изображение и текущите текстови полета.
 */
function updatePreview() {
    const topText = topTextInput.value.toUpperCase(); // Вземаме горния текст и го правим с главни букви
    const bottomText = bottomTextInput.value.toUpperCase(); // Вземаме долния текст и го правим с главни букви

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Изчистваме целия Canvas

    // Ако няма избрано изображение, показваме placeholder съобщение
    if (!selectedImage) {
        canvas.width = 500;
        canvas.height = 500;
        ctx.fillStyle = '#ccc'; // Сив фон
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000'; // Черен текст
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Избери шаблон или качи снимка', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Задаваме размерите на Canvas да съответстват на изображението
    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;
    ctx.drawImage(selectedImage, 0, 0); // Рисуваме избраното изображение

    // Изчисляваме размера на шрифта динамично за адаптивност
    const fontSize = Math.floor(canvas.width / 10);
    const yOffset = canvas.height / 25; // Вертикален отстъп за текста

    // Задаваме стилове на текста
    ctx.font = `bold ${fontSize}px Impact, Arial`; // Шрифт Impact е често срещан за мемета
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 4); // Дебелина на контура
    ctx.lineJoin = 'round'; // Заоблени ъгли на контура

    /**
     * Рисува текст върху Canvas с контур и запълване.
     * @param {string} text - Текстът за рисуване.
     * @param {number} x - X-координата за текста.
     * @param {number} y - Y-координата за текста.
     * @param {string} baseline - Базова линия на текста ('top' или 'bottom').
     */
    function drawText(text, x, y, baseline) {
        if (text) {
            ctx.textBaseline = baseline;
            ctx.strokeText(text, x, y); // Рисува контура на текста
            ctx.fillText(text, x, y);   // Рисува запълването на текста
        }
    }

    // Рисуваме горния и долния текст
    drawText(topText, canvas.width / 2, yOffset, 'top');
    drawText(bottomText, canvas.width / 2, canvas.height - yOffset, 'bottom');
}

/**
 * Инициира изтеглянето на генерираното меме като PNG изображение.
 */
function downloadMeme() {
    if (!selectedImage) {
        showMessageBox('Моля, изберете шаблон или качете снимка.', 'Предупреждение');
        return;
    }

    // Преобразуваме съдържанието на Canvas в data URL (PNG формат)
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a'); // Създаваме временен елемент <a>
    link.href = dataUrl; // Задаваме href на връзката като data URL
    link.download = `meme_${Date.now()}.png`; // Задаваме име на файла за изтегляне
    document.body.appendChild(link); // Добавяме връзката към тялото на документа
    link.click(); // Програмно кликаме върху връзката, за да инициираме изтеглянето
    document.body.removeChild(link); // Премахваме елемента <a>
}

/**
 * Създава и показва потребителска кутия за съобщения.
 * @param {string} message - Съобщението за показване.
 * @param {string} title - Заглавието на кутията за съобщения.
 */
function showMessageBox(message, title = 'Съобщение') {
    // Създаване на овърлей, който затъмнява фона
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    // Създаване на самата кутия за съобщения
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        text-align: center;
        color: #333;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // Добавяне на заглавие към кутията
    const messageTitle = document.createElement('h3');
    messageTitle.textContent = title;
    messageTitle.style.cssText = `
        margin-top: 0;
        color: #0077aa;
        font-size: 1.5rem;
    `;
    messageBox.appendChild(messageTitle);

    // Добавяне на съдържанието на съобщението
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageContent.style.cssText = `
        margin-bottom: 20px;
        font-size: 1.1rem;
        line-height: 1.5;
    `;
    messageBox.appendChild(messageContent);

    // Добавяне на бутон за затваряне
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Разбрах';
    closeButton.style.cssText = `
        padding: 10px 20px;
        background-color: #0077aa;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.3s ease;
    `;
    // Добавяне на hover ефекти за бутона
    closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#005f88');
    closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#0077aa');
    // При клик върху бутона, премахваме овърлея
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    messageBox.appendChild(closeButton);

    // Добавяме кутията за съобщения към овърлея и овърлея към тялото на документа
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
}

// Добавяме слушатели за събития за промени в текстовите полета и кликове на бутони
topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);
fileInput.addEventListener('change', handleUpload);
downloadButton.addEventListener('click', downloadMeme);
