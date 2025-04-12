<?php
require_once 'db_connect.php';

$pdo = getDatabaseConnection();

$keyword = isset($_POST['keyword']) ? $_POST['keyword'] : '';

try {
    if (!empty($keyword)) {
        $query = "SELECT * FROM {$tableName} 
                  WHERE first_name LIKE ? 
                  OR last_name LIKE ? 
                  OR email LIKE ? 
                  OR course LIKE ?";

        $statement = $pdo->prepare($query);
        $searchTerm = "%$keyword%";
        $statement->execute([$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    } else {
        $query = "SELECT * FROM {$tableName}";
        $statement = $pdo->prepare($query);
        $statement->execute();
    }

    $students = $statement->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($students)) {
        response(200, $students, null);
    } else {
        response(200, [], 'No students found. Showing all records.');
    }
} catch (PDOException $e) {
    response(500, null, $e->getMessage());
}