'use strict';

function editCron(element) {
    $('.edit-modal-body').empty();
    // if in the future new table head is added the code should be row.childNodes[5].innerHTML and so on...
    const row = element.parentNode.parentNode.parentNode;
    const cron_name = row.childNodes[0].innerHTML;
    const file_name = row.childNodes[1].innerHTML;
    const description = row.childNodes[2].innerHTML;
    const command = row.childNodes[3].innerHTML;
    const time = row.childNodes[4].childNodes[0].getAttribute("title");
    let methodOne, methodTwo, methodThree, minutes, hours, daily, weekly, monthly, yearly, weekDays, allMonthDays="", allMonthDaysArray;
    let dayOfMonth, monthOfYear;
    const timeToArray = time.split(" ");

    if (timeToArray[0][0] === '*') {

        methodThree = "checked";
        if (timeToArray[0][1] === '/') 
            minutes = timeToArray[0].substring(2);
        else minutes = "1";

    } else if (timeToArray[1][0] === '*' && timeToArray[1][1] === '/') {

        methodTwo = "checked";
        minutes = timeToArray[0];
        hours = timeToArray[1].substring(2);
    } else {

        methodOne = "checked";
        minutes = timeToArray[0];
        hours = timeToArray[1];
    }

    if (timeToArray[2] === timeToArray[3] === timeToArray[4] === "*") {
       
        daily = 'selected';
        $('.daysOfEditWeek').removeClass('hidden');
        $('.daysOfEditMonth').removeClass('hidden');
        $('.yearEdit').removeClass('hidden');
    } else if (timeToArray[4] != "*") {
        
        weekly = 'selected';
        weekDays = timeToArray[4].split(",");
        $('.daysOfEditWeek').removeClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').addClass('hidden');

    } else if (timeToArray[2] !== "*" && timeToArray[3] === '*') {
        
        monthly = "selected";
        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').removeClass('hidden');
        $('.yearEdit').addClass('hidden');
        allMonthDaysArray = timeToArray[2].split(",");
        for (let i=1; i<32; i++) {

            if (allMonthDaysArray.includes("" + i))
                allMonthDays += '<label><input type="checkbox" class="day-of-edit-month" value="'+i+'" checked> <div class="icon-box"><i class="fa" aria-hidden="true">'+i+'</i></div></label>\n';
            else
                allMonthDays += '<label><input type="checkbox" class="day-of-edit-month" value="'+i+'"> <div class="icon-box"><i class="fa" aria-hidden="true">'+i+'</i></div></label>\n';
        }
    } else if (timeToArray[3] !== "*" && timeToArray[2] !== "*") {

        dayOfMonth = timeToArray[2];
        monthOfYear = timeToArray[3];
        yearly = "selected";
        console.log('flen');
        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').removeClass('hidden');
    }
    
    if (allMonthDays === "") {
        for (let i=1; i<32; i++)
            allMonthDays += '<label><input type="checkbox" class="day-of-edit-month" value="'+i+'"> <div class="icon-box"><i class="fa" aria-hidden="true">'+i+'</i></div></label>\n';
    }

    $('.edit-modal-body').append(
        '\
        <form id="editForm">\
            <label for="addJobName">Cron Job Name<span class="requiredInput">*</span></label>\
            <input class="form-control job-value" value="' + cron_name + '" type="text">\
            <div class="form-text invalidInputName hidden">Please enter a cron job name.</div>\
            <div class="form-text hidden duplicateName">The cron name you provided already exists.</div>\
            <p id="previousName" class="hidden"></p>'
    );
    $('#previousName').text(`${cron_name}`);

    $('.edit-modal-body').append(
        '<label for="fileName" class="mt-4">File Name</label>\n<input class="form-control file-name-value" value="' + file_name + '" type="text"><p id="previousFileName" class="hidden"></p>'
    );
    $('#previousFileName').text(`${file_name}`);

    $('.edit-modal-body').append(
        ' <label class="mt-4" for="description">Description</label>\n<textarea class="form-control description-value" rows="2">' + description + '</textarea><p id="previousDescription" class="hidden"></p>'
    );
    $('#previousDescription').text(`${description}`);

    $('.edit-modal-body').append(
        '<label class="mt-4" for="commandInput">Command<span class="requiredInput">*</span></label>\n<textarea class="form-control command-value" rows="2">' + command + '</textarea>\
        <div class="form-text invalidInputCommand hidden">Please enter a command.</div>\
        <p id="previousCommand" class="hidden"></p>\
        </form>\
        '
    );
    $('#previousCommand').text(`${command}`);

    $('.edit-modal-body').append(
        '\
        <div class="timeButtons">\
            <label for="addTime">Time<span class="requiredInput">*</span></label><br>\
            <button type="button" id="simpleEditBtn" onclick="showSimpleEditTimeForm()" class="mt-1 btn btn-primary">Simple</button>\
            <button type="button" id="advancedEditBtn" onclick="showAdvancedEditTimeForm()" class="mt-1 btn btn-outline-primary">Advanced</button>\
        </div>\
        \
        <p id="previousTime" class="hidden"></p>\
        <div id="advancedEditForm" class="hidden">\
            <label for="timeInput" class="mt-3">Time Expression*</label>\
            <input class="form-control time-value" value="'+ time +'" id="timeInput" type="text" placeholder="* * * * *">\
            <div class="form-text invalidInputTime hidden">\
                Please enter time.\
            </div>\
            <div class="form-text invalidEditAdvancedTime invalidInput hidden">\
            </div>\
            <div class="form-text"><a id="tutorialLink" target="_blank" href="https://linuxmoz.com/crontab-syntax-tutorial/">Time expressions tutorial</a></div>\
        </div>\
        \
        <div class="mt-3" id="simpleEditForm">\
        \
            <div>\
                <input type="radio" class="mt-2" name="specificEditTime" id="specific-edit-time" required ' + methodOne + '>\
                <label for="specific-edit-time">Specific Time In The Day</label>\
                <div class="reveal-if-active">\
                    <input type="text" name="sTime" class="hour-edit-value sTime require-if-active form-control col-xs-6" data-require-pair="#specific-edit-time" ' + (typeof hours   !== 'undefined' && typeof methodOne !== 'undefined' ? 'value="'+hours+'"' : 'placeholder="h"') + '>\
                    <input type="text" name="sMin" class="minute-edit-value sMin require-if-active form-control col-xs-6" data-require-pair="#specific-edit-time" ' + (typeof minutes !== 'undefined' && typeof methodOne !== 'undefined' ? 'value="'+minutes+'"' : 'placeholder="m"') + '>\
                </div>\
                <div class="form-text invalidEditHourAndMin invalidInput hidden">\
                </div>\
            </div>\
            \
            <div>\
                <input type="radio" class="mt-2" name="specificEditTime" id="repeat-edit-time" ' + methodTwo + '>\
                <label for="repeat-edit-time">Every x Hours At Minute Y</label>\
                <div class="reveal-if-active">\
                    <span class="specificTime">\
                        Every\
                        <input type="text" name="sTime" class="repeat-hour-edit-value sTime require-if-active form-control" data-require-pair="#repeat-edit-time" ' + (typeof hours   !== 'undefined' && typeof methodTwo !== 'undefined' ? 'value="'+hours+'"' : 'placeholder="h"') + '>\
                        hours at minute\
                        <input type="text" name="sMin" class="repeat-minute-edit-value sMin require-if-active form-control" data-require-pair="#repeat-edit-time" ' + (typeof minutes !== 'undefined' && typeof methodTwo !== 'undefined' ? 'value="'+minutes+'"' : 'placeholder="m"') + '>\
                    </span>\
                </div>\
                <div class="form-text invalidEditRepeatHourAndMin invalidInput hidden">\
                </div>\
            </div>\
            \
            <div>\
                <input type="radio" class="mt-2" name="specificEditTime" id="repeat-edit-minutes" ' + methodThree +'>\
                <label for="repeat-edit-minutes">Every x Minutes</label>\
                <div class="reveal-if-active">\
                    <span class="specificTime">\
                        Every\
                        <input type="text" name="sTime" class="every-minute-edit-value sTime require-if-active form-control" data-require-pair="#repeat-edit-minutes" ' + (typeof minutes !== 'undefined'  && typeof methodThree !== 'undefined' ? 'value="'+minutes+'"' : 'placeholder="m"') + '>\
                        minutes\
                    </span>\
                </div>\
                <div class="form-text invalidEditEveryMinute invalidInput hidden">\
                </div>\
            </div>\
            \
            <label for="addTime" class="mt-2">Repeat</label>\
                <select id="selectEditTime" class="form-select">\
                    <option '+daily+' value="daily">Daily</option>\
                    <option '+weekly+' value="weekly">Weekly</option>\
                    <option '+monthly+' value="monthly">Monthly</option>\
                    <option '+yearly+' value="yearly">Yearly</option>\
                </select>\
                <div class="daysOfEditWeek mt-2 hidden">\
                    <span class="timeMessage">Pick day(s) of week</span>\
                    <div class="container-xs" data-toggle="buttons">\
                        <label><input type="checkbox" class="days-of-edit-week" value="0" ' + (typeof weekDays !== 'undefined' && weekDays.includes("0") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Sun</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="1" ' + (typeof weekDays !== 'undefined' && weekDays.includes("1") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Mon</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="2" ' + (typeof weekDays !== 'undefined' && weekDays.includes("2") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Tue</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="3" ' + (typeof weekDays !== 'undefined' && weekDays.includes("3") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Wed</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="4" ' + (typeof weekDays !== 'undefined' && weekDays.includes("4") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Thu</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="5" ' + (typeof weekDays !== 'undefined' && weekDays.includes("5") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Fri</i></div></label>\
                        <label><input type="checkbox" class="days-of-edit-week" value="6" ' + (typeof weekDays !== 'undefined' && weekDays.includes("6") ? 'checked' : '') + '> <div class="icon-box"><i class="fa" aria-hidden="true">Sat</i></div></label>\
                    </div>\
                    <div class="form-text invalidEditWeekDays invalidInput hidden">\
                    </div>\
            </div>\
            \
            <div class="daysOfEditMonth mt-2 hidden">\
                <span class="timeMessage">Pick day(s)</span><br>\
                <div class="container-xs" data-toggle="buttons">\
                    ' + allMonthDays + '\
                </div>\
                <div class="form-text invalidEditMonthDays invalidInput hidden">\
                </div>\
            </div>\
            <div class="yearEdit mt-2 hidden">\
                <span class="timeMessage">Pick date</span><br>\
                <select class="form-select months-of-edit-year">\
                    <option ' + (monthOfYear  === "1" ? 'selected' : '')  + ' value="1">January</option>\
                    <option ' + (monthOfYear  === "2" ? 'selected' : '')  + ' value="2">February</option>\
                    <option ' + (monthOfYear  === "3" ? 'selected' : '')  + ' value="3">March</option>\
                    <option ' + (monthOfYear  === "4" ? 'selected' : '')  + ' value="4">April</option>\
                    <option ' + (monthOfYear  === "5" ? 'selected' : '')  + ' value="5">May</option>\
                    <option ' + (monthOfYear  === "6" ? 'selected' : '')  + ' value="6">June</option>\
                    <option ' + (monthOfYear  === "7" ? 'selected' : '')  + ' value="7">July</option>\
                    <option ' + (monthOfYear  === "8" ? 'selected' : '')  + ' value="8">August</option>\
                    <option ' + (monthOfYear  === "9" ? 'selected' : '')  + ' value="9">September</option>\
                    <option ' + (monthOfYear  === "10" ? 'selected' : '') + ' value="10">October</option>\
                    <option ' + (monthOfYear  === "11" ? 'selected' : '') + ' value="11">November</option>\
                    <option ' + (monthOfYear  === "12" ? 'selected' : '') + ' value="12">December</option>\
                </select>\
                <input type="text" name="dayOfMonth" class="days-of-edit-month form-control" ' + (typeof dayOfMonth    !== 'undefined' ? 'value="'+dayOfMonth+'"' : 'placeholder="m"') + '>\
            </div>\
            <div class="form-text invalidEditMonthAndDay invalidInput hidden">\
            </div>\
        </div>\
        '
    );

    if (timeToArray[2] === timeToArray[3] === timeToArray[4] === "*") {
        $('.daysOfEditWeek').removeClass('hidden');
        $('.daysOfEditMonth').removeClass('hidden');
        $('.yearEdit').removeClass('hidden');
    } else if (timeToArray[4] != "*") {
        $('.daysOfEditWeek').removeClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').addClass('hidden');
    } else if (timeToArray[2] !== "*" && timeToArray[3] === '*') {
        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').removeClass('hidden');
        $('.yearEdit').addClass('hidden');
    } else if (timeToArray[3] !== "*" && timeToArray[2] !== "*") {
        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').removeClass('hidden');
    }
    
    $('#previousTime').text(`${time}`);
    $('#edit-cron').click();

}

$(document).on('change', '#selectEditTime', function () {

    if (this.value == 'weekly') {

        $('.daysOfEditWeek').removeClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').addClass('hidden');

    } else if (this.value == 'monthly') {

        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').removeClass('hidden');
        $('.yearEdit').addClass('hidden');
    } else if (this.value == 'yearly') {

        $('.daysOfEditWeek').addClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').removeClass('hidden');
    } else {

        $('.daysOfWeek').addClass('hidden');
        $('.daysOfEditMonth').addClass('hidden');
        $('.yearEdit').addClass('hidden');
    }
});

function showSimpleEditTimeForm() {
    const advanced = document.querySelector('#advancedEditBtn');
    advanced.classList.remove("btn-primary");
    advanced.classList.add('btn-outline-primary');

    const simple = document.querySelector('#simpleEditBtn');
    simple.classList.remove('btn-outline-primary');
    simple.classList.add('btn-primary');

    const simpleForm = document.querySelector('#simpleEditForm');
    simpleForm.classList.remove('hidden');
    const advancedForm = document.querySelector('#advancedEditForm');
    advancedForm.classList.add('hidden');
}

function showAdvancedEditTimeForm() {
    const simple = document.querySelector('#simpleEditBtn');
    simple.classList.remove("btn-primary");
    simple.classList.add('btn-outline-primary');

    const advanced = document.querySelector('#advancedEditBtn');
    advanced.classList.remove('btn-outline-primary');
    advanced.classList.add('btn-primary');

    const simpleForm = document.querySelector('#simpleEditForm');
    simpleForm.classList.add('hidden');
    const advancedForm = document.querySelector('#advancedEditForm');
    advancedForm.classList.remove('hidden');
}

function saveCron() {
    const previousName = $('#previousName').html();
    const previousFileName = $('#previousFileName').html();
    const previousTime = $('#previousTime').html();
    const previousDescription = $('#previousDescription').html();
    const previousCommand = $('#previousCommand').html();

    // fill time based on the form selected.
    let time = "";
    clearPreviousTimeErrors();

    if (!$('#advancedEditForm').hasClass('hidden')) {

        const checkTime = $('#timeInput').val().split(" ");
        if (checkTime.length > 5) {

            $('.invalidEditAdvancedTime').append('Invalid Time Expression Entered');
            $(`.invalidEditAdvancedTime`).removeClass('hidden');
            $('.time-value').addClass('required');
            return;
        } else {
            time += $('#timeInput').val();
        }
    } else {
        // method 1 
        if (document.getElementById('specific-edit-time').checked) {

            if ($('.minute-edit-value').val() === "" || $('.hour-edit-value').val() === "") {
                $('.invalidEditHourAndMin').append('Hour And Minute are required');
                minAndHourError('invalidEditHourAndMin');
                return;
            }
            const minVal = parseInt($('.minute-edit-value').val());
            const hourVal = parseInt($('.hour-edit-value').val());


            if (minVal > 59 || minVal < 0) {
                $('.invalidEditHourAndMin').append('Minute has to be between 0 and 59<br>');
                minAndHourError('invalidEditHourAndMin');
                return;
            } else {
                time += `${minVal} `;
            }
            if (hourVal > 23 || hourVal < 0) {
                $('.invalidEditHourAndMin').append('Hour has to be between 0 and 23');
                minAndHourError('invalidEditHourAndMin');
                return;
            } else {
                time += `${hourVal} `;
            }
            // method 2
        } else if (document.getElementById('repeat-edit-time').checked) {
            
            if ($('.repeat-minute-edit-value').val() === "" || $('.repeat-hour-edit-value').val() === "") {
                $('.invalidEditRepeatHourAndMin').append('Hour And Minute are required');
                minAndHourError('invalidEditRepeatHourAndMin');
                return;
            }

            const minVal = parseInt($('.repeat-minute-edit-value').val());
            const hourVal = parseInt($('.repeat-hour-edit-value').val());

            if (minVal > 59 || minVal < 0) {
                $('.invalidEditRepeatHourAndMin').append('Minute should be between 0 and 59<br>');
                minAndHourError('invalidEditRepeatHourAndMin');
                return;
            } else {
                time += `${minVal} `;
            }

            if (hourVal > 23 || hourVal < 0) {
                $('.invalidEditRepeatHourAndMin').append('Hour should be between 0 and 23<br>');
                minAndHourError('invalidEditRepeatHourAndMin');
                return;
            } else {

                time += (hourVal === 1) ? "* " : `*/${hourVal} `;
            }
            // method 3
        } else if (document.getElementById('repeat-edit-minutes').checked) {

            if ($('.every-minute-edit-value').val() === "") {
                $('.invalidEditEveryMinute').append('Minute is required');
                minAndHourError('invalidEditEveryMinute');
                return;
            }
            const minVal = parseInt($('.every-minute-edit-value').val());

            if (minVal > 59 || minVal < 1) {
                $('.invalidEditEveryMinute').append('Minute should be between 1 and 59');
                minAndHourError('invalidEditEveryMinute');
                return;
            } else {

                time += (minVal === 1) ? "* * " : `*/${minVal} * `;
            }
        } else {
            $('.invalidEditEveryMinute').append('Something Went Wrong');
            return;
        }

        // repeat methods 
        if ($('#selectEditTime').val() == 'monthly') {

            const days = $('.day-of-edit-month');
            let allDays = "";
            let first = 0;
            for (let i = 0; i < days.length; i++) {

                if ($(days[i]).is(':checked')) {
                    allDays += (first === 0) ? `${$(days[i]).val()}` : `,${$(days[i]).val()}`;
                    first++;
                }
            }
            if (first === 0) {
                $('.invalidEditMonthDays').append('Please select at least one day.');
                $(`.invalidEditMonthDays`).removeClass('hidden');
                return;
            }
            time += `${allDays} * *`;

        } else if ($('#selectEditTime').val() == 'daily') {

            time += "* * *";

        } else if ($('#selectEditTime').val() == 'yearly') {

            if ($('.days-of-edit-month').val() === "" || $('.months-of-edit-year').val() === "") {
                $('.invalidEditMonthAndDay').append('Month and day are required');
                $(`.invalidEditMonthAndDay`).removeClass('hidden');
                $('.days-of-edit-month ').addClass('required');
                return;
            }
            const dayOfMonth = parseInt($('.days-of-edit-month').val());
            const monthsOfYear = parseInt($('.months-of-edit-year').val());

            if (dayOfMonth < 1 || dayOfMonth > 31) {
                $('.invalidEditMonthAndDay').append('Day has to be between 1 and 31');
                $(`.invalidEditMonthAndDay`).removeClass('hidden');
                $('.days-of-edit-month ').addClass('required');
                return;
            } else {
                time += `${dayOfMonth} `;
            }

            if (monthsOfYear < 1 || monthsOfYear > 12) {
                $('.invalidEditMonthAndDay').append('Invalid Month Entered');
                $(`.invalidEditMonthAndDay`).removeClass('hidden');
            } else {
                time += `${monthsOfYear} *`;
            }

        } else if ($('#selectEditTime').val() == 'weekly') {
            time += '* * ';
            const weekDay = $('.days-of-edit-week');
            let allWeekDays = "";
            let first = 0;

            for (let i = 0; i < weekDay.length; i++) {
                if ($(weekDay[i]).is(':checked')) {
                    allWeekDays += (first === 0) ? `${$(weekDay[i]).val()}` : `,${$(weekDay[i]).val()}`;
                    first++;
                }
            }
            if (first === 0) {
                $('.invalidEditWeekDays').append('Please select at least one day.');
                $(`.invalidEditWeekDays`).removeClass('hidden');
                return;
            }
            time += allWeekDays;
        }
    }

    $.ajax({
        type: "POST",
        url: 'update.php',
        data: {
            "jobName": $(".job-value").val(),
            "command": $(".command-value").val(),
            "time": time,
            "description": $(".description-value").val(),
            "fileName": $(".file-name-value").val(),
            "previousName": previousName,
            "previousFileName": previousFileName,
            "previousTime": previousTime,
            "previousDescription": previousDescription,
            "previousCommand": previousCommand,
        },
        success: function (json) {
            const data = JSON.parse(json);

            if (data === 'success') {
                const success = document.querySelector('.jobCreated');
                success.classList.remove("hidden");
                $("#closeEditBtn").click();
                showCronTable();
            } else if (data === 'error') {
                showDuplicateNameError();
            } else {

                checkPostData(data);
            }
        },
    });
}

