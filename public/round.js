console.log("round.js in");
const addRoundBtn = document.querySelector(".add-round-btn");
const gridContainer = document.querySelector(".grid-container");
const sumScore = document.querySelector("#totalScore");
const player1_SumScore = document.querySelector("#player-1-sum-score");
const player2_SumScore = document.querySelector("#player-2-sum-score");
const player3_SumScore = document.querySelector("#player-3-sum-score");
const player4_SumScore = document.querySelector("#player-4-sum-score");

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
            onchange="handleOnchange(${index}, this.value, 0)"
            id="round-${round.id}-player-100"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[0]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 1)"
            id="round-${round.id}-player-101"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[1]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 2)"
            id="round-${round.id}-player-102"
            class="grid-item boder-1px"
            type="number"
            value=${round.score[2]}
            />
            <input
            onchange="handleOnchange(${index}, this.value, 3)"
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
    console.log("Add round btn");
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
        console.log("rounds: ", JSON.parse(rounds));
        // ...here
        location.reload();
      })
      .catch((error) => alert(error));
  } catch (error) {
    alert(error);
  }
};

// Input onchange handle
const handleOnchange = async (roundIndex, value, userScoreIndex) => {
  console.log(sumScore.innerHTML);
  //   const idSplit = inputId.split("-");
  const queryParams = `?roundIndex=${roundIndex}&userScoreIndex=${userScoreIndex}&value=${value}`;
  //   console.log("queryParmas: ", queryParams);
  try {
    console.log("Update score");
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
        console.log("rounds hehe: ", rounds);
        // updateSumHTML(userScoreIndex, rounds);
        location.reload();
      })
      .catch((error) => alert(error));
  } catch (error) {
    alert(error);
  }
};

//Update part of HTML
const updateSumHTML = (userScoreIndex, rounds) => {
  console.log("updateSumHTML");

  //   sumScore.innerHTML = "abc";
  let sumAll = 0;
  let sumRoundArr = rounds.map((round) => {
    return round.score.reduce((acc, cur) => acc + cur, 0);
  });

  sumAll = sumRoundArr.reduce((acc, cur) => acc + cur, 0);
  //
  let playerSum = [];
  for (let i = 0; i < 4; i++) {
    let sum = rounds.reduce((acc, cur) => {
      return acc + cur.score[i];
    }, 0);
    playerSum.push(sum);
  }

  //   `player${
  //     userScoreIndex + 1
  //   }_SumScore`.innerHTML = `${playerSum[userScoreIndex]}`;
};
