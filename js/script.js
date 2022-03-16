// Não se preocupem, vou melhorar o código com o tempo

const initial_words = [
  'Node', 'Next',
  'Jest', 'Git',
  'CSS', 'HTML',
  'Javascript',
]

let words = Object.assign({}, initial_words)

function generateCrosswords() {
  let crosswords = []

  let random_number, random_word, splitted_word
  
  // FOR para testes (não entrar em loop)
  for (let x = 0; x < 2; x++) {
    random_number = Math.floor(Math.random() * (Object.keys(words).length - 1))
    random_word = words[random_number]?.toLowerCase()
    if (random_word === undefined) continue
    splitted_word = random_word.split('')

    // Caso seja a primeira palavra adicionar ao jogo e deleta-la da lista
    if (crosswords.length === 0) {
      crosswords.push(splitted_word)
      delete words[random_number]
      continue
    }

    const flat_crosswords = crosswords.flat()
    
    let word_copy = random_word
    let letters_included = flat_crosswords.map((letter, crossword_letter_position) => {
      let word_letter_position = word_copy.indexOf(letter)
      if (word_letter_position == -1) return false
      word_copy[word_letter_position] = '-'
      return {
        letter,
        crossword_letter_position,
        word_letter_position
      }
    })

    let crosswords_history = []
    let scores_history = []
    
    letters_included.forEach(obj => {
      if (!obj) return
      let crosswords_copy = JSON.parse(JSON.stringify(crosswords)) // Cópia do array (palavras cruzadas) para verificar disponibilidades
      let horizontal_size = crosswords[0].length
      let [ vertical_position, horizontal_position ] = Number(obj.crossword_letter_position / horizontal_size).toFixed(2).toString().split('.')
      horizontal_position = parseInt((horizontal_position / 10) * Number(horizontal_size))

      let scores = {
        match: 0,
        size: 0,
      } // No final o jogo com menor tamanho e com mais cruzadas é eleito
      
      let crosswords_padding = {
        top: Number(obj.word_letter_position) - Number(vertical_position),
        bottom: (random_word.length - Number(obj.word_letter_position)) - (crosswords_copy.length - Number(vertical_position))
      } // Espaços restantes

      const fillSize = () => Array(horizontal_size).fill('')
      for (let p = 0; p < crosswords_padding.top + crosswords_padding.bottom; p++) {
        if (crosswords_padding.top-p > 0) crosswords_copy.unshift(fillSize())
        if (crosswords_padding.bottom-p > 0) crosswords_copy.push(fillSize())
      } // Aumenta o tamanho do jogo caso a palavra seja maior que o espaço disponível

      // Compensa o eixo Y com a medida possivelmente adicionada anteriormente
      vertical_position = Number(vertical_position) + crosswords_padding.top

      for (let i=0; i<random_word.length; i++) {
        let selected_letter = crosswords_copy[vertical_position - obj.word_letter_position + i][horizontal_position]
        if (selected_letter == '') {
          crosswords_copy[vertical_position - obj.word_letter_position + i][horizontal_position] = random_word[i] || ''
        } else if (random_word[i]) {
          scores.match += 1
        }
      }

      crosswords_history.push(crosswords_copy)
      scores_history.push(scores)

      console.table(crosswords_copy)
    })
  }
}

generateCrosswords()