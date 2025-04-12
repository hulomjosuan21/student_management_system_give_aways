<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user'])) {
    echo json_encode([
        'status' => 200,
        'user' => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        'status' => 401,
        'message' => 'User is not logged in.'
    ]);
}
