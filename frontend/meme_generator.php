<?php
require '../backend/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Redirect to the HTML page in frontend/templates/
header("Location: templates/meme_generator.html");
exit;
?>