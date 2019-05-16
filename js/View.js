function openMenu() {
    resetAllVariables();
    openMenuScreen('menu-screen');
}

function openDefeatMenu() {
    openMenuScreen('defeat-screen');
}

function openScore() {
    openMenuScreen('score-screen');
    let score_list = document.getElementById('score-list');

    while (score_list.firstChild) {
        score_list.removeChild(score_list.firstChild);
    }

    let best_players = JSON.parse(localStorage.getItem('best_players'));

    best_players.sort(function (a, b) {
        return a.wavesSurvived - b.wavesSurvived;
    }).reverse().slice(0, 3)
        .forEach(function (element, index) {
            let item = document.createElement('li');
            item.classList.add('menu-inner__list-item');
            item.classList.add('menu-inner__list-item-score');
            let textNode = document.createTextNode(element.name + ': ' + element.wavesSurvived + ' ( ' + element.secondsElapsed + 's )');
            item.appendChild(textNode);
            score_list.appendChild(item);
        });
}

function openInstructions() {
    openMenuScreen('instructions-screen');
}

function openSettings() {
    if (difficulty === 1) {
        document.getElementById('difficulty-easy').classList.add('difficulty--active');
    } else if (difficulty === 2) {
        document.getElementById('difficulty-normal').classList.add('difficulty--active');
    } else {
        document.getElementById('difficulty-hard').classList.add('difficulty--active');
    }
    openMenuScreen('settings-screen');
}

function openMenuScreen(open = '') {
    menuScreens.filter(function (element, index) {
        return element !== null;
    }).forEach(function (element, index) {
        element.classList.remove('visible');
    });
    document.getElementById(open).classList.add('visible');
}

function closeAllMenuScreens() {
    menuScreens.filter(function (element, index) {
        return element !== null;
    }).forEach(function (element, index) {
        element.classList.remove('visible');
    });
}