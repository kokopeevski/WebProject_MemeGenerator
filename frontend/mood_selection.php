<?php
session_start();
require '../backend/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Избери настроение</title>
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
    <div class="mood-container">
        <h1>В какво настроение си днес?</h1>
        <div class="mood-buttons">
            <button class="mood-button" onclick="selectMood('good')">Добро настроение</button>
            <button class="mood-button" onclick="selectMood('neutral')">Неутрално</button>
            <button class="mood-button" onclick="selectMood('bad')">Лошо настроение</button>
        </div>
    </div>

    <script>
        function selectMood(mood) {
            window.location.href = `meme_generator.php?mood=${mood}`;
        }
    </script>
</body>
</html>
