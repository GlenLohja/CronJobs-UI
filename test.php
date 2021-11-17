<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'cron-class.php';

$jobs = Crontab::getJobs ();

for ($i=0; $i < count ($jobs); $i++) {

    $strArray = explode (" ", $jobs[$i]);
    
    if ($strArray[0][0] === '@') {

        $rows[$i]['disabled'] = false;

        $time     = timeAsString ($strArray[0]);
        $cronTime = $strArray[0];
        $indx     = 1;

    } else if ($strArray[0][0] == '#') {

        if ($strArray[0][1] === "@") {
            $cronTime = substr ($strArray[0], 1);
            $time = timeAsString ($cronTime);
            $indx = 1;
        } else if ($strArray[0][1] != 'null') {

            $cronTime = substr($strArray[0], 1);
            $cronTime .= " " . implode(" ", array_slice ($strArray, 1, 4));
            $toString = CronSchedule::fromCronString ($cronTime);
            $time = $toString->asNaturalLanguage();
            $indx = 5;
        } else {
            $cronTime = implode(" ", array_slice ($strArray,1,5));
            $toString = CronSchedule::fromCronString ($cronTime);
            $time = $toString->asNaturalLanguage();
            $indx = 6;
        }

        $rows[$i]['disabled'] = true;
    } else {

        $rows[$i]['disabled'] = false;
        $cronTime = implode (" ", array_slice ($strArray,0,5));
        $toString = CronSchedule::fromCronString ($cronTime);
        $time = $toString->asNaturalLanguage();
        $indx = 5;
    }

    $rows[$i]['cronTime'] = $cronTime;
    $rows[$i]['time']     = $time;
    $commands             = "";

    for($j=$indx; $j < count ($strArray); $j++) {

        if (substr ($strArray[$j], 0, 5) === 'name=') {

            $name         = str_replace ("-"," ", substr ($strArray[$j], 5, strlen ($strArray[$j])));
            $description  = $dbData[$name]['cron_description'];
            $cronFileName = $dbData[$name]['cron_file_name'];
            $start_time   = $dbData[$name]['start_time'];
            $end_time     = $dbData[$name]['end_time'];

            $rows[$i]['description'] = $description;
            $rows[$i]['cron_name']   = $name;
            $rows[$i]['file_name']   = $cronFileName;
            $rows[$i]['start_time']  = $start_time;
            $rows[$i]['end_time']    = $end_time;

        } else {
            $rows[$i]['cron_name']   = '';
            $rows[$i]['description'] = '';
            $rows[$i]['file_name']   = '';
            $rows[$i]['start_time']  = '';
            $rows[$i]['end_time']    = '';
            $commands .= $strArray[$j] . ' ';
        }
    }
    $rows[$i]['command'] = $commands;
}

$output['data'] = $rows;

print_r($output);