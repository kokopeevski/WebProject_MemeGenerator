<?php
session_start();
require '../backend/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_POST['image'])) {
    echo json_encode(['isFavorite' => false]);
    exit;
}

$pdo = DB::getConnection();
$stmt = $pdo->prepare("SELECT COUNT(*) FROM favorites WHERE user_id = ? AND image_path = ?");
$stmt->execute([$_SESSION['user_id'], $_POST['image']]);
$count = $stmt->fetchColumn();

echo json_encode(['isFavorite' => $count > 0]);
exit;
?>