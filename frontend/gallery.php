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
<nav class="top-nav">
        <div class="nav-buttons">
            <a href="welcome.php">Начало</a>
            <a href="./mood_selection.php">Генерирай меме</a>
            <a href="favorites.php">Любими мемета</a>
            <a href="gallery.php">Галерия</a>
            <a href="logout.php">Изход</a>
        </div>
    </nav>
<div class="container">
    <h1>Галерия с Покани</h1>
    <div class="gallery">
        <?php
        for ($i = 1; $i <= 24; $i++) {
            echo '
            <div class="gallery-item">
                <img src="images/' . $i . '.jpg" alt="Меме ' . $i . '" class="gallery-img" onclick="openModal(this.src)">
                <form method="POST" action="add_to_favorites.php" class="heart-form" onsubmit="return toggleFavorite(this, event)">
                    <input type="hidden" name="image" value="images/' . $i . '.jpg">
                    <button type="submit" class="heart-btn"><i class="fa-regular fa-heart"></i></button>
                </form>
            </div>';
        }
        ?>
    </div>

    <a href="welcome.php" class="btn">Назад</a>
</div>

<div class="modal" id="imageModal">
    <span class="close" onclick="closeModal()">×</span>
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

function toggleFavorite(form, event) {
    event.preventDefault(); 
    const heartBtn = form.querySelector('.heart-btn i');
    const imagePath = form.querySelector('input[name="image"]').value;
    const isFavorite = heartBtn.classList.contains('fa-solid');

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isFavorite) {
                heartBtn.classList.remove('fa-solid');
                heartBtn.classList.add('fa-regular');
            } else {
                heartBtn.classList.remove('fa-regular');
                heartBtn.classList.add('fa-solid');
            }
        } else {
            alert('Грешка при актуализация на любими.');
        }
    })
    .catch(error => {
        console.error('Грешка:', error);
        alert('Грешка при свързване със сървъра.');
    });

    return false; 
}

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.heart-form');
    forms.forEach(form => {
        const imagePath = form.querySelector('input[name="image"]').value;
        fetch('check_favorite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'image=' + encodeURIComponent(imagePath)
        })
        .then(response => response.json())
        .then(data => {
            if (data.isFavorite) {
                const heartBtn = form.querySelector('.heart-btn i');
                heartBtn.classList.remove('fa-regular');
                heartBtn.classList.add('fa-solid');
            }
        })
        .catch(error => console.error('Грешка при проверка на любими:', error));
    });
});
</script>