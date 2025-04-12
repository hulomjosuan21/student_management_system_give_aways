<?php

$server_name = "localhost";
$username = "root";
$password = "";
$database = "studentdb";
$tableName = "students_table";

function response($status, $data, $message, $redirect = false)
{
    header('Content-Type: application/json');

    $response = [
        'status' => $status,
        'data' => $data,
        'message' => $message
    ];

    if ($redirect !== false) {
        $response['redirect'] = $redirect;
    }

    echo json_encode($response);
    exit;
}

function getDatabaseConnection()
{
    global $server_name, $username, $password, $database;

    try {
        $pdo = new PDO("mysql:host={$server_name};dbname={$database}", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        return $pdo;
    } catch (PDOException $e) {
        response(500, null, $e->getMessage());
    }
}