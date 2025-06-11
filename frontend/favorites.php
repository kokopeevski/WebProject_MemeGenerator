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
    <link rel="stylesheet" href="./css/favorite.css">
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
    <h1>Вашите любими покани</h1>
    <div class="gallery">
    <?php foreach ($images as $img): ?>
        <div class="gallery-item">
            <img src="<?php echo htmlspecialchars($img['image_path']); ?>" alt="Любимо меме" class="gallery-img" onclick="openModal(this.src)">
            <button class="delete-btn" onclick="deleteFavorite('<?php echo htmlspecialchars($img['image_path'], ENT_QUOTES); ?>')">X</button>
        </div>
    <?php endforeach; ?>
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
