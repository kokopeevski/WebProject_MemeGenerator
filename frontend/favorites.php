<?php
session_start();
require '../backend/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$pdo = DB::getConnection();
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
</head>
<body>
<div class="container">
    <h1>Вашите любими покани</h1>
    <div class="gallery">
        <?php foreach ($images as $img): ?>
            <div class="gallery-item">
                <img src="<?= htmlspecialchars($img['image_path']) ?>" alt="Любимо меме" class="gallery-img">
            </div>
        <?php endforeach; ?>
    </div>
    <a href="welcome.php" class="btn">Назад</a>
</div>
</body>
</html>