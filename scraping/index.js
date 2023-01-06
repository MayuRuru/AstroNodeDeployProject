import * as cheerio from "cheerio";

/* const res = await fetch(URLS.board);
const html = await res.text(); */

const URLS = {
  board: "https://kingsleague.pro/estadisticas/clasificacion/",
};

// Function to abstract and reuse scraping method

async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

// Refactor

async function getBoardData() {
  const $ = await scrape(URLS.board);
  const $rows = $("table tbody tr");

  const BOARD_SELECTORS = {
    team: ".fs-table-text_3",
    wins: ".fs-table-text_4",
    loses: ".fs-table-text_5",
    scoredGoals: ".fs-table-text_6",
    concededGoals: ".fs-table-text_7",
    yellowCards: ".fs-table-text_8",
    redCards: ".fs-table-text_9",
  };

  const cleanText = (text) =>
    text.replace(/\t|\n|\s:/g, "").replace(/.*:/g, "");

  // Make entries from BOARD object so we can map with key-value
  // It will return an array of arrays key-value

  const boardSelectorEntries = Object.entries(BOARD_SELECTORS);

  $rows.each((index, el) => {
    const boardEntries = boardSelectorEntries.map(([key, selector]) => {
      const rawValue = $(el).find(selector).text();
      const value = cleanText(rawValue);
      return [key, value];
    });
    Object.fromEntries(boardEntries);
  });
}

await getBoardData();

// console.log($(el).text())
// const $el = $(el)

/* const rawTeam = $el.find('.fs-table-text_3').text()
    const rawWins = $el.find('.fs-table-text_4').text()
    const rawLoses = $el.find('.fs-table-text_5').text()
    const rawScoredGoals = $el.find('.fs-table-text_6').text()
    const rawConcededGoals = $el.find('.fs-table-text_7').text()
    const rawYellowCards = $el.find('.fs-table-text_8').text()
    const rawRedCards = $el.find('.fs-table-text_9').text() */

/* console.log(
      cleanText(rawTeam),
      cleanText(rawWins),
      cleanText(rawLoses),
      cleanText(rawScoredGoals),
      cleanText(rawConcededGoals),
      cleanText(rawYellowCards),
      cleanText(rawRedCards)
    ) */

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
