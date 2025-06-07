<?php
session_start();
require '../backend/db.php'; // пътят до твоя db.php файл

if (!isset($_SESSION['user_id']) || !isset($_POST['image'])) {
    header("Location: gallery.php");
    exit;
}

$pdo = DB::getConnection();
$stmt = $pdo->prepare("INSERT IGNORE INTO favorites (user_id, image_path) VALUES (?, ?)");
$stmt->execute([$_SESSION['user_id'], $_POST['image']]);

header("Location: gallery.php");
exit;
?>