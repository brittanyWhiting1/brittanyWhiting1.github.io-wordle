const tileDisplay = document.querySelector('.tile-container')

const keyboard = document.querySelector('.key-container')

const messageDisplay = document.querySelector('.message-container')

let wordle
const getWordle = () => {
    
    fetch('http://localhost:3000/word')
    .then(response => response.json())
    .then(json => {
        console.log(json)
        wordle = json.toUpperCase()
    })
    .catch(err => console.log(err))
}
getWordle()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]


const guessRows = [
    ['', '', '', '', '' ],
    ['', '', '', '', '' ],
    ['', '', '', '', '' ],
    ['', '', '', '', '' ],
    ['', '', '', '', '' ],
    ['', '', '', '', '' ]
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowEle = document.createElement('div')
    rowEle.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileELe = document.createElement('div')
        tileELe.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileELe.classList.add('tile')
        rowEle.append(tileELe)
    })

    tileDisplay.append(rowEle)
})

keys.forEach(key => {
    const buttonEle = document.createElement('button')
    buttonEle.textContent = key
    buttonEle.setAttribute('id', key)
    buttonEle.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonEle)
})

const handleClick = (letter) => {
    // console.log('clicked', key)
    if(letter == '«'){
        deleteLetter()
        return
    }
    if(letter == 'ENTER'){
        checkRow()
        return
    }
    addLetter(letter)

}
const addLetter = (letter) => {
    if(currentTile < 5 && currentRow < 6) {
        const tile =  document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
   
}

const deleteLetter = () => {
    if(currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
   
}
const checkRow = () => {
    const guess = guessRows[currentRow].join('')
    if(currentTile > 4) {
        flipTile()
     if(wordle == guess) {
        showMessage('You did it!!')
        isGameOver = true
        return
     } else {
        if (currentRow >= 5) {
            isGameOver = true
            showMessage('Game Over answer was  ' + wordle)
            return
        }
        if(currentRow < 5){
            currentRow++
            currentTile = 0
        }
     }
    }
}

const showMessage = (message) => {
    const messageEle = document.createElement('p')
    messageEle.textContent = message
    messageDisplay.append(messageEle)
    setTimeout(() => messageDisplay.removeChild(messageEle), 4000)
}

const addColorToKey = (keyLetter, color) => {
   const key = document.getElementById(keyLetter)
   key.classList.add(color)
}

const flipTile = () => {
   const rowTiles =  document.querySelector('#guessRow-' + currentRow).childNodes
   let checkWordle = wordle
   const guess = []

   rowTiles.forEach(tile => {
    guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
   })

   guess.forEach((guess, index) => {
    if(guess.letter == wordle[index]) {
        guess.color = 'green-overlay'
        checkWordle = checkWordle.replace(guess.letter, '')
    }
   })

   guess.forEach(guess => {
    if(checkWordle.includes(guess.letter)){
        guess.color = 'yellow-overlay'
        checkWordle = checkWordle.replace(guess.letter, '')
    }
   })
   rowTiles.forEach((tile, index) => {
   setTimeout(() => {
    tile.classList.add('flip')
    tile.classList.add(guess[index].color)
    addColorToKey(guess[index].letter, guess[index].color)
   }, 500 * index)

   })
}


