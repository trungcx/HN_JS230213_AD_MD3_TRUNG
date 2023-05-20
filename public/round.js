console.log("round.js in");
const addRoundBtn = document.querySelector(".add-round-btn");
const gridContainer = document.querySelector(".grid-container");
let sumScore = document.querySelector("#totalScore");
let player1_SumScore = document.querySelector("#player-1-sum-score");
let player2_SumScore = document.querySelector("#player-2-sum-score");
let player3_SumScore = document.querySelector("#player-3-sum-score");
let player4_SumScore = document.querySelector("#player-4-sum-score");

//GET user data
fetch("http://localhost:3000/users")
  .then((res) => res.json())
  .then((userData) => {
    fetch("http://localhost:3000/rounds")
      .then((res) => res.json())
      .then((roundData) => {
        console.log("userData: ", JSON.parse(userData));
        console.log("roundData: ", JSON.parse(roundData));

        const users = JSON.parse(userData);
        const rounds = JSON.parse(roundData);
        // first line html
        let firstLineHtml = `<div class="grid-item">#</div>`;
        users.map((user, index) => {
          firstLineHtml += `
            <div class="grid-item">${user.name}</div>
            `;
        });

        // Sum line html
        let sumAll = 0;
        let sumRoundArr = rounds.map((round) => {
          return round.score.reduce((acc, cur) => acc + cur, 0);
        });

        sumAll = sumRoundArr.reduce((acc, cur) => acc + cur, 0);

        let playerSum = [];
        for (let i = 0; i < 4; i++) {
          let sum = rounds.reduce((acc, cur) => {
            return acc + cur.score[i];
          }, 0);
          playerSum.push(sum);
        }

        let sumLineHtml = ` 
        <div id="totalScore" class="grid-item bg-blue">
             Sum of scores 
                ${sumAll}
        </div>`;
        playerSum.map((sum, index) => {
          sumLineHtml += `
            <div id="player-${
              index + 1
            }-sum-score" class="grid-item player-sum-score bg-blue">
                ${sum}
            </div>
        `;
        });
        // round html
        let roundHtml = "";
        rounds.map((round, index) => {
          roundHtml += `
            <div class="grid-item">Round ${index + 1}</div>
            <input
            onchange="handleOnchange(${index}, this.value, 0,this.id)"
            id="round-${round.id}-player-100"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[0]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 1,this.id)"
            id="round-${round.id}-player-101"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[1]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 2,this.id)"
            id="round-${round.id}-player-102"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[2]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 3,this.id)"
            id="round-${round.id}-player-103"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[3]}
            />
            `;
        });
        // GRID container html
        gridContainer.innerHTML = firstLineHtml + sumLineHtml + roundHtml;
      });
  })
  .catch((err) => console.log(err));

addRoundBtn.onclick = async () => {
  try {
    let res = await fetch(`http://localhost:3000/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Click add round btn",
      }),
    })
      .then((res) => res.json())
      .then((rounds) => {
        let newRoundHtml = `
            <div class="grid-item">Round ${rounds.length}</div>
            <input
            onchange="handleOnchange(${
              rounds.length - 1
            }, this.value, 0, this.id)"
            id="round-${rounds[rounds.length - 1].id}-player-100"
            class="grid-item boder-1px"
            type="number"
            value="0"
            />
            <input
            onchange="handleOnchange(${
              rounds.length - 1
            }, this.value, 1, this.id)"
            id="round-${rounds[rounds.length - 1].id}-player-101"
            class="grid-item boder-1px"
            type="number"
            value="0"
            />
            <input
            onchange="handleOnchange(${
              rounds.length - 1
            }, this.value, 2, this.id)"
            id="round-${rounds[rounds.length - 1].id}-player-102"
            class="grid-item boder-1px"
            type="number"
            value="0"
            />
            <input
            onchange="handleOnchange(${
              rounds.length - 1
            }, this.value, 3, this.id)"
            id="round-${rounds[rounds.length - 1].id}-player-103"
            class="grid-item boder-1px"
            type="number"
            value="0"
            />
        `;
        // console.log("gridContainer:", gridContainer.innerHTML);
        gridContainer.innerHTML += newRoundHtml;
      })
      .catch((error) => alert(error));
  } catch (error) {
    alert(error);
  }
};

// Input onchange handle
const handleOnchange = async (roundIndex, value, userScoreIndex, inputId) => {
  const queryParams = `?roundIndex=${roundIndex}&userScoreIndex=${userScoreIndex}&value=${value}`;
  try {
    let res = await fetch(`http://localhost:3000/rounds${queryParams}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "update score",
      }),
    })
      .then((res) => res.json())
      .then((rounds) => {
        let inputHtml = document.querySelector(`#${inputId}`);
        inputHtml.setAttribute("value", value);
        updateSumHTML(userScoreIndex, rounds);
      })
      .catch((error) => alert(error));
  } catch (error) {
    alert(error);
  }
};

//Update part of HTML
const updateSumHTML = (userScoreIndex, rounds) => {
  // define HTML element
  let sumScore = document.querySelector("#totalScore");
  let player1_SumScore = document.querySelector("#player-1-sum-score");
  let player2_SumScore = document.querySelector("#player-2-sum-score");
  let player3_SumScore = document.querySelector("#player-3-sum-score");
  let player4_SumScore = document.querySelector("#player-4-sum-score");
  //Total score
  let sumAll = 0;
  let sumRoundArr = rounds.map((round) => {
    return round.score.reduce((acc, cur) => acc + cur, 0);
  });

  sumAll = sumRoundArr.reduce((acc, cur) => acc + cur, 0);
  //Sum score of each player
  let playerSum = [];
  for (let i = 0; i < 4; i++) {
    let sum = rounds.reduce((acc, cur) => {
      return acc + cur.score[i];
    }, 0);
    playerSum.push(sum);
  }
  // Update sum HTML element
  sumScore.innerHTML = `Sum of scores ${sumAll}`;
  switch (userScoreIndex) {
    case 0:
      player1_SumScore.innerHTML = playerSum[0];
      break;
    case 1:
      player2_SumScore.innerHTML = playerSum[1];
      break;
    case 2:
      player3_SumScore.innerHTML = playerSum[2];
      break;
    case 3:
      player4_SumScore.innerHTML = playerSum[3];
      break;
    default:
      break;
  }
};
