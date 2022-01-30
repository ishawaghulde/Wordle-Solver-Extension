var dict = []

var close = document.getElementById("close")
close.addEventListener("click", () => {
    console.log('closed popup')
    window.close()
  });

function makeGuesses(variable, stopletters, word, dict) {
    guesses = []
    dict.forEach(w => {
        var flag = true
        for (var i = 0; i < 5; i++) {
            letter = w[i]
            if (word[i] != undefined) {
                if (word[i] != letter) {
                    flag = false
                    break
                }
            }
            else {
                if (variable.hasOwnProperty(letter)) {
                    if (variable[letter].indexOf(i) == -1) {
                        flag = false
                        break
                    }
                }
                else if (stopletters.indexOf(letter) != -1) {
                    flag = false
                    break
                }
            }
        }

        for (let l in variable) {
            if (w.indexOf(l) == -1) {
                flag = false
                break
            }
        }

        if (flag) {
            guesses.push(w)
        }
    })
    var i=0
    while(i<guesses.length){
        const parentDiv = document.getElementById("content")
        const div = document.createElement("div")
        div.classList.add("content-row")
        if(guesses[i]){
            const divOne = document.createElement("div");
            divOne.classList.add("block-one")
            const p = document.createElement("p")
            const node = document.createTextNode(guesses[i]);
            p.appendChild(node);
            divOne.appendChild(p);
            div.appendChild(divOne)
            i=i+1
        }
        if(guesses[i]){
            const divTwo = document.createElement("div");
            divTwo.classList.add("block-two")
            const p = document.createElement("p")
            const node = document.createTextNode(guesses[i]);
            p.appendChild(node);
            divTwo.appendChild(p);
            div.appendChild(divTwo)
            i=i+1
        }
        else{
            const divTwo = document.createElement("div");
            divTwo.classList.add("block-two")
            div.appendChild(divTwo)
            i=i+1
        }
        if(guesses[i]){
            const divThree = document.createElement("div");
            divThree.classList.add("block-three")
            const p = document.createElement("p")
            const node = document.createTextNode(guesses[i]);
            p.appendChild(node);
            divThree.appendChild(p);
            div.appendChild(divThree)
            i=i+1
        }
        else{
            const divThree = document.createElement("div");
            divThree.classList.add("block-three")
            div.appendChild(divThree)
            i=i+1
        }
        if(guesses[i]){
            const divFour = document.createElement("div");
            divFour.classList.add("block-four")
            const p = document.createElement("p")
            const node = document.createTextNode(guesses[i]);
            p.appendChild(node);
            divFour.appendChild(p);
            div.appendChild(divFour)
            i=i+1
        }
        else{
            const divFour = document.createElement("div");
            divFour.classList.add("block-four")
            div.appendChild(divFour)
            i=i+1
        }
        if(guesses[i]){
            const divFive = document.createElement("div");
            divFive.classList.add("block-five")
            const p = document.createElement("p")
            const node = document.createTextNode(guesses[i]);
            p.appendChild(node);
            divFive.appendChild(p);
            div.appendChild(divFive)
        }
        else{
            const divFive = document.createElement("div");
            divFive.classList.add("block-five")
            div.appendChild(divFive)
        }
        i=i+1
        parentDiv.appendChild(div)
        var elem = document. createElement("hr")
        elem.classList.add("horizontal-rule")
        parentDiv.appendChild(elem)
    }
}

function getUserProgress(tries, guesses, colors, dict) {
    var word = Array.apply(null, Array(5)).map(function () { })
    var variable = {}
    var stopletters = []
    var greens = []

    for (var i = 0; i < tries; i++) {
        guess = guesses[i]
        color = colors[i]
        for (var j = 0; j < 5; j++) {
            letter = guess[j]
            evaluation = color[j]
            if (evaluation == "c") {
                word[j] = letter
                greens.push(j)
                delete variable[letter]
            }
            else if (evaluation == "a") {
                if (!stopletters.includes(letter)) {
                    stopletters.push(letter)
                }
            }
        }
        for (var j = 0; j < 5; j++) {
            letter = guess[j]
            evaluation = color[j]
            if (evaluation == "p") {
                if (variable.hasOwnProperty(letter)) {
                    positions = variable[letter]
                    var index = positions.indexOf(j);
                    if (index !== -1) {
                        positions.splice(index, 1);
                    }
                    variable[letter] = positions

                }
                else {
                    positions = [0, 1, 2, 3, 4]
                    positions.splice(j, 1)
                    greens.forEach(pos => {
                        var index = positions.indexOf(pos)
                        if (index != -1) {
                            positions.splice(index, 1)
                        }
                    });
                    variable[letter] = positions
                }
            }
        }
        
    }
    makeGuesses(variable, stopletters, word, dict)
}

function fetchDictionary(tries, guesses, colors){
    fetch('https://api.github.com/gists/cbf6565b777fe936a2aeb2cc25692c3e').then(function (response) {
        return response.json();
    }).then(function (data) {
        var content = data.files.words.content;
        var dict = content.split(" ");
        dict.pop()
        try{
            getUserProgress(tries, guesses, colors, dict)
        }
        catch(error){
            console.log(error)
        }
    }).catch(function () {
        document.getElementById('main-text').innerText = 'Error fetching dictionary!'
    });
}

function updateDonutChart(tries){
    if(tries==1){
        document.getElementById('avatar').src = './images/try1.png'
    }else if(tries==2){
        document.getElementById('avatar').src = './images/try2.png'
    }else if(tries==3){
        document.getElementById('avatar').src = './images/try3.png'
    }else if(tries==4){
        document.getElementById('avatar').src = './images/try4.png'
    }else if(tries==5){
        document.getElementById('avatar').src = './images/try5.png'
    }else{
        document.getElementById('avatar').src = './images/try6.png'
    }
}

chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
    chrome.tabs.sendMessage(tab[0].id,"", function(response){
      tries = response[0][0]
      correct = response[0][1]
      updateDonutChart(tries)
      if(tries==0){
          document.getElementById('main-text').innerText = 'Start playing to get suggestions'
          document.getElementById('side-text').innerText = 'We suggest starting with words such as roate, orate, raise, arise, adieu'
      }
      else if(tries==6){
          if(correct == 5){
            document.getElementById('main-text').innerText = 'Well done!'
            document.getElementById('side-text').innerText = 'Try again tomorrow'
          }
          else{
            document.getElementById('main-text').innerText = 'Looks like you got the answer wrong :('
            document.getElementById('side-text').innerText = 'Better luck tomorrow'
          }

      }
      else{
          if(correct == 5){
            document.getElementById('main-text').innerText = 'Well done!'
            document.getElementById('side-text').innerText = 'Try again tomorrow'
          }
          else{
            fetchDictionary(tries, response[1], response[2])
          }
      }

      
    });
  });


