var dict = []

function getUserTries(){
    var count=0;
    var correct =0;
    const gameDiv = document.getElementsByTagName('GAME-APP')[0].shadowRoot.childNodes[3].childNodes[1].getElementsByTagName('div')[4]
    for (var i = 0; i < 6; i++) {
        row = gameDiv.childNodes[i]
        if (row.getAttribute('letters') != "" && row.shadowRoot.childNodes[3].childNodes[0].hasAttribute('evaluation')) {
            count=count+1;
            correct = 0
            for(var j=0; j<5; j++){
                if(row.shadowRoot.childNodes[3].childNodes[j].getAttribute('evaluation') == "correct"){
                    correct = correct + 1;
                }
                else{
                    break;
                }
            }
        }
        else {
            break
        }
    }
    return [count, correct]
}

function getGuessAndColors(tries){
    const gameDiv = document.getElementsByTagName('GAME-APP')[0].shadowRoot.childNodes[3].childNodes[1].getElementsByTagName('div')[4]
    var guesses = []
    var colors = []

    for (var i = 0; i < tries; i++) {
        row = gameDiv.childNodes[i]
        tiles = row.shadowRoot.childNodes[3]
        var guess = ''
        var color = ''
        for (var j = 0; j < 5; j++) {
            tile = tiles.childNodes[j]
            letter = tile.getAttribute('letter')
            evaluation = tile.getAttribute('evaluation')
            guess= guess + letter
            color = color + evaluation[0]
        }
        guesses.push(guess)
        colors.push(color)        
    }

    return [guesses, colors]

}



chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    const state = getUserTries()
    var guesses = []
    var colors = []
    if(state[0]>0 && state[0]<6){
        const progress = getGuessAndColors(state[0])
        guesses = progress[0]
        colors = progress[1]
    }
    response = [state, guesses, colors]
    
    sendResponse(response);
});