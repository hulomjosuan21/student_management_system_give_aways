<?php

require_once 'db_connect.php';
require_once 'utils.php';

$pdo = getDatabaseConnection();

$student_id = $_POST['student_id'] ?? null;
$first_name = $_POST['first_name'] ?? null;
$last_name = $_POST['last_name'] ?? null;
$phone_number = $_POST['phone_number'] ?? null;
$gender = $_POST['gender'] ?? null;
$course = $_POST['course'] ?? null;
$user_address = $_POST['user_address'] ?? null;
$birthdate = $_POST['birthdate'] ?? null;

if (!$student_id) {
    response(400, null, 'Student ID is required.');
    return;
}

$profileName = uploadProfileImage();

if ($profileName) {
    $query = "UPDATE {$tableName} 
              SET first_name=?, last_name=?, phone_number=?, 
                  gender=?, course=?, user_address=?, birthdate=?, profile_url=? 
              WHERE student_id=?";
    $params = [
        $first_name,
        $last_name,
        $phone_number,
        $gender,
        $course,
        $user_address,
        $birthdate,
        $profileName,
        $student_id
    ];
} else {
    $query = "UPDATE {$tableName} 
              SET first_name=?, last_name=?, phone_number=?, 
                  gender=?, course=?, user_address=?, birthdate=? 
              WHERE student_id=?";
    $params = [
        $first_name,
        $last_name,
        $phone_number,
        $gender,
        $course,
        $user_address,
        $birthdate,
        $student_id
    ];
}

$statement = $pdo->prepare($query);
$statement->execute($params);

if ($statement->rowCount() > 0) {
    response(200, null, 'Student updated successfully! You will be logged out to see changes.');
} else {
    response(404, null, 'No changes made.');
}