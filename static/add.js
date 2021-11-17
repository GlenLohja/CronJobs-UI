'use strict';

function createCron() {
    $('.edit-modal-body').empty();
    clearPreviousTimeErrors();
    let time = "";

    if (!$('#advancedForm').hasClass('hidden')) {

        const checkTime = $('#timeInput').val().split(" ");
        if (checkTime.length > 5) {

            $('.invalidAdvancedTime').append('Invalid Time Expression Entered');
            $(`.invalidAdvancedTime`).removeClass('hidden');
            $('.time-value').addClass('required');
            return;
        } else {
            time += $('#timeInput').val();
        }
    } else {
        
        // method 1 
        if (document.getElementById('specific-time').checked) {

            if ($('.minute-value').val() === "" || $('.hour-value').val() === "") {
                $('.invalidHourAndMin').append('Hour And Minute are required');
                minAndHourError('invalidHourAndMin');
                return;
            }
            const minVal = parseInt($('.minute-value').val());
            const hourVal = parseInt($('.hour-value').val());


            if (minVal > 59 || minVal < 0) {
                $('.invalidHourAndMin').append('Minute has to be between 0 and 59<br>');
                minAndHourError('invalidHourAndMin');
                return;
            } else {
                time += `${minVal} `;
            }
            if (hourVal > 23 || hourVal < 0) {
                $('.invalidHourAndMin').append('Hour has to be between 0 and 23');
                minAndHourError('invalidHourAndMin');
                return;
            } else {
                time += `${hourVal} `;
            }
            // method 2
        } else if (document.getElementById('repeat-time').checked) {
            
            if ($('.repeat-minute-value').val() === "" || $('.repeat-hour-value').val() === "") {
                $('.invalidRepeatHourAndMin').append('Hour And Minute are required');
                minAndHourError('invalidRepeatHourAndMin');
                return;
            }

            const minVal = parseInt($('.repeat-minute-value').val());
            const hourVal = parseInt($('.repeat-hour-value').val());

            if (minVal > 59 || minVal < 0) {
                $('.invalidRepeatHourAndMin').append('Minute should be between 0 and 59<br>');
                minAndHourError('invalidRepeatHourAndMin');
                return;
            } else {
                time += `${minVal} `;
            }

            if (hourVal > 23 || hourVal < 0) {
                $('.invalidRepeatHourAndMin').append('Hour should be between 0 and 23<br>');
                minAndHourError('invalidRepeatHourAndMin');
                return;
            } else {

                time += (hourVal === 1) ? "* " : `*/${hourVal} `;
            }
            // method 3
        } else if (document.getElementById('repeat-minutes').checked) {

            if ($('.every-minute-value').val() === "") {
                $('.invalidEveryMinute').append('Minute is required');
                minAndHourError('invalidEveryMinute');
                return;
            }
            const minVal = parseInt($('.every-minute-value').val());

            if (minVal > 59 || minVal < 1) {
                $('.invalidEveryMinute').append('Minute should be between 1 and 59');
                minAndHourError('invalidEveryMinute');
                return;
            } else {

                time += (minVal === 1) ? "* * " : `*/${minVal} * `;
            }
        } else {
            $('.invalidEveryMinute').append('Something Went Wrong');
            return;
        }

        if ($('#selectTime').val() == 'monthly') {

            const days = $('.day-of-month');
            let allDays = "";
            let first = 0;
            for (let i = 0; i < days.length; i++) {

                if ($(days[i]).is(':checked')) {
                    allDays += (first === 0) ? `${$(days[i]).val()}` : `,${$(days[i]).val()}`;
                    first++;
                }
            }
            if (first === 0) {
                $('.invalidMonthDays').append('Please select at least one day.');
                $(`.invalidMonthDays`).removeClass('hidden');
                return;
            }
            time += `${allDays} * *`;

        } else if ($('#selectTime').val() == 'daily') {

            time += "* * *";

        } else if ($('#selectTime').val() == 'yearly') {

            if ($('.days-of-month').val() === "" || $('.months-of-year').val() === "") {
                $('.invalidMonthAndDay').append('Month and day are required');
                $(`.invalidMonthAndDay`).removeClass('hidden');
                $('.days-of-month ').addClass('required');
                return;
            }
            const dayOfMonth = parseInt($('.days-of-month').val());
            const monthsOfYear = parseInt($('.months-of-year').val());

            if (dayOfMonth < 1 || dayOfMonth > 31) {
                $('.invalidMonthAndDay').append('Day has to be between 1 and 31');
                $(`.invalidMonthAndDay`).removeClass('hidden');
                $('.days-of-month ').addClass('required');
                return;
            } else {
                time += `${dayOfMonth} `;
            }

            if (monthsOfYear < 1 || monthsOfYear > 12) {
                $('.invalidMonthAndDay').append('Invalid Month Entered');
                $(`.invalidMonthAndDay`).removeClass('hidden');
            } else {
                time += `${monthsOfYear} *`;
            }

        } else if ($('#selectTime').val() == 'weekly') {
            time += '* * ';
            const weekDay = $('.days-of-week');
            let allWeekDays = "";
            let first = 0;

            for (let i = 0; i < weekDay.length; i++) {
                if ($(weekDay[i]).is(':checked')) {
                    allWeekDays += (first === 0) ? `${$(weekDay[i]).val()}` : `,${$(weekDay[i]).val()}`;
                    first++;
                }
            }
            if (first === 0) {
                $('.invalidWeekDays').append('Please select at least one day.');
                $(`.invalidWeekDays`).removeClass('hidden');
                return;
            }
            time += allWeekDays;
        }
    }


    $.ajax({
        type: "POST",
        url: 'add-cron.php',
        data: {
            "jobName": $(".job-value").val(),
            "command": $(".command-value").val(),
            "time": time,
            "description": $(".description-value").val(),
            "fileName": $(".file-name-value").val(),
        },
        success: function (json) {
            clearPreviousErrors();
            const data = JSON.parse(json);
            if (data === 'success') {

                const success = document.querySelector('.jobCreated');
                success.classList.remove("hidden");
                $("#closeBtn").click();
                showCronTable();
            } else if (data === 'error') {

                showDuplicateNameError();
            } else {
                // we need to clear edit modal first so there is no confilict between edit and add modal.
                $('.edit-modal-body').empty();
                checkPostData(data);

            }
        },
        error: function() {
            console.log('Something went wrong.');
        }
    });
}

// time form 

function showSimpleTimeForm() {
    const advanced = document.querySelector('#advancedBtn');
    advanced.classList.remove("btn-primary");
    advanced.classList.add('btn-outline-primary');

    const simple = document.querySelector('#simpleBtn');
    simple.classList.remove('btn-outline-primary');
    simple.classList.add('btn-primary');

    const simpleForm = document.querySelector('#simpleForm');
    simpleForm.classList.remove('hidden');
    const advancedForm = document.querySelector('#advancedForm');
    advancedForm.classList.add('hidden');
}

function showAdvancedTimeForm() {
    const simple = document.querySelector('#simpleBtn');
    simple.classList.remove("btn-primary");
    simple.classList.add('btn-outline-primary');

    const advanced = document.querySelector('#advancedBtn');
    advanced.classList.remove('btn-outline-primary');
    advanced.classList.add('btn-primary');

    const simpleForm = document.querySelector('#simpleForm');
    simpleForm.classList.add('hidden');
    const advancedForm = document.querySelector('#advancedForm');
    advancedForm.classList.remove('hidden');
}

$(document).on('change', '#selectTime', function () {

    if (this.value == 'weekly') {

        $('.daysOfWeek').removeClass('hidden');
        $('.daysOfMonth').addClass('hidden');
        $('.year').addClass('hidden');

    } else if (this.value == 'monthly') {

        $('.daysOfWeek').addClass('hidden');
        $('.daysOfMonth').removeClass('hidden');
        $('.year').addClass('hidden');
    } else if (this.value == 'yearly') {

        $('.daysOfWeek').addClass('hidden');
        $('.daysOfMonth').addClass('hidden');
        $('.year').removeClass('hidden');
    } else {

        $('.daysOfWeek').addClass('hidden');
        $('.daysOfMonth').addClass('hidden');
        $('.year').addClass('hidden');
    }
});