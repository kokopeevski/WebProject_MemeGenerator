<?php
session_start();
require '../backend/db.php'; 

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_POST['image'])) {
    echo json_encode(['success' => false, 'error' => 'Missing data']);
    exit;
}

$pdo = DB::getConnection();
$userId = $_SESSION['user_id'];
$imagePath = $_POST['image'];

$checkStmt = $pdo->prepare("SELECT * FROM favorites WHERE user_id = ? AND image_path = ?");
$checkStmt->execute([$userId, $imagePath]);

if ($checkStmt->rowCount() > 0) {
    $deleteStmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND image_path = ?");
    $deleteStmt->execute([$userId, $imagePath]);
    echo json_encode(['success' => true, 'action' => 'removed']);
} else {
    $insertStmt = $pdo->prepare("INSERT INTO favorites (user_id, image_path) VALUES (?, ?)");
    $insertStmt->execute([$userId, $imagePath]);
    echo json_encode(['success' => true, 'action' => 'added']);
}
exit;
