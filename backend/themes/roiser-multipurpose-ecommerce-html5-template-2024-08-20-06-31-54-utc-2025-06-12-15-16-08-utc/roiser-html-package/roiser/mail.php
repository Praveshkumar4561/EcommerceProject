<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $fullname = strip_tags(trim($_POST["fullname"]));
		$fullname = str_replace(array("\r","\n"),array(" "," "),$fullname);
        $phone = strip_tags(trim($_POST["phone"]));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        if ( empty($fullname) OR empty($phone) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "Oops! There was a problem with your submission. Please complete the form and try again.";
            exit;
        }

        $recipient = "contact@yourdomain.com";
		$subject = "Message from $fullname";

        $email_content = "Name: $fullname\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Subject: $subject\n\n";
        $email_content .= "Phone: $phone\n\n";
        $email_content .= "Message: $message\n";

        $email_headers = "From: $fullname <$email>\r\nReply-to: <$email>";

        if (mail($recipient, $subject, $email_content, $email_headers)) {
            http_response_code(200);
            echo "Thank You! Your message has been sent.";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong and we couldn't send your message.";
        }

    } else {
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>