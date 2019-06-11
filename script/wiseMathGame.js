/***
 * file name : wiseMathGame.js
 * description : wise Math Game class
 * create date : 2019-05-17
 * creator : saltgamer
 ***/


'use strict';

/*const initialState = {currentStep: 0, currentScore: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'changeStep':
            return {currentStep: WiseMathGlobals.currentStep};
        case 'changeScore':
            return {currentScore: WiseMathGlobals.currentScore};
        default:
            throw new Error();
    }
}*/

function WiseMathGame() {
    // const [state, dispatch] = React.useReducer(reducer, initialState);
    const [isLoading, setLoading] = React.useState(true);
    setTimeout(() => {
        // dispatch({type: 'hideLoading'});
        setLoading(false);
    }, 1000);
    return (
        <React.Fragment>
            <GameRouter/>
            {isLoading && <Loading/>}
        </React.Fragment>
    );
}

let introTimeLine = null;

function Intro() {
    console.log('[salt] Intro...');
    const [isStartButton, setStartButton] = React.useState(false);
    const introTitleObject = React.useRef(null);
    const charBoxObject = React.useRef(null);
    introTimeLine = new TimelineLite({
        onComplete: () => {
            console.log('complete!!!');
            introTimeLine.restart();
        }
    });
    
    React.useEffect(() => {
        setStartButton(true);
    }, []);
    const onStartButton = () => {

        introTimeLine.add(TweenLite.to(charBoxObject.current, 1.5, {y: 30}));
        introTimeLine.add(TweenLite.to(charBoxObject.current, 1.8, {y: 0}));
        introTimeLine.play();

        applyStyle(charBoxObject.current.querySelector('.introCharTextBox'), {
            opacity: 1
        });

        applyStyle(charBoxObject.current, {
            pointerEvents: 'auto'
        });

    };

    const onCabbageButton = () => {
        console.log('onCabbageButton');
        WiseMathGlobals.currentQuizType = 'bigNumber';

    };

    const onDaikonButton = () => {
        console.log('onDaikonButton');
        WiseMathGlobals.currentQuizType = 'smallNumber';

    };

    return (
        <div className="introBg">
            {isStartButton &&
            <img className="introButton" src={`./assets/intro/introButton.png`} onClick={onStartButton}
                 alt="introButton"/>}
           
            <div className="introCharBox" ref={charBoxObject}>
                <ReactRouterDOM.Link to={'/ingame'}><img className="introCabbage" src={`./assets/intro/cabbage.png`}
                                                         alt="배추할아버지" onClick={onCabbageButton}/></ReactRouterDOM.Link>
                <ReactRouterDOM.Link to={'/ingame'}><img className="introDaikon" src={`./assets/intro/daikon.png`}
                                                         alt="무할머니" onClick={onDaikonButton}/></ReactRouterDOM.Link>
                <div className="introCharTextBox">
                    <div className="introCharTextBig">1 큰 수</div>
                    <div className="introCharTextSmall">1 작은 수</div>
                </div>
            </div>
        </div>
    );
}


function InGame() {
    console.log('InGame... ', WiseMathGlobals);
    introTimeLine = new TimelineLite();
    // const [state, dispatch] = React.useReducer(reducer, initialState);
    // console.log('[salt] ingame: ', state);
    let charSrc = null;

    const renderQusetion = () => {
        switch (WiseMathGlobals.currentQuizType) {
            case 'bigNumber':
                WiseMathGlobals.shuffleQuiz(WiseMathGlobals.metaData.quizData1);
                charSrc = 'cabbage_normal.png';
                return WiseMathGlobals.metaData.quizData1.title;

            case 'smallNumber':
                WiseMathGlobals.shuffleQuiz(WiseMathGlobals.metaData.quizData2);
                charSrc = 'daikon_normal.png';
                return WiseMathGlobals.metaData.quizData2.title;
        }
    };


    return (
        (WiseMathGlobals.currentQuizType === null) ?
            <ReactRouterDOM.Redirect to={{pathname: '/'}}/>
            :
            <div className="inGameBg">
                <div className="inGameQuestion_normal">{renderQusetion()}</div>
                <img className="inGameChar" src={`./assets/inGame/` + charSrc} alt="캐릭터"/>
                <UserInterface/>
            </div>

    );
}

function UserInterface() {
    console.log('UserInterface...');
    // const [state, dispatch] = React.useReducer(reducer, initialState);
    const [currentStep, changeStep] = React.useState(0);
    const choicePanelBoxObject = React.useRef(null);

    const initChoicePanels = () => {
        let choicePanels = [];
        const cloneAnswer = JSON.parse(JSON.stringify(WiseMathGlobals.currentQuizList.answer));

        // console.log('ChoicePanels: ', WiseMathGlobals.currentQuizList.answerNumber);
        for (let i = 0; i < WiseMathGlobals.currentQuizList.answerNumber; i++) {

            if (i === 0) {
                switch (WiseMathGlobals.currentQuizType) {
                    case 'bigNumber':
                        choicePanels.push(WiseMathGlobals.currentQuizList.question[currentStep] + 1);
                        cloneAnswer.splice(WiseMathGlobals.currentQuizList.question[currentStep] + 1, 1);
                        break;
                    case 'smallNumber':
                        choicePanels.push(WiseMathGlobals.currentQuizList.question[currentStep] - 1);
                        cloneAnswer.splice(WiseMathGlobals.currentQuizList.question[currentStep] - 1, 1);
                        break;
                }
            } else {
                let ranNum = randomInt(cloneAnswer.length);

                choicePanels.push(cloneAnswer[ranNum]);
                cloneAnswer.splice(ranNum, 1);
            }

        }

        return WiseMathGlobals.shuffleArray(choicePanels);


    };


    const onChoicePanelButton = (e) => {
        console.log(e.target);
        const index = e.target.getAttribute('data-index');
        let isCorrect = null;

        switch (WiseMathGlobals.currentQuizType) {
            case 'bigNumber':

                if (parseInt(e.target.innerText) === WiseMathGlobals.currentQuizList.question[currentStep] + 1) {
                    console.log('correct!');
                    clearStroke();
                    choicePanelBoxObject.current.querySelectorAll('.inGameChoicePanelStroke')[parseInt(index)].style.opacity = 1;
                    isCorrect = '_t';
                } else {
                    console.log('inCorrect!');
                    controlImgSrc('inCorrect');
                    isCorrect = '_f';

                }

                break;
            case 'smallNumber':
                if (parseInt(e.target.innerText) === WiseMathGlobals.currentQuizList.question[currentStep] - 1) {
                    console.log('correct!');
                    controlImgSrc('correct');
                    isCorrect = '_t';
                } else {
                    console.log('inCorrect!');
                    controlImgSrc('inCorrect');
                    isCorrect = '_f';
                }

                break;
        }


        WiseMathGlobals.currentScore = WiseMathGlobals.currentScore + (currentStep === 0 ? isCorrect.replace('_', '') : isCorrect);
        WiseMathGlobals.changeScore(WiseMathGlobals.currentScore);

        setTimeout(() => {
            isCorrect = null;

            // WiseMathGlobals.currentStep++;
            // dispatch({type: 'changeStep'});

            WiseMathGlobals.currentStep = WiseMathGlobals.currentStep + 1;
            changeStep(WiseMathGlobals.currentStep);
            // WiseMathGlobals.currentStep = currentStep;

            console.log('currentStep : ', WiseMathGlobals.currentStep);
            clearStroke();


        }, 1000);

        WiseMathGlobals.timerStop();
    };

    const clearStroke = () => {

        if (choicePanelBoxObject.current) {
            const choicePanelBox = choicePanelBoxObject.current.querySelectorAll('.inGameChoicePanelStroke');
            // console.log(choicePanelBox);
            choicePanelBox.forEach((panel) => {
                panel.style.opacity = 0;
            });
        }

    };

    WiseMathGlobals.timerCallBack = () => {
        const choicePanelBox = choicePanelBoxObject.current.querySelectorAll('.inGameChoicePanel');

        if (WiseMathGlobals.currentQuizList.question[currentStep] !== parseInt(choicePanelBox[0].innerText)) {
            choicePanelBox[0].click();
        } else {
            choicePanelBox[1].click();
        }
        // console.log('timerCallBack: ', choicePanelBox[0].innerText);
    };

    const controlImgSrc = (type) => {
        const char = document.querySelector('.inGameChar');
        char.src = char.src.replace('normal', type);
        setTimeout(() => {
            char.src = char.src.replace(type, 'normal');
        }, 1000);
    };


    // console.log('choicePanels ', choicePanels);
    return (

        (WiseMathGlobals.metaData.quizLength === WiseMathGlobals.currentStep) ?
            <ReactRouterDOM.Redirect to={{pathname: '/score'}}/>
            :
            <React.Fragment>
                <div className="inGameQuestionBox">{WiseMathGlobals.currentQuizList.question[currentStep]}</div>
                <div className="inGameChoicePanelBox" ref={choicePanelBoxObject}>
                    {initChoicePanels().map((choice, idx) =>
                        <div className="inGameChoicePanel" onClick={onChoicePanelButton} data-index={idx}>
                            <div className="inGameChoicePanelStroke"/>
                            {choice}</div>
                    )}
                </div>
                <Timer/>
                <ScorePanel/>
            </React.Fragment>
    );
}

function ScorePanel() {
    const [currentScore, changeScore] = React.useState('');
    WiseMathGlobals.changeScore = changeScore;

    const getScorePanelArray = () => {
        const scoreArray = currentScore.split('_');
        WiseMathGlobals.currentQuizList.question.forEach((item, idx) => {
            if (!scoreArray[idx]) {
                scoreArray[idx] = 'n';
            }
        });
        return scoreArray;
    };

    const scorePanelArray = getScorePanelArray();
    const inGameScorePanelBoxObject = React.useRef(null);
    const inGameCorrectSpriteObject = [];
    const inGameInCorrectSpriteObject = [];


    const renderScore = () => {
        switch (scorePanelArray[WiseMathGlobals.currentStep]) {
            case 't':
                console.log(inGameCorrectSpriteObject[WiseMathGlobals.currentStep].current);
                inGameCorrectSpriteObject[WiseMathGlobals.currentStep].current.goToAndPlay(1);
                break;
            case 'f':
                console.log(inGameInCorrectSpriteObject[WiseMathGlobals.currentStep].current);
                inGameInCorrectSpriteObject[WiseMathGlobals.currentStep].current.goToAndPlay(1);
                break;
        }

    };

    React.useEffect(() => {
        renderScore();
    });

    const initSpriteRef = () => {
        WiseMathGlobals.currentQuizList.question.forEach(() => {
            inGameCorrectSpriteObject.push(React.useRef(null));
            inGameInCorrectSpriteObject.push(React.useRef(null));
        });
    };
    initSpriteRef();

    return (

        <div className="inGameScorePanelBox" ref={inGameScorePanelBoxObject}>
            {scorePanelArray.map((score, idx) =>
                <div className="inGameScorePanel" data-index={idx}>

                    <img className={score === 'n' ? '' : 'hidden'} src={`./assets/inGame/scorePanel_default.png`}
                         alt="scorePanel"/>
                    <Spritesheet

                        ref={inGameCorrectSpriteObject[idx]}
                        className={`inGameCorrectSprite ` + (score === 't' ? 'visible' : 'hidden')}
                        image={`./assets/inGame/scorePanel_correctSprite.png`}
                        widthFrame={77}
                        heightFrame={105}
                        steps={22}
                        fps={16}
                        autoplay={false}
                        loop={false}

                    />
                    <Spritesheet

                        ref={inGameInCorrectSpriteObject[idx]}
                        className={`inGameInCorrectSprite ` + (score === 'f' ? 'visible' : 'hidden')}
                        image={`./assets/inGame/scorePanel_inCorrectSprite.png`}
                        widthFrame={80}
                        heightFrame={109}
                        steps={22}
                        fps={16}
                        autoplay={false}
                        loop={false}

                    />

                </div>
            )}
        </div>

    );
}


function Score() {
    let charSrc = null;
    let title = null;
    const renderQusetion = () => {
        switch (WiseMathGlobals.currentQuizType) {
            case 'bigNumber':
                charSrc = 'cabbage_normal.png';
                title = WiseMathGlobals.metaData.quizData1.title;
                break;
            case 'smallNumber':
                charSrc = 'daikon_normal.png';
                title = WiseMathGlobals.metaData.quizData2.title;
                break;
        }
    };

    const renderResultButton = () => {
        console.log('score: ', WiseMathGlobals.currentScore);

        let count = 0;
        let pos = WiseMathGlobals.currentScore.indexOf('f');

        while (pos !== -1) {
            count++;
            pos = WiseMathGlobals.currentScore.indexOf('f', pos + 1);
        }

        console.log('count: ', count);


        WiseMathGlobals.currentStep = 0;
        WiseMathGlobals.currentScore = '';
        switch (WiseMathGlobals.currentQuizType) {
            case 'bigNumber':
                if (count > 3) {
                    return (
                        <div className="scoreContinueButton">
                            ◀ 1 큰 수 게임
                        </div>
                    )
                } else {
                    WiseMathGlobals.currentQuizType = 'smallNumber';
                    WiseMathGlobals.isComplete.bigGame = true;
                    return (
                        <div className="scoreContinueButton">
                            ◀ 1 작은 수 게임
                        </div>
                    )
                }
            case 'smallNumber':
                if (count > 3) {
                    return (
                        <div className="scoreContinueButton">
                            ◀ 1 작은 수 게임
                        </div>
                    )
                } else {
                    WiseMathGlobals.currentQuizType = 'bigNumber';
                    WiseMathGlobals.isComplete.smallGame = true;
                    return (
                        <div className="scoreContinueButton">
                            ◀ 1 큰 수 게임
                        </div>
                    )
                }
        }

    };

    const checkStamp = () => {
        console.log(WiseMathGlobals.isComplete);
        if (WiseMathGlobals.isComplete.bigGame && WiseMathGlobals.isComplete.smallGame) {
            setTimeout(() => {
                alert('스탬프 추가!');
            }, 2000);

        }

    };

    renderQusetion();
    return (
        !charSrc ?
            <ReactRouterDOM.Redirect to={{pathname: '/'}}/>
            :
            <div className="inGameBg">
                <div className="inGameQuestion_normal">{title}</div>
                <img className="inGameChar" src={`./assets/inGame/` + charSrc} alt="캐릭터"/>
                <ReactRouterDOM.Link to={'/ingame'}>{renderResultButton()}</ReactRouterDOM.Link>
                {checkStamp()}
            </div>
    );
}


const GameRouter = () => {
    return (
        <ReactRouterDOM.HashRouter>
            <ReactRouterDOM.Route path="/" exact component={Intro}/>
            <ReactRouterDOM.Route path="/ingame" component={InGame}/>
            <ReactRouterDOM.Route path="/score" component={Score}/>
        </ReactRouterDOM.HashRouter>
    );
};

