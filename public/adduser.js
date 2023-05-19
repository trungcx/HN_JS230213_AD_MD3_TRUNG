console.log("adduser.js in");
const namePlayer1 = document.querySelector("#input-player1");
const namePlayer2 = document.querySelector("#input-player2");
const namePlayer3 = document.querySelector("#input-player3");
const namePlayer4 = document.querySelector("#input-player4");
const warning = document.querySelector(".warning");
const creatBtn = document.querySelector(".creat-btn");

creatBtn.onclick = async () => {
  try {
    if (
      namePlayer1.value &&
      namePlayer2.value &&
      namePlayer3.value &&
      namePlayer4.value
    ) {
      warning.style.display = "none";
      let res = await fetch(`http://localhost:3000/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namePlayer1: namePlayer1.value,
          namePlayer2: namePlayer2.value,
          namePlayer3: namePlayer3.value,
          namePlayer4: namePlayer4.value,
        }),
      });
      let data = await res.json();
    } else {
      warning.innerHTML = "Please fill all the blank";
      warning.style.display = "block";
    }

    // window.location.href = `/question-detail/${activeQuestion.id}`;
  } catch (error) {
    alert(error);
  }
};
