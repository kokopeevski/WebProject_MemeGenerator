<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Галерия с Покани</title>
    <link rel="stylesheet" href="./css/gallery.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<div class="container">
    <h1>Галерия с Покани</h1>
    <div class="gallery">
        <?php
        for ($i = 1; $i <= 21; $i++) {
            echo '
            <div class="gallery-item">
                <img src="images/' . $i . '.jpg" alt="Меме ' . $i . '" class="gallery-img" onclick="openModal(this.src)">
                <form method="POST" action="add_to_favorites.php" class="heart-form">
                    <input type="hidden" name="image" value="images/' . $i . '.jpg">
                    <button type="submit" class="heart-btn"><i class="fa-regular fa-heart"></i></button>
                </form>
            </div>';
        }
        ?>
    </div>

    <a href="welcome.php" class="btn">Назад</a>
</div>

<!-- Модален прозорец за увеличаване на снимките -->
<div class="modal" id="imageModal">
    <span class="close" onclick="closeModal()">&times;</span>
    <img class="modal-content" id="modalImage">
</div>

<script>
function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}
</script>
</body>
</html>