/***
 * file name : WiseMathGlobals.js
 * description : wise Math Game globals
 * create date : 2019-05-17
 * creator : saltgamer
 ***/

const WiseMathGlobals = (() => {
    class Globals {
        constructor() {
            this.metaData = null;
            this.currentQuizList = {
                question: [],
                answer: []
            };
            this.currentQuizType = null;

            this.currentStep = 0;
            this.currentScore = '';

            this.isComplete = {
                bigGame: false,
                smallGame: false
            };

            this.timerCallBack = null;

        }

        shuffleQuiz(quizData) {
            console.log('shuffleQuiz: ', quizData);
            this.currentQuizList.question = [];
            const cloneMeta = JSON.parse(JSON.stringify(quizData));
            for (let i = 0; i < this.metaData.quizLength; i++) {
                let ranNum = randomInt(cloneMeta.question.length);
                // console.log('[salt] ranNum: ', ranNum);

                this.currentQuizList.question.push(cloneMeta.question[ranNum]);
                cloneMeta.question.splice(ranNum, 1);
                // console.log('[salt] cloneMeta: ', cloneMeta);

            }
            this.currentQuizList.answer = quizData.answer;
            this.currentQuizList.answerNumber = quizData.answerNumber;
            console.log('[salt] currentQuizList: ', this.currentQuizList);
        }

        shuffleArray(array) {
            const cloneArray = JSON.parse(JSON.stringify(array));
            const newArray = [];
            for (let i = 0; i < array.length; i++) {
                let ranNum = randomInt(cloneArray.length);
                // console.log('[salt] ranNum: ', ranNum);

                newArray.push(cloneArray[ranNum]);
                cloneArray.splice(ranNum, 1);
                // console.log('[salt] cloneMeta: ', cloneMeta);

            }

            return newArray;
        }

    }

    return new Globals();
})();

function Loading() {
    const loadingBars = [1, 2, 3, 4, 5].map((num) =>
        <div className={'loadingIconBar barIcon' + num} key={num}/>);
    return (
        <div className="loadingContainer">
            <div className="loadingBarBox">
                {loadingBars}
            </div>
        </div>
    );
}

function Timer() {
    const timerObject = React.useRef(null);
    let timer = null,
        count = 0;

    const stop = () => {
        clearInterval(timer);

        if (timerObject.current) timerObject.current.goToAndPause(1);
    };

    WiseMathGlobals.timerStop = stop;

    const startTimer = () => {
        timer = setInterval(update, 1000);
        if (timerObject.current) timerObject.current.goToAndPlay(1);
    };

    const reset = () => {
        clearInterval(timer);
    };

    const update = () => {

        count++;
        console.log(count);
        if (count >= WiseMathGlobals.metaData.timer.limitTime + 1) {
            console.log('stop!');
            stop();

            if (WiseMathGlobals.timerCallBack) WiseMathGlobals.timerCallBack();
        }
    };

    startTimer();

    return (
        <Spritesheet
            ref={timerObject}
            className="inGameTimer"
            image={`./assets/inGame/timerSpriteSheet.png`}
            widthFrame={121}
            heightFrame={75}
            steps={41}
            timeout={1000}
            fps={24}
            autoplay={true}
            loop={true}

        />
    );
}


function randomInt(upper) {
    return Math.floor(upper * Math.random());
}

function loadJSON(url) {
    return fetch(url).then(r => r.json());
}

function applyStyle(target, styles) {
    for (let value in styles) {
        target.style[value] = styles[value];
    }

}