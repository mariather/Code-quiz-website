
let timer = document.querySelector('#timer'); 
let timerDisplay  = document.querySelector(`header`).children[1]; 
let submit = document.querySelector(`#submit`); 
let higherScores = document.querySelector(`#higherScores`); 
let clearHighscoreBtn = document.querySelector(`#clearHighscoreBtn`); 
let answerButtonLst = document.body.querySelector(`ul`); 
let goBackHighscoreBtn = document.querySelector(`#goBackBtn`); 
let startBtn = document.querySelector(`#startBtn`); 
let title = document.querySelector(`#title`) 
let globalTimerPreset = 75; 
let  questionIndexNumber = 0; 
let timeLeft = globalTimerPreset; 
let score = 0; 
let gameEnded = true; 


//Questions here


function setUpGame() {
    timeLeft = globalTimerPreset; 
    timer.textContent = globalTimerPreset; 

    
    document.querySelector(`#display-highscore-div`).style.display = `none`; 

    
    title.textContent = `Coding Quiz Challenge`; 

    
    title.style.display = `block`; 
    document.querySelector(`#instructions`).style.display = `block`; 
    higherScores.style.display = `block`; 
    startBtn.style.display = `block`; 

    return;
}


function startGame() {
    gameEnded = false; 
    questionIndexNumber = 0; 

    
    higherScores.style.display = `none` 
    startBtn.style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`; 
    timerDisplay.style.display = `block`; 

    
    showQuestions(questionIndexNumber); 
    startTimer(); 

    return;
}


function startTimer() {
    let timerInterval = setInterval(function() {
        if(gameEnded === true) { 
            clearInterval(timerInterval); 
            return;
        }
        if(timeLeft < 1) { 
            clearInterval(timerInterval); 
            endGame(); 
        }

        timer.textContent = timeLeft; 
        timeLeft--; 
    }, 1000); 

    return;
}


function showQuestions(currentQuestionIndex) {
    title.textContent = questionObj.questions[currentQuestionIndex]; 
    createAnswerElements(currentQuestionIndex); 

    return;
}


function createAnswerElements(currentQuestionIndex) {
    answerButtonLst.innerHTML = ''; 

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) { 
        let currentAnswerListItem = document.createElement(`li`); 
         let tempStr = questionObj.answers[currentQuestionIndex][answerIndex]; 

         
        if (questionObj.answers[currentQuestionIndex][answerIndex].includes(`correct:`)){
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length); 
            currentAnswerListItem.id = `correct`; 
        }

        currentAnswerListItem.textContent = tempStr; 
        answerButtonLst.appendChild(currentAnswerListItem); 
    }

    return;
}


function nextQuestion() {
    questionIndexNumber++; 
    if (questionIndexNumber >= questionObj.questions.length){ 
        endGame(); 
    } else { 
        showQuestions(questionIndexNumber); 
    } 

    return;
}


function endGame() { 
    gameEnded = true; 
    score = timeLeft; 

    
    timerDisplay.style.display = `none`; 
    title.style.display = `none`; 
    answerButtonLst.innerHTML = ''; 

    
    document.querySelector(`#scoreSpan`).textContent = score; 
    document.querySelector(`#submit-div`).style.display = `block`; 

    return;
}


function checkAnswer(event) {
    if (event.target != answerButtonLst){ 

        if (!(event.target.id.includes('correct'))){ 
            timeLeft -= 10; 
        }

        nextQuestion(); 
    }

    return;
}


function storeScoreAndName() {
    var highscoreTextbox = document.querySelector(`input`); 
    var tempArrayOfObjects = []; 

    if (highscoreTextbox.value != `` || highscoreTextbox.value != null) { 
        var tempObject = { 
            names: highscoreTextbox.value,
            scores: score, 
        }

        if(window.localStorage.getItem(`highscores`) == null) { 
            tempArrayOfObjects.push(tempObject); 
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)); 

        } else { 
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); 

            for (let index = 0; index <= tempArrayOfObjects.length; index++) { 
                if (index == tempArrayOfObjects.length) { 
                    tempArrayOfObjects.push(tempObject) 
                    break; 
                } else if (tempArrayOfObjects[index].scores < score) { 
                    tempArrayOfObjects.splice(index, 0, tempObject); 
                    break; 
                }
            }
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)) 
        }
        document.querySelector(`input`).value = ``; 
        score = 0; 

        showHighscores(); 
    }

    return;
}


function showHighscores() {
    //elements needed to hide
    title.style.display = `none`; //hides title h1 tag
    startBtn.style.display = `none`; 
    document.querySelector(`header`).children[0].style.display = `none`; 
    document.querySelector(`#instructions`).style.display = `none`; 
    document.querySelector(`#submit-div`).style.display = `none`; 

    //show highscore div and start filling it up
    document.querySelector(`#display-highscore-div`).style.display = `block`; //show div

    tempOrderedList = document.querySelector(`ol`); 
    tempOrderedList.innerHTML = `` 

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); 
    if (tempArrayOfObjects != null) { 
        for (let index = 0; index < tempArrayOfObjects.length; index++) { 
            var newLi = document.createElement(`li`) 
            newLi.textContent = tempArrayOfObjects[index].names + ` - ` + tempArrayOfObjects[index].scores; 
            tempOrderedList.appendChild(newLi); 
        }

    } else { 
        var newLi = document.createElement(`p`) 
        newLi.textContent = `No Highscores` 
        tempOrderedList.appendChild(newLi); 
    }

    return;
}


function clearHighscores() {
    document.querySelector(`ol`).innerHTML = ``; 
    window.localStorage.clear(); 

    setUpGame(); 
    return;
}

function init() {
    
    startBtn.addEventListener(`click`, startGame); 
    answerButtonLst.addEventListener(`click`, checkAnswer); 
    higherScores.addEventListener(`click`, showHighscores); 
    submit.addEventListener(`click`, storeScoreAndName); 
    clearHighscoreBtn.addEventListener(`click`, clearHighscores); 
    goBackHighscoreBtn.addEventListener(`click`, setUpGame); 

    setUpGame(); 
    return;
}

init(); 