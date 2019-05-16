function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
            "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
            "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function rowColToArrayIndex(col, row) {
    return brick.cols * row + col;
}

function setUpTimer() {
    totalSeconds = 0;
    setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}

function toggleSound() {
    if (!audioStarted) {
        audioStarted = true;
    }

    if (enableSound === true) {
        audio_volume = 0.6;
    } else {
        audio_volume = 0.0;
        console.log(audio_volume);
    }
    enableSound = !enableSound;
}