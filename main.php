<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


include ('includes/header.html');

?>

<button type="button" id="showInfo" class="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#infoModal">
</button>
<!-- Modal -->
<div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="infoModalLabel" style="color:red;">Error</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="tempData" class="hidden"></div>
            <div class="modal-body">
                You Cannot Delete Or Edit A Disabled Cron Job. Please Enable And Proceed Again!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" id="closeInfoBtn" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


<!-- Button trigger modal -->
<button type="button" id="delete-cron" class="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#deleteModal">
</button>
<!-- Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModalLabel">Delete Cron Job</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="tempData" class="hidden"></div>
      <div class="modal-body">
        Are you sure you want to delete this?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-light" id="closeDelBtn" data-bs-dismiss="modal">Close</button>
        <button type="button" onclick="deleteCron()" class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>

<div class="d-flex justify-content-between pageHeader">
    <button type="button" id="edit-cron" class="btn btn-primary col-md-1 hidden" data-bs-toggle="modal" data-bs-target="#edit">
        <i class="fas fa-plus"></i> Edit Cron
    </button>
</div>

<!-- Modal -->
<div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editLabel">Edit Cron Job</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body edit-modal-body">
                    
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" id="closeEditBtn" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="saveCron(false)">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
<div class="container">
    <div class="alert alert-info alert-dismissible fade show hidden jobCreated mt-4" role="alert">
        <strong>Cron Job</strong> Has Been Saved.
        <hr>
        <p class="mb-0">If you dont see the cron you just created/edited, something went wrong. Possibly a syntax error in the cron you were trying to create.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <div class="alert alert-success alert-dismissible fade show hidden jobDeleted mt-4" role="alert">
        <strong>Cron Job</strong> Has Been Deleted.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <!-- <div class="alert alert-success alert-dismissible fade show hidden scriptRun mt-4" role="alert">
        Script Ran Successfully.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div> -->

    <div class="d-flex justify-content-between pageHeader">
        <h1 class="cronTableTitle">Cron Table</h1>
        <button type="button" id="add-cron" class="btn btn-primary col-md-1" data-bs-toggle="modal" onclick="clearForm()" data-bs-target="#exampleModal">
            <i class="fas fa-plus"></i> Add Job
        </button>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add Cron Job</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <label for="addJobName">Cron Job Name<span class="requiredInput">*</span></label>
            <input class="form-control job-value" type="text">
            <div class="form-text hidden duplicateName">The cron name you provided already exists.</div>
            <div class="form-text invalidInputName hidden">
                Please enter a cron job name.
            </div>
            <label for="fileName" class="mt-4">File Name</label>
            <input class="form-control file-name-value" id="fileName" placeholder="index.php"type="text">
            <label class="mt-4" for="description">Description</label>
            <textarea class="form-control description-value" placeholder="Short description of what this cron job does" id="description" rows="2"></textarea>
            <label class="mt-4" for="commandInput">Command<span class="requiredInput">*</span></label>
            <textarea class="form-control command-value" placeholder="/usr/bin/php /location/example.php" id="commandInput" rows="2"></textarea>
            <div class="form-text invalidInputCommand hidden">
                Please enter a command.
            </div>
            <div class="timeButtons">
                <label for="addTime">Time<span class="requiredInput">*</span></label><br>
                <button type="button" id="simpleBtn" onclick="showSimpleTimeForm()" class="mt-1 btn btn-primary">Simple</button>
                <button type="button" id="advancedBtn" onclick="showAdvancedTimeForm()" class="mt-1 btn btn-outline-primary">Advanced</button>
            </div>

            <div id="advancedForm" class="hidden">
                <label for="timeInput" class="mt-3">Time Expression*</label>
                <input class="form-control time-value" value="* * * * *" id="timeInput" type="text" placeholder="* * * * *">
                <div class="form-text invalidInputTime hidden">
                    Please enter time.
                </div>
                <div class="form-text invalidAdvancedTime invalidInput hidden">   
                </div>
                <div class="form-text"><a id="tutorialLink" target="_blank" href="https://linuxmoz.com/crontab-syntax-tutorial/">Time expressions tutorial</a></div>
            </div>

            <div class="mt-3" id="simpleForm">
                <div>
                    <input type="radio" class="mt-2" name="specificTime" id="specific-time" required checked>
                    <label for="specific-time">Specific Time In The Day</label>
                    <div class="reveal-if-active">
                        <input type="text" name="sTime" class="hour-value sTime require-if-active form-control col-xs-6" data-require-pair="#specific-time" placeholder="h">
                        <input type="text" name="sMin" class="minute-value sMin require-if-active form-control col-xs-6" data-require-pair="#specific-time" placeholder="m">
                    </div>
                    <div class="form-text invalidHourAndMin invalidInput hidden">
                        
                    </div>
                </div>
                
                <div>
                    <input type="radio" class="mt-2" name="specificTime" id="repeat-time">
                    <label for="repeat-time">Every x Hours At Minute Y</label>
                    <div class="reveal-if-active">
                        <span class="specificTime">
                            Every 
                            <input type="text" name="sTime" class="repeat-hour-value sTime require-if-active form-control" data-require-pair="#repeat-time" value="1">
                            hours at minute
                            <input type="text" name="sMin" class="repeat-minute-value sMin require-if-active form-control" data-require-pair="#repeat-time" value="0">
                        </span>
                    </div>
                    <div class="form-text invalidRepeatHourAndMin invalidInput hidden">
                        
                    </div>
                </div>

                <div>
                    <input type="radio" class="mt-2" name="specificTime" id="repeat-minutes">
                    <label for="repeat-minutes">Every x Minutes</label>
                    <div class="reveal-if-active">
                        <span class="specificTime">
                            Every 
                            <input type="text" name="sTime" class="every-minute-value sTime require-if-active form-control" data-require-pair="#repeat-minutes" value="1">
                            minutes
                        </span>
                    </div>
                    <div class="form-text invalidEveryMinute invalidInput hidden">
                        
                    </div>
                </div>
                
                <label for="addTime" class="mt-2">Repeat</label>
                <select id="selectTime" class="form-select">
                    <option selected value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <div class="daysOfWeek mt-2 hidden">
                    <span class="timeMessage">Pick day(s) of week</span>
                    <div class="container-xs" data-toggle="buttons">
                        <label><input type="checkbox" class="days-of-week" value="0"> <div class="icon-box"><i class="fa" aria-hidden="true">Sun</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="1"> <div class="icon-box"><i class="fa" aria-hidden="true">Mon</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="2"> <div class="icon-box"><i class="fa" aria-hidden="true">Tue</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="3"> <div class="icon-box"><i class="fa" aria-hidden="true">Wed</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="4"> <div class="icon-box"><i class="fa" aria-hidden="true">Thu</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="5"> <div class="icon-box"><i class="fa" aria-hidden="true">Fri</i></div></label>
                        <label><input type="checkbox" class="days-of-week" value="6"> <div class="icon-box"><i class="fa" aria-hidden="true">Sat</i></div></label>
                    </div>
                    <div class="form-text invalidWeekDays invalidInput hidden">
                        
                    </div>
                </div>

                <div class="daysOfMonth mt-2 hidden">
                    <span class="timeMessage">Pick day(s)</span><br>
                    <div class="container-xs" data-toggle="buttons">
                        <?php
                            for ($i=1; $i<32; $i++) {
                                echo '<label><input type="checkbox" class="day-of-month" value="' . $i . '"> <div class="icon-box"><i class="fa" aria-hidden="true">' . $i . '</i></div></label>';
                            }
                        ?>
                    </div>
                    <div class="form-text invalidMonthDays invalidInput hidden">
                        
                    </div>
                </div>

                <div class="year hidden mt-2">
                    <span class="timeMessage">Pick date</span><br>
                    <select class="form-select months-of-year">
                        <option selected value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <input type="text" name="dayOfMonth" class="days-of-month form-control" value="1">
                </div>
                <div class="form-text invalidMonthAndDay invalidInput hidden">
                        
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-light" id="closeBtn" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="createCron()">Save</button>
        </div>
        </div>
    </div>
    </div>
</div>

<div class="container">
    <div id="listCrons" class="table-responsive">
        <table id="cronTable" class="display" style="width:100%">
                <caption>List of Cron Jobs</caption>
                <thead>
                    <tr>
                        <th>Cron Name</th>
                        <th>File Name</th>
                        <th>Description</th>
                        <th>Command</th>
                        <th>Time</th>
                        <th>Execution Start Time</th>
                        <th>Execution End Time</th>
                        <th><span class="cronFunctions">Edit</span> <span class="cronFunctions">Delete</span> <span class="cronFunctions">Disable</span></th>
                    </tr>
                </thead>
            </table>
    </div>
</div>

<?php

include('includes/footer.html');

?>