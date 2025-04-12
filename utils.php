<?php

require_once 'db_connect.php';

$uploadDir = "./profiles/";

function uploadProfileImage()
{
    global $uploadDir;

    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['profile_image']['tmp_name'];
        $fileName = basename($_FILES['profile_image']['name']);
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($fileExtension, $allowedExtensions)) {
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $profileName = uniqid() . "." . $fileExtension;
            $destination = $uploadDir . $profileName;

            if (move_uploaded_file($fileTmpPath, $destination)) {
                return $profileName;
            } else {
                response(500, null, 'Failed to save uploaded image.');
                return null;
            }
        } else {
            response(400, null, 'Invalid file format. Allowed formats: JPG, JPEG, PNG, GIF.');
            return null;
        }
    }
    return null;
}
