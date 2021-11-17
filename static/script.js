'use strict';

function showCronTable() {
    $('#cronTable').DataTable()
        .clear()
        .draw()
        .destroy();

    $("#cronTable").DataTable({
        "ajax": {
            "url": "all-crons.php",
            "dataSrc": "data"
        },
        "initComplete": function (settings, json) {
        },
        "columns": [
            { "data": "cron_name" },
            { "data": "file_name" },
            { "data": "description" },
            { "data": "command" },
            {
                data: null,
                render: function (data, type, row) {
                    return `<p title="${data.cronTime}">${data.time}<a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="${data.cronTime}"><i class="fas fa-info-circle" style="color:black;"></i></a></p>`;

                }
            },
            { "data": "start_time" },
            { "data": "end_time" },
            {
                data: null,
                render: function (data, type, row) {
                    if (data.disabled) {

                        return '\
                            <span class="cronFunctions"><button title="Edit Cron" style="color:blue;" class="btn" type="button" onClick="showErrorInfo()"><i class="far fa-edit"></i></button></span>\
                            <span class="cronFunctions"><button title="Delete Cron" style="color:red;" type="button" onClick="showErrorInfo()" class="btn"><i class="far fa-trash-alt"></i></button></span>\
                            <span class="cronFunctions"><button title="Enable Cron Job" onclick="enableOrDisableCron(this, ' + true + ')" type="button" class="btn"><i class="fas fa-toggle-off"></i></button></span>\
                        ';
                    } else {
                        return '\
                            <span class="cronFunctions"><button title="Edit Cron" style="color:blue;" class="btn" type="button" onClick="editCron(this)"><i class="far fa-edit"></i></button></span>\
                            <span class="cronFunctions"><button title="Delete Cron" style="color:red;" type="button" onClick="prepareDelete(this)" class="btn"><i class="far fa-trash-alt"></i></button></span>\
                            <span class="cronFunctions"><button title="Disable Cron Job" style="color:green"; onclick="enableOrDisableCron(this, ' + false + ')" type="button" class="btn"><i class="fas fa-toggle-on"></i></button></span>\
                        ';
                    }
                }
            },
            // {
            //     data: null,
            //     render: function (data, type, row) {
            //         return `<span class="cronFunctions"><button title="Disable Cron Job" style="color:green"; onclick="enableOrDisableCron(this, ' + false + ')" type="button" class="btn"><i class="fas fa-toggle-on"></i></button></span>`;

            //     }
            // },

        ],
        orderCellsTop: true,
        fixedHeader: true,
    });
}



function showErrorInfo() {
    $('#showInfo').click();
}

// function runThisCron(element) {
//     const row = element.parentNode.parentNode.parentNode;
//     const command = row.childNodes[3].innerHTML;

//     $.ajax({
//         type: "POST",
//         url: 'run-cron.php',
//         data: {
//             "script": command,
//         },
//         success: function (json) {
//             const success = document.querySelector('.scriptRun');
//             success.classList.remove("hidden");
//         },
//     });

// }

function enableOrDisableCron(element, bl) {
    const row = element.parentNode.parentNode.parentNode;
    const cron_name = row.childNodes[0].innerHTML;
    const command = row.childNodes[3].innerHTML;
    const time = row.childNodes[4].childNodes[0].getAttribute("title");

    // bl is a boolean value. if true we need to enable cron, if false we need to disable cron.
    $.ajax({
        type: "POST",
        url: 'enable-disable.php',
        data: {
            "disabled": bl,
            "jobName": cron_name,
            "time": time,
            "command": command
        },
        success: function (json) {
            showCronTable();
        },
    });
}

function prepareDelete(element) {
    const row = element.parentNode.parentNode.parentNode;
    const cron_name = row.childNodes[0].textContent;
    const command = row.childNodes[3].textContent;
    const time = row.childNodes[4].childNodes[0].getAttribute("title");

    $('#tempData').append(
        '<p id="cronNameDel"></p><p id="commandDel"></p><p id="timeDel"></p>'
    );
    $('#cronNameDel').text(`${cron_name}`);
    $('#commandDel').text(`${command}`);
    $('#timeDel').text(`${time}`);
    console.log(command);
    $('#delete-cron').click();
}

function checkPostData(d) {
    if (d.jobName) {
        const nameError = document.querySelector('.invalidInputName');
        const nameInput = document.querySelector('.job-value');
        nameError.classList.remove("hidden");
        nameError.classList.add("invalidInput");
        nameInput.classList.add('required');
    }

    if (d.command) {
        const commandError = document.querySelector('.invalidInputCommand');
        const commandInput = document.querySelector('.command-value');
        commandError.classList.remove("hidden");
        commandError.classList.add("invalidInput");
        commandInput.classList.add('required');
    }

    if (d.time) {
        const timeError = document.querySelector('.invalidInputTime');
        const timeInput = document.querySelector('.time-value');
        timeError.classList.remove("hidden");
        timeError.classList.add("invalidInput");
        timeInput.classList.add('required');
    }

}

function clearPreviousErrors() {
    const commandError = document.querySelector('.invalidInputCommand');
    const commandInput = document.querySelector('.command-value');
    const nameError = document.querySelector('.invalidInputName');
    const timeError = document.querySelector('.invalidInputTime');
    const timeInput = document.querySelector('.time-value');
    const nameInput = document.querySelector('.job-value');
    
    commandError.classList.add("hidden");
    nameError.classList.add("hidden");
    timeError.classList.add("hidden");
    commandInput.classList.remove('required');
    timeInput.classList.remove('required');
    nameInput.classList.remove('required');
}

function showDuplicateNameError() {
    // clear previous error and add the duplicate name error.
    clearPreviousErrors();
    const error = document.querySelector('.duplicateName');
    const nameInput = document.querySelector('.job-value');

    error.classList.remove("hidden");
    nameInput.classList.add('required');
}

function clearForm() {
    $('.job-value').val('');
    $('.description-value').val('');
    $('.time-value').val('');
    $('.file-name-value').val('');
    $('.command-value').val('');
}

function deleteCron() {
    const cronNameDel = $('#cronNameDel').html();
    const commandDel = $('#commandDel').html();
    const timeDel = $('#timeDel').html();
    $.ajax({
        type: "POST",
        url: 'delete.php',
        data: {
            "jobName": cronNameDel,
            "command": $('#commandDel').html(),
            "time": timeDel
        },
        success: function (json) {
            console.log(json);
            const success = document.querySelector('.jobDeleted');
            success.classList.remove("hidden");
            $('#closeDelBtn').click();
            showCronTable();
        },
    });
}

function clearPreviousTimeErrors() {

    $('.invalidHourAndMin').empty();
    $('.invalidHourAndMin').addClass('hidden');

    $('.invalidRepeatHourAndMin').empty();
    $('.invalidRepeatHourAndMin').addClass('hidden');

    $('.invalidEveryMinute').empty();
    $('.invalidEveryMinute').addClass('hidden');

    $('.invalidMonthDays').empty();
    $('.invalidMonthDays').addClass('hidden');

    $('.invalidMonthAndDay').empty();
    $('.invalidMonthAndDay').addClass('hidden');

    $('.invalidAdvancedTime').empty();
    $('.invalidAdvancedTime').addClass('hidden');

    $('.invalidWeekDays').empty();
    $('.invalidWeekDays').addClass('hidden');
    $('.sTime').removeClass('required');
    $('.sMin').removeClass('required');
    $('.timeInput').removeClass('required');

}

function minAndHourError(strError) {
    $(`.${strError}`).removeClass('hidden');
    $('.sTime').addClass('required');
    $('.sMin').addClass('required');
    $('.days-of-month ').addClass('required');
}

$(document).ready(function ($) {
    showCronTable();
    $('[data-toggle="tooltip"]').tooltip();

});

var FormStuff = {

    init: function () {
        this.applyConditionalRequired();
        this.bindUIActions();
    },

    bindUIActions: function () {
        $("input[type='radio'], input[type='checkbox']").on("change", this.applyConditionalRequired);
    },

    applyConditionalRequired: function () {

        $(".require-if-active").each(function () {
            var el = $(this);
            if ($(el.data("require-pair")).is(":checked")) {
                el.prop("required", true);
            } else {
                el.prop("required", false);
            }
        });

    }

};

FormStuff.init();

