/**
 * TC Lottery Prototype - Mock Data Configuration
 *
 * All demo/mock data centralized here for easy modification.
 * Modify values below to change the prototype's display data.
 */
var MOCK = {

  // ---- User ----
  user: {
    balance: '2261.00',
    currency: '฿',
  },

  // ---- Countdown / Banner ----
  banner: {
    countdownHours: 30,          // Demo countdown: hours from now
    prize: '$888',
    initialDisplay: {            // HTML fallback before JS kicks in
      hours: '22',
      minutes: '09',
      seconds: '59',
      date: 'Mon, Dec 29, 2025',
    },
  },

  // ---- Number Selection Rules ----
  game: {
    totalBalls: 100,
    maxPerBall: 5,               // Each number can be selected max N times
    maxTotal: 10,                // Max total selections per round
    hotNumbers: [7, 12, 23, 38, 45, 56, 67, 77, 88, 99],
    playerCount: {
      hotMin: 5,
      hotMax: 24,                // random range for hot numbers
      normalMin: 1,
      normalMax: 4,              // random range for normal numbers
    },
  },

  // ---- History Page Stats ----
  historyStats: {
    totalBets: '10',
    winCount: '2',
    winRate: '20%',
    totalPrize: '100.00',
  },

  // ---- History Records ----
  historyRecords: [
    {
      period: '第 2024012 期',
      drawBall: 33,
      prizePool: '$10,000',
      winnersCount: 2,
      status: 'pending',         // pending | lost | won
      selected: [3, 8, 15, 22, 33, 33, 50, 50, 78, 90],
      winning: null,
    },
    {
      period: '第 2024012 期',
      drawBall: 33,
      prizePool: '$10,000',
      winnersCount: 2,
      status: 'lost',
      selected: [5, 11, 27, 33, 46, 50, 59, 72, 85, 96],
      winning: null,
    },
    {
      period: '第 2024012 期',
      drawBall: 33,
      prizePool: '$10,000',
      winnersCount: 2,
      status: 'lost',
      selected: [1, 14, 20, 33, 38, 50, 55, 68, 80, 92],
      winning: null,
    },
    {
      period: '第 2024012 期',
      drawBall: 33,
      prizePool: '$10,000',
      winnersCount: 2,
      status: 'won',
      selected: [7, 19, 24, 33, 43, 50, 61, 75, 83, 99],
      winning: 33,
    },
  ],

  // ---- Win Modal ----
  winModal: {
    ball: 33,
    totalPrize: '10,000',
    yourShare: '$3,333',
    winnersCount: 3,
  },
};
