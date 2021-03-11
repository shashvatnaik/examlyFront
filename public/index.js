const data = {
    "Questions": [
        {
            "que": "How do you write 'Hello World' in an alert box?",
            "options": [
                {"text": "msgbox(\"Hello World\")", "correct": false},
                {"text": "alertBox(\"Hello World\")", "correct": false},
                {"text": "msg(\"Hello World\")", "correct": false},
                {"text": "alert(\"Hello World\")", "correct": true}
            ]
        },
        {
            "que": "Inside which HTML element do we put the JavaScript?",
            "options": [
                {"text": "<script>", "correct": true},
                {"text": "<javascript>", "correct": false},
                {"text": "<js>", "correct": false},
                {"text": "<scripting>", "correct": false}
            ]
        },
        {
            "que": "What is the correct syntax for referring to an external script called 'xxx.js'?",
            "options": [
                {"text": "<script href=\"xxx.js\">", "correct": false},
                {"text": "<script name=\"xxx.js\">", "correct": false},
                {"text": "<script src=\"xxx.js\">", "correct": true},
                {"text": "<script file=\"xxx.js\">", "correct": false}
            ]
        }
    ],
    "HighScores": JSON.parse(localStorage.getItem("scores") || "[]")
}

const state = localStorage.getItem("quizData") || {
    page: 0,
    score: 0
};

function refreshPage(){
    console.log(state.page);
    if(state.page>0 && state.page<=data.Questions.length){
        document.getElementById("container").innerHTML = "";
        document.getElementById("container").appendChild(getQuestion());
    } else if(state.page > data.Questions.length) {
        document.getElementById("container").innerHTML = "";
        document.getElementById("container").appendChild(finalScore());
    } else if(state.page == -1){
        document.getElementById("container").innerHTML = "";
        document.getElementById("container").appendChild(getHighScores());
    } else if(state.page == -2) {
        location.reload();
        state.page = 0;
    }
}

function startQuiz(){
    state.page = 1;
    refreshPage();
}

function getQuestion(){
    let result = document.createElement("div");
    result.className = "card";
    result.appendChild(getScore());
    result.appendChild(getProgress());
    let questionText = document.createElement("h4");
    questionText.innerHTML = data["Questions"][state.page-1]["que"];
    questionText.className = "option-width";
    result.appendChild(questionText);
    data["Questions"][state.page-1]["options"].forEach((x, i) => {
        let temp = document.createElement("button");
        temp.innerText = x.text
        temp.className = "btn btn-outline-primary option-width";
        temp.onclick = (e) => optionClicked(e, i);
        result.appendChild(temp);
    });
    return result;
}

function getScore(){
    let result = document.createElement("div");
    result.className = "float-right";
    result.innerHTML = "<h5> Score </h5><h1>"+state.score+"</h1>";
    return result;
}

function getProgress(){
    let result = document.createElement("div");
    let progress = document.createElement("div");
    progress.className = "progress";
    progress.innerHTML = '<div class="progress-bar" role="progressbar" style="width:'+ (100*(state.page-1))/data["Questions"].length +'%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>';
    let queNum = document.createElement("h5");
    queNum.innerText = "Question - "+(state.page);
    result.appendChild(queNum);
    result.appendChild(progress);
    return result;
}

function optionClicked(event, option){
    if(data["Questions"][state.page-1]["options"][option].correct){
        state.score += 10;
        event.target.className.replace("btn-outline-primary", "");
        event.target.classList.add("btn-outline-success");
    } else {
        event.target.className.replace("btn-outline-primary", "");
        event.target.classList.add("btn-outline-danger");
    }
    setTimeout(() => {
        state.page += 1;
        refreshPage();
    }, 1000);
}

function finalScore(){
    let result = document.createElement("div");
    result.className = "card";
    let scoreTitle = document.createElement("h4");
    scoreTitle.innerText = "Final Score : "+state.score
    result.appendChild(scoreTitle);
    let userNameLabel = document.createElement("label");
    userNameLabel.setAttribute("for", "username");
    userNameLabel.innerText = "Enter Username : ";
    userNameLabel.className = "form-label";
    result.appendChild(userNameLabel);
    let userNameText = document.createElement("input");
    userNameText.setAttribute("type", "text");
    userNameText.setAttribute("id", "username");
    userNameText.className = "form-control"
    result.appendChild(userNameText);
    let saveBtn = document.createElement("button");
    saveBtn.className = "btn btn-outline-primary btn-width";
    saveBtn.innerText = "Save";
    saveBtn.onclick = () => saveScore(document.getElementById("username").value, state.score);
    result.appendChild(document.createElement("br"));
    result.appendChild(saveBtn);
    let playAgainBtn = document.createElement("button");
    playAgainBtn.className = "btn btn-outline-primary btn-width";
    playAgainBtn.innerText = "Play Again";
    playAgainBtn.onclick = () => {
        state.page = 1;
        state.score = 0;
        refreshPage();
    }
    result.appendChild(document.createElement("br"));
    result.appendChild(playAgainBtn);
    let goHomeBtn = document.createElement("button");
    goHomeBtn.className = "btn btn-outline-primary btn-width";
    goHomeBtn.innerText = "Go Home"
    goHomeBtn.onclick = () => {
        state.page = -2;
        state.score = 0;
        refreshPage();
    }
    result.appendChild(document.createElement("br"));
    result.appendChild(goHomeBtn);
    return result;
}

function saveScore(name, score){
    console.log(name, score);
    if(name){
        data.HighScores.push({name, score});
        data.HighScores.sort((x, y)=> y.score-x.score);
        localStorage.setItem("scores", JSON.stringify(data.HighScores));
        highScorePage();
    } else {
        alert("Please enter a username to save your score");
    }
}

function highScorePage(){
    state.page = -1;
    refreshPage();
}

function getHighScores(){
    let result = document.createElement("div");
    result.className = "card";
    let titleText = document.createElement("h3");
    titleText.innerText = "High Scores";
    titleText.className = "primary";
    result.appendChild(titleText);
    result.appendChild(document.createElement("br"));
    data.HighScores.forEach((x, i) => {
        if(i<4){
            let temp = document.createElement("h5");
            temp.innerText = i+1 + ". " + x.name + " : " + x.score;
            result.appendChild(temp);
        }
    });
    let goHomeBtn = document.createElement("button");
    goHomeBtn.className = "btn btn-outline-primary btn-width";
    goHomeBtn.innerText = "Go Home"
    goHomeBtn.onclick = () => {
        state.page = -2;
        state.score = 0;
        refreshPage();
    }
    result.appendChild(document.createElement("br"));
    result.appendChild(goHomeBtn);
    return result;
}