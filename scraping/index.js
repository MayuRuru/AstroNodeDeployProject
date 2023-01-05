import * as cheerio from 'cheerio'

/* const res = await fetch(URLS.board);
const html = await res.text(); */

const URLS = {
  board: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

// Function to abstract and reuse scraping method

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

// Refactor

async function getBoardData() {
  // Using Cheerio to retrieve data for our API
  const $ = await scrape(URLS.board)
  const $rows = $('table tbody tr')

  const cleanText = text => text.replace(/\t|\n|\s:/g, '').replace(/.*:/g, '')

  $rows.each((index, el) => {
    // console.log($(el).text())

    const $el = $(el)
    const rawTeam = $el.find('.fs-table-text_3').text()
    const rawWins = $el.find('.fs-table-text_4').text()
    const rawLoses = $el.find('.fs-table-text_5').text()
    const rawScoredGoals = $el.find('.fs-table-text_6').text()
    const rawConcededGoals = $el.find('.fs-table-text_7').text()
    const rawYellowCards = $el.find('.fs-table-text_8').text()
    const rawRedCards = $el.find('.fs-table-text_9').text()

    console.log(
      cleanText(rawTeam),
      cleanText(rawWins),
      cleanText(rawLoses),
      cleanText(rawScoredGoals),
      cleanText(rawConcededGoals),
      cleanText(rawYellowCards),
      cleanText(rawRedCards)
    )
  })
}

// Design API:
/* 
const board = [{
    team: 'Team 1',
    wins: 0,
    loses: 0,
    scoredGoals: 0,
    concededGoals: 0,
    yellowCards: 0,
    redCards: 0
  }]
 */