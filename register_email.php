<?php

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function registerEmail($email, $encryptedUserId, $verification_code)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = "smtp.gmail.com";
        $mail->SMTPAuth = true;
        $mail->Username = "hulomjosuanleonardo@gmail.com";
        $mail->Password = "xxzr ktwt dstj ugtx";
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('no-reply@email.com', 'School Verification');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Verify Your Email Address';

        $verificationLink = "http://localhost/student_management_system/verify.html?user_id=" . $encryptedUserId . "&code=" . $verification_code;

        $mail->Body = "
            <h2>Thank you for registering!</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href='{$verificationLink}'>Verify Email</a>
            <br><br>
            <p>If you did not request this, please ignore this email.</p>
        ";

        $mail->send();
    } catch (Exception $e) {
        throw new Exception("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    }
}
