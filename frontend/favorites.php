<?php
session_start();
require '../backend/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$pdo = DB::getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_image'])) {
    $image_path = $_POST['image_path'];
    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND image_path = ?");
    $stmt->execute([$_SESSION['user_id'], $image_path]);
    echo json_encode(['success' => true]);
    exit;
}

$stmt = $pdo->prepare("SELECT image_path FROM favorites WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$images = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <title>Любими Покани</title>
    <link rel="stylesheet" href="./css/gallery.css">
    <style>
        .delete-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: red;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 14px;
            cursor: pointer;
            line-height: 20px;
            text-align: center;
            z-index: 1;
        }
        .delete-btn:hover {
            background: darkred;
        }
        nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 123, 255, 0.85);
            padding: 15px 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }
        nav a {
            color: white;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 15px;
            border-radius: 8px;
            transition: background 0.3s ease, transform 0.2s;
        }
        nav a:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            max-width: 90%;
            max-height: 90%;
        }
        .close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: #ccc;
        }
    </style>
</head>
<body>
<nav class="top-nav">
    <div class="nav-buttons">
        <a href="welcome.php">Начало</a>
        <a href="meme_generator.php">Генерирай меме</a>
        <a href="favorites.php">Любими мемета</a>
        <a href="gallery.php">Галерия</a>
        <a href="logout.php">Изход</a>
    </div>
</nav>
<div class="container">
    <h1>Вашите любими покани</h1>
    <div class="gallery">
        <?php foreach ($images as $img): ?>
            <div class="gallery-item">
                <img src="<?= htmlspecialchars($img['image_path']) ?>" alt="Любимо меме" class="gallery-img" onclick="openModal(this.src)">
                <button class="delete-btn" onclick="deleteFavorite('<?= htmlspecialchars($img['image_path']) ?>')">X</button>
            </div>
        <?php endforeach; ?>
    </div>
    <a href="welcome.php" class="btn">Назад</a>
</div>

<!-- Модален прозорец за увеличаване на снимките -->
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

function deleteFavorite(imagePath) {
    if (confirm('Сигурни ли сте, че искате да премахнете това изображение от любими?')) {
        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'delete_image=1&image_path=' + encodeURIComponent(imagePath)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const item = document.querySelector(`[onclick="deleteFavorite('${imagePath}')"]`).parentElement;
                if (item) item.remove();
            } else {
                alert('Грешка при премахване на изображението.');
            }
        })
        .catch(error => {
            console.error('Грешка:', error);
            alert('Грешка при свързване със сървъра.');
        });
    }
}
</script>
</body>
</html>