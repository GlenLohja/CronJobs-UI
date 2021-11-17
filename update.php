<?php 

#################################################################################################### --- ERRORS 

error_reporting(0);

#################################################################################################### --- INCLUDES

require_once  'includes/functions.php';
require_once  'cron-class.php';
require_once  'db_connection.php';

#################################################################################################### --- CHECK IF REQUIRED FIELDS ARE EMPTY

array_map ('trim', $_POST);

$errors = [];

if (isEmpty ($_POST['jobName']) && $_POST['jobName'] != $_POST['previousName']) $errors['jobName'] = true;
if (isEmpty ($_POST['jobName'])) $errors['jobName'] = true;
if (isEmpty ($_POST['command']) && $_POST['command'] != $_POST['previousCommand']) $errors['command'] = true;
if (isEmpty ($_POST['command'])) $errors['command'] = true;
if (isEmpty ($_POST['time']) && $_POST['time'] != $_POST['previousTime']) $errors['time'] = true;
if (isEmpty ($_POST['time'])) $errors['time'] = true;

if ($errors) {

    echo json_encode($errors);
    exit;
}

#################################################################################################### --- CHECK IF NEW NAME EXISTS

if ($_POST['jobName'] != $_POST['previousName']) {

    $query = "SELECT * FROM cron_jobs WHERE cron_name=:cron_name";
    $stm = $dbc->prepare ($query);
    $stm->execute ([
        ':cron_name'=> $_POST['jobName']
    ]);
    
    if ($stm->rowCount() != 0) {
    
        echo json_encode ("error");
        exit;
    }
}

#################################################################################################### --- IF NO ERRORS CONTINUE WITH CRON UPDATE

$cronToBeDeleted = "";

if (!empty($_POST['previousTime'])) {

    $time = $_POST['previousTime'];
    $cronToBeDeleted .= $time . ' ';
}

if (!empty($_POST['previousCommand'])) {

    $command = $_POST['previousCommand'];
    $cronToBeDeleted .= $command . '';
}

if (!empty($_POST['previousName'])) {

    $previousCronName = $_POST['previousName'];
    $gluedName = str_replace(' ', "-", $previousCronName);
    $cronToBeDeleted .= 'name=' . $gluedName . '';
}

if (!empty($_POST['previousFileName'])) {

    $fileName = $_POST['previousFileName'];
}

if (!empty($_POST['previousDescription'])) {

    $description = $_POST['previousDescription'];
}


// cronname filename and description should be updated in database.
$toBeChanged = 0;
$first       = 1;
$array       = [];

// before updating check if previous name exist in table
$query = "SELECT * FROM cron_jobs WHERE cron_name=:cron_name";
$stm = $dbc->prepare ($query);
$stm->execute ([
    ':cron_name'=> $_POST['previousName']
]);

// if name doesnt exist we need to create new column
if ($stm->rowCount() == 0) {

    $addQuery = "
        INSERT INTO cron_jobs (cron_name, cron_description, cron_file_name)
        VALUES (:cron_name, :cron_description, :cron_file_name)
    ";
    $addStatement = $dbc->prepare ($addQuery);
    $addStatement->execute ([
        ':cron_name'=> $_POST['jobName'],
        ':cron_description'=> $_POST['description'],
        ':cron_file_name'=> $_POST['fileName'],
    ]);
} else {
    
    $sql = "UPDATE cron_jobs SET ";
    
    if ($_POST['jobName'] != $_POST['previousName']) {
    
        $sql  .= 'cron_name=:cron_name';
        $first = 0;
        $toBeChanged++;
        $array['cron_name'] = $_POST['jobName'];
    }
    
    if (!isEmpty ($_POST['fileName']) && $_POST['fileName'] != $_POST['previousFileName']) {
        $sql .= ($first===0) ? ', cron_file_name=:cron_file_name' : 'cron_file_name=:cron_file_name'; 
        $array['cron_file_name'] = $_POST['fileName'];
        $toBeChanged++;
    }
    
    if (!isEmpty ($_POST['description']) && $_POST['description'] != $_POST['previousDescription']) {
    
        $sql .= ($first===0) ? ', cron_description=:cron_description' : 'cron_description=:cron_description'; 
        $array['cron_description'] = $_POST['description'];
        $toBeChanged++;
    }
    
    if($toBeChanged > 0) {

        $sql           .= ' WHERE cron_name=:name';
        $array['name']  = $previousCronName;
        $statement      = $dbc->prepare ($sql);
        $statement->execute ($array);
    }
}

$cronName    = $_POST['jobName'];
$newCronName = str_replace(' ', "-", $cronName);
$command     = $_POST['command'];
$time        = $_POST['time'];

$cron     = '' . htmlspecialchars_decode(trim($time)) . ' ' . htmlspecialchars_decode(trim($command)) . ' name=' . htmlspecialchars_decode(trim($newCronName));

Crontab::removeJob (trim($cronToBeDeleted));
Crontab::addJob ($cron);

echo json_encode ('success');