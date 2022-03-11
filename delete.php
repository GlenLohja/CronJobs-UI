<?php 

#################################################################################################### --- ERRORS 

error_reporting(0);

#################################################################################################### --- INCLUDES

require_once  'includes/functions.php';
require_once  'cron-class.php';
require_once  'db_connection.php';

#################################################################################################### --- AJAX REQUEST, DELETE CRON

$cronToBeDeleted = "";

if (!empty($_POST['time'])) {

    $time = htmlspecialchars_decode($_POST['time']);
    $cronToBeDeleted .= $time . ' ';
}

if (!empty($_POST['command'])) {

    $command = htmlspecialchars_decode($_POST['command']);
    $cronToBeDeleted .= $command . '';
}

if (!empty($_POST['jobName'])) {

    $cronName = htmlspecialchars_decode($_POST['jobName']);
    $gluedName = str_replace(' ', "-", $cronName);
    $cronToBeDeleted .= 'name=' . $gluedName . '';

    // if cron job name exist also delete the data stored in database.
    $sql = "DELETE FROM cron_jobs WHERE cron_name=:cron_name";
    $statement = $dbc->prepare($sql);
    $statement->execute([':cron_name' => $cronName]);
}

Crontab::removeJob(trim($cronToBeDeleted));

echo json_encode($cronToBeDeleted);
