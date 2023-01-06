import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import TEAMS from "../db/teams.json";

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
    // convert in object to make it scalable
    team: { selector: ".fs-table-text_3", typeOf: "string" },
    wins: { selector: ".fs-table-text_4", typeOf: "number" },
    loses: { selector: ".fs-table-text_5", typeOf: "number" },
    scoredGoals: { selector: ".fs-table-text_6", typeOf: "number" },
    concededGoals: { selector: ".fs-table-text_7", typeOf: "number" },
    yellowCards: { selector: ".fs-table-text_8", typeOf: "number" },
    redCards: { selector: ".fs-table-text_9", typeOf: "number" },
  };

  const getTeamIdFrom = ({ name }) =>
    TEAMS.find((team) => team.name === name).id;

  const cleanText = (text) =>
    text
      .replace(/\t|\n|\s:/g, "")
      .replace(/.*:/g, " ")
      .trim();

  // Make entries from BOARD object so we can map with key-value
  // It will return an array of arrays key-value

  const boardSelectorEntries = Object.entries(BOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((index, el) => {
    const boardEntries = boardSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $(el).find(selector).text();
        const cleanedValue = cleanText(rawValue);

        const value = typeOf === "number" ? Number(cleanedValue) : cleanedValue;

        return [key, value];
      }
    );

    const leaderboardForTeam = Object.fromEntries(boardEntries);
    leaderboardForTeam.teamId = getTeamIdFrom(leaderboardForTeam);

    // console.log(Object.fromEntries(boardEntries));
    leaderboard.push(Object.fromEntries(boardEntries));
  });

  return leaderboard;
}

const leaderboard = await getBoardData();

// cwd from NODE indicates from where the script is executed - it has to be always the same:
const filePath = path.join(process.cwd(), "db", "leaderboard.json");

// this way we write the json file:
await writeFile(filePath, JSON.stringify(leaderboard, null, 2), "utf-8");

// console.log(filePath);
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
