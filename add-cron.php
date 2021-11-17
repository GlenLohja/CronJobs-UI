<?php

#################################################################################################### --- ERRORS 

error_reporting(0);

#################################################################################################### --- INCLUDES

require_once  'includes/functions.php';
require_once  'cron-class.php';
require_once  'db_connection.php';

#################################################################################################### --- AJAX REQUEST, ADD CRON

array_map('trim', $_POST);

#################################################################################################### --- CHECK IF POST name,command and time exist if not send error message.

$errors = [];

if (isEmpty($_POST['jobName'])) $errors['jobName'] = true;
else $cronName = $_POST['jobName'];

if (isEmpty($_POST['command'])) $errors['command'] = true;
else $command = $_POST['command'];

if (isEmpty($_POST['time'])) $errors['time'] = true;
else $time = $_POST['time'];

if ($errors) {
    echo json_encode($errors);
    exit;
}

#################################################################################################### --- CHECK IF NAME EXISTS

$query = "SELECT * FROM cron_jobs WHERE cron_name=:cron_name";
$stm = $dbc->prepare($query);
$stm->execute([
    ':cron_name' => $cronName
]);

if ($stm->rowCount() != 0) {

    echo json_encode("error");
    exit;
}

#################################################################################################### --- IF NO ERRORS PROCEED WITH CRON CREATION

$fileName    = $_POST['fileName'];
$newCronName = str_replace(' ', "-", $cronName);
$description = $_POST['description'];

$sql = "
    INSERT INTO cron_jobs (cron_name, cron_description, cron_file_name) 
    VALUES (:cron_name, :cron_description, :cron_file_name)
";
$statement = $dbc->prepare($sql);
$statement->execute([
    ':cron_name' => $cronName,
    ':cron_description' => $description,
    ':cron_file_name' => $fileName,
]);

$cron = '' . trim($time) . ' ' . trim($command) . ' name=' . trim($newCronName);

Crontab::addJob($cron);

echo json_encode('success');

