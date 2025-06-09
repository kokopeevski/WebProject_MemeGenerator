<?php
session_start();
require '../backend/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$pdo = DB::getConnection();
$stmt = $pdo->query("SELECT * FROM templates WHERE is_public = 1");
$templates = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Генератор на мемета</title>
    <link rel="stylesheet" href="./css/meme_generator.css">
</head>
<body>
<nav class="top-nav">
    <div class="nav-buttons">
        <a href="./welcome.php">Начало</a>
        <a href="./meme_generator.php">Генерирай меме</a>
        <a href="./favorites.php">Любими мемета</a>
        <a href="./gallery.php">Галерия</a>
        <a href="./logout.php">Изход</a>
    </div>
</nav>

<div class="container">
    <aside class="sidebar">
        <h2>Избери шаблон</h2>
        <div class="templates">
            <?php foreach ($templates as $template): ?>
                <div class="template-item" data-template="<?= htmlspecialchars($template['image_url']) ?>">
                    <img src="<?= htmlspecialchars($template['image_url']) ?>" alt="<?= htmlspecialchars($template['name']) ?>">
                </div>
            <?php endforeach; ?>
        </div>
    </aside>

    <main class="main-content">
        <h1>Създай своето меме</h1>
        <div class="upload-section">
            <label for="upload">Качи своя снимка:</label>
            <input type="file" id="upload" accept="image/*">
        </div>
        <div class="meme-form">
            <label for="top_text">Горен текст:</label>
            <input type="text" id="top_text" placeholder="Въведи горен текст">
            <label for="bottom_text">Долен текст:</label>
            <input type="text" id="bottom_text" placeholder="Въведи долен текст">
            <canvas id="memeCanvas"></canvas>
            <button id="downloadButton">Изтегли меме</button>
        </div>
    </main>
</div>

<script src="./js/meme_generator.js"></script>
<script src="./js/meme_nav.js"></script>
</body>
</html>



