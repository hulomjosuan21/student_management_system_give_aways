<?php
session_start();
require_once 'db_connect.php';

$pdo = getDatabaseConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        response(400, null, 'Email and password are required.');
    }

    $email = $_POST['email'];
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if (!$user) {
            response(401, null, 'Email not found.');
        }

        if (!$user->is_verified) {
            response(403, null, 'Please verify your email first.');
        }

        if (password_verify($password, $user->user_password)) {
            unset($user->user_password);
            $_SESSION['user'] = $user;

            response(200, $user, 'Login successful!', 'index.html');
        } else {
            response(401, null, 'Incorrect password.');
        }
    } catch (PDOException $e) {
        response(500, null, 'Server error: ' . $e->getMessage());
    }
}
