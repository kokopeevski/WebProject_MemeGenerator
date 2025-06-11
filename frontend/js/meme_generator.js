document.addEventListener('DOMContentLoaded', () => {
    // Вземаме всички елементи за шаблони и добавяме слушатели за клик
    const templateItems = document.querySelectorAll('.template-item img');
    if (templateItems.length === 0) {
        console.error('Няма намерени .template-item елементи!');
    } else {
        console.log('Намерени', templateItems.length, 'шаблона.');
    }
    templateItems.forEach(img => {
        img.addEventListener('click', () => {
            console.log('Клик върху шаблон:', img.src);
            selectTemplate(img);
        });
    });

    // Проверяваме дали има първоначално зададено настроение от PHP
    if (typeof initialMood !== 'undefined' && initialMood) {
        console.log('Начално настроение от PHP:', initialMood);
        loadDefaultMemeByMood(initialMood);
    } else {
        // Ако няма настроение, показваме стандартния placeholder
        updatePreview();
    }
});

// Референции към DOM елементи
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const textContentInput = document.getElementById('text_content'); // Едно текстово поле за съдържание
const fontSizeInput = document.getElementById('font_size');
const fontFamilySelect = document.getElementById('font_family');
const textColorInput = document.getElementById('text_color');
const addTextButton = document.getElementById('addTextButton');
const deleteTextButton = document.getElementById('deleteTextButton');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');

let selectedImage = null; // Текущото избрано фоново изображение

// Масив, който съдържа всички текстови елементи на мемето
let texts = [];
let selectedTextId = null; // ID на текущо избрания/редактиран текст
let isDragging = false; // Флаг за плъзгане
let dragStartX, dragStartY; // Начални координати на мишката при плъзгане
let initialTextX, initialTextY; // Начални координати на текста при плъзгане

// Дефинираме URL адреси за дефолтни изображения според настроението.
// ВАЖНО: Моля, изтеглете оригиналните изображения и ги поставете
// във вашата папка 'images/default_memes/' (или подобна).
// След това коригирайте пътищата тук, за да сочат към тези локални файлове.
const defaultMemeImages = {
    // Снимка за лошо настроение
    // Пример за локален път: './images/default_memes/bad_mood_meme.jpg'
    bad: './images_generator/sad.jpg',
    // Снимка за добро настроение
    // Пример за локален път: './images/default_memes/good_mood_meme.jpg'
    good: './images_generator/happy.jpg',
    // Снимка за неутрално настроение
    // Пример за локален път: './images/default_memes/neutral_mood_meme.jpg'
    neutral: './images_generator/neutral.jpg'
};

/**
 * Зарежда дефолтно изображение за меме въз основа на избраното настроение.
 * @param {string} mood - Настроението ('good', 'neutral', 'bad').
 */
function loadDefaultMemeByMood(mood) {
    const imageUrl = defaultMemeImages[mood];
    if (imageUrl) {
        document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
        selectedImage = new Image();
        selectedImage.crossOrigin = "Anonymous"; // Зареждане на изображения от други домейни
        selectedImage.src = imageUrl;

        selectedImage.addEventListener('load', () => {
            // Изчистване на текста при зареждане на ново дефолтно меме
            texts = [];
            selectedTextId = null;
            updateTextControls();
            updatePreview();
            downloadButton.style.display = 'block';
            addText(); // Добавяме първи текстов елемент при зареждане на дефолтно меме
        }, { once: true });

        selectedImage.addEventListener('error', (e) => {
            console.error('Грешка при зареждане на дефолтно изображение:', e);
            showMessageBox('Грешка при зареждане на дефолтното меме. Моля, проверете дали снимките са в правилната папка и пътищата са верни.', 'Грешка');
            selectedImage = null;
            updatePreview();
        }, { once: true });
    } else {
        console.warn('Невалидно настроение за дефолтно меме:', mood);
        updatePreview();
    }
}

/**
 * Избира шаблон за меме от страничната лента.
 * @param {HTMLImageElement} img - Елементът <img> на избрания шаблон.
 */
function selectTemplate(img) {
    document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
    img.parentElement.classList.add('selected');

    fileInput.value = '';
    selectedImage = new Image();
    selectedImage.crossOrigin = "Anonymous";
    let imgSrc = img.src;

    if (imgSrc.startsWith('http') && !imgSrc.includes('api.allorigins.win')) {
        imgSrc = `https://api.allorigins.win/raw?url=${encodeURIComponent(imgSrc)}`;
    }

    selectedImage.src = imgSrc;

    selectedImage.addEventListener('load', () => {
        // Изчистване на текста при избор на нов шаблон
        texts = [];
        selectedTextId = null;
        updateTextControls();
        updatePreview();
        downloadButton.style.display = 'block';
        addText(); // Добавяме един текстов елемент по подразбиране
    }, { once: true });

    selectedImage.addEventListener('error', (e) => {
        console.error('Грешка при зареждане на изображението:', e);
        showMessageBox('Грешка при зареждане на шаблона. Моля, изберете друг шаблон.', 'Грешка');
        selectedImage = null;
        updatePreview();
    }, { once: true });
}

/**
 * Обработва качването на персонализиран файл с изображение.
 */
function handleUpload() {
    const file = fileInput.files[0];
    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showMessageBox('Моля, качете файл в JPEG или PNG формат.', 'Грешка');
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
                // Изчистване на текста при качване на нова снимка
                texts = [];
                selectedTextId = null;
                updateTextControls();
                updatePreview();
                downloadButton.style.display = 'block';
                addText(); // Добавяме един текстов елемент по подразбиране
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
        reader.readAsDataURL(file);
    } else {
        updatePreview();
    }
}

/**
 * Добавя нов текстов елемент към масива `texts`.
 */
function addText() {
    if (!selectedImage) {
        showMessageBox('Моля, изберете шаблон или качете снимка, преди да добавите текст.', 'Предупреждение');
        return;
    }
    const newText = {
        id: Date.now(), // Уникален ID за всеки текст
        text: textContentInput.value || 'Нов текст', // Използва текущото съдържание или дефолтно
        x: canvas.width / 2, // Начална позиция в центъра
        y: canvas.height / 2, // Начална позиция в центъра
        fontSize: parseInt(fontSizeInput.value) || 40,
        fontFamily: fontFamilySelect.value || 'Impact',
        color: textColorInput.value || '#FFFFFF',
        // За изчисляване на ширината на текста за плъзгане
        width: 0,
        height: 0,
        actualBoundingBoxAscent: 0, // Използва се за по-точно засичане на клик
        actualBoundingBoxDescent: 0
    };
    texts.push(newText);
    selectedTextId = newText.id; // Автоматично избираме новодобавения текст
    updateTextControls(); // Актуализираме контролите
    updatePreview();
}

/**
 * Изтрива избрания текстов елемент.
 */
function deleteText() {
    if (selectedTextId === null) {
        showMessageBox('Моля, изберете текст за изтриване.', 'Предупреждение');
        return;
    }
    texts = texts.filter(t => t.id !== selectedTextId);
    selectedTextId = null; // Изчистваме избрания текст
    updateTextControls(); // Актуализираме контролите, за да покажат деактивирано състояние
    updatePreview();
}

/**
 * Актуализира Canvas с избраното изображение и всички текстови елементи.
 */
function updatePreview() {
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
        return;
    }

    // Регулираме размерите на Canvas, ако се е променило изображението
    if (canvas.width !== selectedImage.width || canvas.height !== selectedImage.height) {
        canvas.width = selectedImage.width;
        canvas.height = selectedImage.height;
    }
    ctx.drawImage(selectedImage, 0, 0);

    // Рисуваме всеки текстов елемент
    texts.forEach(textObj => {
        ctx.font = `bold ${textObj.fontSize}px ${textObj.fontFamily}`;
        ctx.textAlign = 'center'; // В момента винаги центрираме хоризонтално, може да се разшири
        ctx.fillStyle = textObj.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.floor(textObj.fontSize / 10); // Динамична дебелина на контура
        ctx.lineJoin = 'round';

        // За да можем да плъзгаме текста, трябва да изчислим неговите граници.
        // textBaseline е 'middle' за по-лесно позициониране по средата на текста.
        ctx.textBaseline = 'middle';
        ctx.strokeText(textObj.text, textObj.x, textObj.y);
        ctx.fillText(textObj.text, textObj.x, textObj.y);

        // Изчисляваме ширината и височината на текста за бъдещо засичане на клик
        const metrics = ctx.measureText(textObj.text);
        textObj.width = metrics.width;
        // За по-точно засичане на вертикалните граници
        textObj.actualBoundingBoxAscent = metrics.actualBoundingBoxAscent;
        textObj.actualBoundingBoxDescent = metrics.actualBoundingBoxDescent;
        
        // Рисуваме рамка около избрания текст за визуална обратна връзка
        if (textObj.id === selectedTextId) {
            ctx.strokeStyle = '#00FFFF'; // Цвят на рамката за избрания текст (тюркоаз)
            ctx.lineWidth = 2;
            // Коригираме позицията на рамката спрямо textBaseline='middle'
            const textYOffset = textObj.y - textObj.actualBoundingBoxAscent;
            ctx.strokeRect(
                textObj.x - textObj.width / 2 - 5, // Малко отстъп
                textYOffset - 5,
                textObj.width + 10,
                textObj.actualBoundingBoxAscent + textObj.actualBoundingBoxDescent + 10
            );
        }
    });
}

/**
 * Актуализира контролите за текст (input полета) въз основа на избрания текст.
 */
function updateTextControls() {
    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        textContentInput.value = selectedText.text;
        fontSizeInput.value = selectedText.fontSize;
        fontFamilySelect.value = selectedText.fontFamily;
        textColorInput.value = selectedText.color;
        textContentInput.disabled = false;
        fontSizeInput.disabled = false;
        fontFamilySelect.disabled = false;
        textColorInput.disabled = false;
        deleteTextButton.disabled = false;
    } else {
        textContentInput.value = '';
        fontSizeInput.value = '40'; // Връщаме дефолтна стойност
        fontFamilySelect.value = 'Impact'; // Връщаме дефолтна стойност
        textColorInput.value = '#FFFFFF'; // Връщаме дефолтна стойност
        textContentInput.disabled = true;
        fontSizeInput.disabled = true;
        fontFamilySelect.disabled = true;
        textColorInput.disabled = true;
        deleteTextButton.disabled = true;
    }
}

/**
 * Обработва събитието mousedown върху Canvas за избор и започване на плъзгане на текст.
 * @param {MouseEvent} e - Събитието на мишката.
 */
canvas.addEventListener('mousedown', (e) => {
    // Вземаме координатите на мишката спрямо Canvas
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Проверяваме дали мишката е върху някой текстов елемент
    let foundText = null;
    for (let i = texts.length - 1; i >= 0; i--) { // Обхождаме отзад напред, за да изберем най-горния текст
        const textObj = texts[i];
        // Изчисляваме границите на текста за засичане на клик
        // Вземаме предвид textBaseline = 'middle'
        const textYOffset = textObj.y - textObj.actualBoundingBoxAscent; // Y координата на горния край на текста
        
        if (mouseX >= textObj.x - textObj.width / 2 &&
            mouseX <= textObj.x + textObj.width / 2 &&
            mouseY >= textYOffset && // Използваме изчислената горна граница
            mouseY <= textYOffset + textObj.actualBoundingBoxAscent + textObj.actualBoundingBoxDescent) { // Използваме изчислената долна граница
            
            foundText = textObj;
            break;
        }
    }

    if (foundText) {
        selectedTextId = foundText.id;
        updateTextControls(); // Актуализираме контролите за избрания текст

        isDragging = true;
        canvas.classList.add('dragging'); // Добавяме клас за визуална обратна връзка
        dragStartX = mouseX;
        dragStartY = mouseY;
        initialTextX = foundText.x;
        initialTextY = foundText.y;
    } else {
        selectedTextId = null; // Отменяме избора, ако е кликнато извън текст
        updateTextControls();
    }
    updatePreview(); // Прерисуваме, за да покажем/скрием рамката за избор
});

/**
 * Обработва събитието mousemove върху Canvas за плъзгане на текст.
 * @param {MouseEvent} e - Събитието на мишката.
 */
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || selectedTextId === null) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const dx = mouseX - dragStartX;
    const dy = mouseY - dragStartY;

    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        selectedText.x = initialTextX + dx;
        selectedText.y = initialTextY + dy;
        updatePreview();
    }
});

/**
 * Обработва събитието mouseup върху Canvas за прекратяване на плъзгането.
 */
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.classList.remove('dragging'); // Премахваме класа за визуална обратна връзка
});

/**
 * Обработва събитието mouseleave от Canvas.
 */
canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.classList.remove('dragging');
});

/**
 * Инициира изтеглянето на генерираното меме като PNG изображение.
 */
function downloadMeme() {
    if (!selectedImage) {
        showMessageBox('Моля, изберете шаблон или качете снимка.', 'Предупреждение');
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

/**
 * Създава и показва потребителска кутия за съобщения.
 * @param {string} message - Съобщението за показване.
 * @param {string} title - Заглавието на кутията за съобщения.
 */
function showMessageBox(message, title = 'Съобщение') {
    const overlay = document.createElement('div');
    overlay.className = 'message-box-overlay';

    const messageBox = document.createElement('div');
    messageBox.className = 'custom-message-box';

    const messageTitle = document.createElement('h3');
    messageTitle.textContent = title;
    messageBox.appendChild(messageTitle);

    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageBox.appendChild(messageContent);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Разбрах';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    messageBox.appendChild(closeButton);

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
}

// Слушатели за събития на новите контроли и бутони
textContentInput.addEventListener('input', () => {
    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        selectedText.text = textContentInput.value;
        updatePreview();
    }
});
fontSizeInput.addEventListener('change', () => {
    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        selectedText.fontSize = parseInt(fontSizeInput.value);
        updatePreview();
    }
});
fontFamilySelect.addEventListener('change', () => {
    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        selectedText.fontFamily = fontFamilySelect.value;
        updatePreview();
    }
});
textColorInput.addEventListener('input', () => {
    const selectedText = texts.find(t => t.id === selectedTextId);
    if (selectedText) {
        selectedText.color = textColorInput.value;
        updatePreview();
    }
});

addTextButton.addEventListener('click', addText);
deleteTextButton.addEventListener('click', deleteText);

// Съществуващи слушатели
fileInput.addEventListener('change', handleUpload);
downloadButton.addEventListener('click', downloadMeme);

// Инициализираме контролите при зареждане на страницата
updateTextControls();
