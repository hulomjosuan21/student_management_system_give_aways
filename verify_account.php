<?php

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $code = $_POST['code'];

    if (empty($user_id) || empty($code)) {
        echo json_encode(['status' => 500, 'message' => 'Invalid parameters.']);
        exit;
    }

    $user_id = base64_decode($user_id);

    $pdo = getDatabaseConnection();

    try {
        $query = "SELECT * FROM " . $tableName . " WHERE student_id = ? AND verification_code = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$user_id, $code]);

        if ($stmt->rowCount() > 0) {
            $updateQuery = "UPDATE students_table SET is_verified = 1 WHERE student_id = ?";
            $stmt = $pdo->prepare($updateQuery);
            $stmt->execute([$user_id]);

            response(200, null, 'Account successfully verified.');
        } else {
            response(500, null, 'Invalid verification code or user ID.');
        }
    } catch (PDOException $e) {
        response(500, null, $e->getMessage());
    }
}
