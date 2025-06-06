<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Галерия с Мемета</title>
    <link rel="stylesheet" href="./css/gallery.css">
</head>
<body>
    <div class="container">
        <h1>Галерия с Мемета</h1>
        <div class="gallery">
            <!-- Примерни снимки; заменете с реални пътища или динамично зареждане -->
            <img src="https://via.placeholder.com/300x200?text=Меме+1" alt="Меме 1" class="gallery-img">
            <img src="https://via.placeholder.com/300x200?text=Меме+2" alt="Меме 2" class="gallery-img">
            <img src="https://via.placeholder.com/300x200?text=Меме+3" alt="Меме 3" class="gallery-img">
            <img src="https://via.placeholder.com/300x200?text=Меме+4" alt="Меме 4" class="gallery-img">
            <img src="https://via.placeholder.com/300x200?text=Меме+5" alt="Меме 5" class="gallery-img">
            <img src="https://via.placeholder.com/300x200?text=Меме+6" alt="Меме 6" class="gallery-img">
        </div>
        <!-- <a href="templates/welcome.html" class="btn">Назад</a> -->
        <a href="./welcome.php" class="btn">Назад</a>
    </div>

    <!-- Модален прозорец за увеличаване на снимките -->
    <div class="modal" id="imageModal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>

    <script src="./js/gallery.js"></script>
</body>
</html>