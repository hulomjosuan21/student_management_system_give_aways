<?php

require_once 'db_connect.php';
require_once 'utils.php';
require_once 'register_email.php';

$pdo = getDatabaseConnection();

function register_student()
{
    global $pdo, $tableName;
    try {
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $email = $_POST['email'];
        $user_password = password_hash($_POST['user_password'], PASSWORD_BCRYPT);
        $phone_number = $_POST['phone_number'];
        $gender = $_POST['gender'];
        $course = $_POST['course'];
        $bday = $_POST['birthdate'];
        $address = $_POST['address'];
        $verification_code = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $profileName = uploadProfileImage();

        $query = "INSERT INTO " . $tableName . " 
            (first_name, last_name, email, user_password, phone_number, gender, course, birthdate, user_address, profile_url, verification_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $statement = $pdo->prepare($query);
        $statement->execute([
            $first_name,
            $last_name,
            $email,
            $user_password,
            $phone_number,
            $gender,
            $course,
            $bday,
            $address,
            $profileName,
            $verification_code
        ]);

        if ($statement->rowCount() > 0) {
            $lastInsertedId = $pdo->lastInsertId();
            $encryptedUserId = base64_encode($lastInsertedId);
            registerEmail($email, $encryptedUserId, $verification_code);
            $encryptedUserId = base64_encode($lastInsertedId);
            response(200, null, 'Student added successfully! Please check your email to verify your account.', "verify.html?user_id=" . urlencode($encryptedUserId));
        } else {
            $errorInfo = $statement->errorInfo();
            response(500, null, 'Failed to add student: ' . $errorInfo[2]);
        }
    } catch (PDOException $e) {
        response(500, null, $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    register_student();
}
