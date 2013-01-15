// This File contain functions to save and load  data.
// All data will be encapsulated to JSON string.
// Data before load will be validate.
//                                 ~ Michał Szczygieł

function save(formule) {

    //declare array
    var jsonObj = [];

    for ( i = 0; i < formule.length; i++) {
        var field = formule.elements[i];

        if (field.value != "save") {
            jsonObj.push({
                name : field.name,
                optionValue : field.value
            });
        }
    }
    alert(jsonObj[1].optionValue);
    var jsonAsString = JSON.stringify(jsonObj, null, '\t');
    var base64_data = jsonAsString.toString('base64');

    window.location.assign('data:application/octet-stream;charset=utf-8,' + jsonAsString);

}

var loadFormule;

function load(formule) {
    document.getElementById('files').click();
    loadFormule = formule;
}

var reader;
var progress = document.querySelector('.percent');

function abortRead() {
    reader.abort();
}

function errorHandler(evt) {
    switch(evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break;
        // noop
        default:
            alert('An error occurred reading this file.');
    };
}

function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
        alert('File read cancelled');
    };

    reader.onloadstart = function(e) {
        document.getElementById('progress_bar').className = 'loading';
    };

    reader.onload = function(e) {
        // Ensure that the progress bar displays 100% at the end.
        progress.style.width = '100%';
        progress.textContent = '100%';
        setTimeout("document.getElementById('progress_bar').className='';", 2000);
    }
    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);

    readBlob();

}

function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {// DONE == 2
            
            var reviewtext = evt.target.result;
            var json = eval("(" + reviewtext + ")")
            
            for ( i = 0; i < loadFormule.length; i++) {
                loadFormule.elements[i].value = json[i].optionValue                            
            }
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);
