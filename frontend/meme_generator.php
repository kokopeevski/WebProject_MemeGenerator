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

$selectedMood = isset($_GET['mood']) ? htmlspecialchars($_GET['mood']) : '';
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
        <a href="./mood_selection.php">Генерирай меме</a>
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
            <label for="text_content">Текст:</label>
            <textarea id="text_content" placeholder="Въведи текст тук"></textarea>

            <div class="text-controls">
                <div>
                    <label for="font_size">Размер:</label>
                    <input type="number" id="font_size" value="40" min="10" max="200">
                </div>
                <div>
                    <label for="font_family">Шрифт:</label>
                    <select id="font_family">
                        <option value="Impact">Impact</option>
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>
                </div>
                <div>
                    <label for="text_color">Цвят:</label>
                    <input type="color" id="text_color" value="#FFFFFF">
                </div>
            </div>

            <div class="text-action-buttons">
                <button id="addTextButton">Добави текст</button>
                <button id="deleteTextButton">Изтрий избран текст</button>
            </div>

            <canvas id="memeCanvas"></canvas>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                <button id="downloadButton">Изтегли меме</button>
                <a href="https://www.facebook.com/groups/2210393822690424/" target="_blank" class="facebook-button">Качи меме/покана чрез Facebook</a>
            </div>
        </div>
    </main>
</div>

<script>
    const initialMood = '<?= $selectedMood ?>';
</script>
<script src="./js/meme_generator.js"></script>
</body>
</html>
