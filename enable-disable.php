<?php 

#################################################################################################### --- ERRORS 

error_reporting(0);

#################################################################################################### --- INCLUDES

require_once  'includes/functions.php';
require_once  'cron-class.php';
require_once  'db_connection.php';

#################################################################################################### --- AJAX REQUEST, ENABLE OR DISABLE CRON

array_map ('trim', $_POST);

$disable = $_POST['disabled'];

if ($disable === "true") {
    
    $cronToBeDeleted = "#";
    $editedCron      = '';

} else {

    $cronToBeDeleted = '';
    $editedCron      = "#";
}

if (!empty($_POST['time'])) {

    $time = $_POST['time'];
    $cronToBeDeleted .= $time . ' ';
    $editedCron      .= $time . ' ';
}

if (!empty($_POST['command'])) {

    $command = $_POST['command'];
    $cronToBeDeleted .= $command . '';
    $editedCron      .= $command . '';
}

if (!empty($_POST['jobName'])) {

    $cronName         = $_POST['jobName'];
    $gluedName        = str_replace(' ', "-", $cronName);
    $cronToBeDeleted .= 'name=' . $gluedName . '';
    $editedCron      .= 'name=' . $gluedName . '';
}

Crontab::removeJob (trim ($cronToBeDeleted));
Crontab::addJob (trim ($editedCron));

echo json_encode ($disable);