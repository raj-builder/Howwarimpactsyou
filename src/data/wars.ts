import type { WarId, War } from '@/types'

export const WARS: Record<WarId, War> = {
  'ukraine-russia': {
    name: 'Russia\u2013Ukraine War',
    dates: 'Feb 2022 \u2013 Present (ongoing)',
    live: true,
    shocks: [
      { factor: '\uD83C\uDF3E Wheat', val: '+38%' },
      { factor: '\u26A1 Natural Gas', val: '+220%' },
      { factor: '\uD83C\uDF31 Fertilizer', val: '+65%' },
      { factor: '\u26A1 Brent', val: '+22%' },
      { factor: '\uD83E\uDE99 FX volatility', val: 'High' },
    ],
    rankings: {
      bread: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 41.3 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 24.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 21.7 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 19.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 18.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 6.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 7.3 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.3 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 9.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 11.4 },
        ],
      },
      dairy: {
        top5: [
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 31.8 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 26.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 22.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 19.5 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 14.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 5.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 6.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 7.9 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.7 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 10.3 },
        ],
      },
      eggs: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 28.6 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 24.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 20.7 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 17.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 15.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 6.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 7.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.9 },
        ],
      },
      rice: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 22.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 18.7 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 16.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 13.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 11.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.9 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 5.7 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 6.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.1 },
        ],
      },
      oil: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 52.1 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 38.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 33.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 29.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 26.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 8.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 11.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 14.7 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 16.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 19.8 },
        ],
      },
      vegetables: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 18.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 15.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 14.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 12.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 11.3 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.5 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 9.7 },
        ],
      },
      meat: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 24.6 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 21.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 18.9 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 16.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 13.7 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 5.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 7.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 8.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 9.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 10.6 },
        ],
      },
      detergent: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 19.8 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 17.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 15.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 13.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 11.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.9 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 6.3 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 8.8 },
        ],
      },
      fuel: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 32.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 28.7 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 24.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 21.3 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 18.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 6.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 8.9 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.2 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 11.2 },
        ],
      },
      basket: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 34.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 27.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 23.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 20.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 17.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 6.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 8.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 9.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 10.7 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 13.2 },
        ],
      },
    },
  },
  'iran-israel-us': {
    name: 'Iran\u2013Israel\u2013US Conflict',
    dates: 'Apr 2024 \u2013 Present (ongoing)',
    live: true,
    shocks: [
      { factor: '\u26A1 Brent Crude', val: '+18%' },
      { factor: '\uD83D\uDEA2 Shipping', val: '+45%' },
      { factor: '\u26A1 Natural Gas', val: '+12%' },
      { factor: '\uD83E\uDE99 FX pressure', val: 'Moderate' },
    ],
    rankings: {
      bread: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 22.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 18.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 15.7 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 13.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.6 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.9 },
        ],
      },
      dairy: {
        top5: [
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 16.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 14.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.3 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 10.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 8.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.3 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.2 },
        ],
      },
      eggs: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 14.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 11.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 9.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 5.6 },
        ],
      },
      rice: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.1 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 10.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 8.7 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.3 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 6.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 2.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.8 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.9 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 4.7 },
        ],
      },
      oil: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 26.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 21.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 18.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 15.6 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 13.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.7 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 6.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 7.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 9.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.8 },
        ],
      },
      vegetables: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 11.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 9.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 8.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.3 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 5.2 },
        ],
      },
      meat: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 16.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 14.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 12.7 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 10.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 8.9 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 6.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 7.3 },
        ],
      },
      detergent: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 10.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 9.3 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.9 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.3 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 5.4 },
        ],
      },
      fuel: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 28.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 24.7 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 19.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 16.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 15.3 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 5.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 6.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 9.7 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 11.4 },
        ],
      },
      basket: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 19.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 16.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 14.1 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 11.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 9.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.7 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 6.3 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 7.8 },
        ],
      },
    },
  },
  'gaza-2023': {
    name: 'Gaza War / Red Sea Crisis',
    dates: 'Oct 2023 \u2013 Present',
    live: false,
    shocks: [
      { factor: '\uD83D\uDEA2 Shipping costs', val: '+340%' },
      { factor: '\u26A1 Brent', val: '+12%' },
      { factor: '\uD83E\uDE99 Commodity FX', val: 'Volatile' },
    ],
    rankings: {
      bread: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 18.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 13.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 11.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 9.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 8.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.6 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.4 },
        ],
      },
      dairy: {
        top5: [
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 12.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 11.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 9.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 6.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.7 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 4.8 },
        ],
      },
      eggs: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 10.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 9.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 8.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.9 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.4 },
        ],
      },
      rice: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 9.2 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 7.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 6.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 5.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 4.7 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 1.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.1 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 3.8 },
        ],
      },
      oil: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 22.3 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 18.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 14.7 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 12.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 6.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.8 },
        ],
      },
      vegetables: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 8.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 7.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 6.3 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 5.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 4.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 2.7 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.1 },
        ],
      },
      meat: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 12.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 10.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 9.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 6.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.9 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.7 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.6 },
        ],
      },
      detergent: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 9.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 8.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 7.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 6.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.7 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.3 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 2.9 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.2 },
        ],
      },
      fuel: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 16.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 14.7 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 12.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 11.9 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 9.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.4 },
        ],
      },
      basket: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 14.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 10.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.8 },
        ],
      },
    },
  },
  'covid': {
    name: 'COVID-19 Supply Shock',
    dates: 'Jan 2020 \u2013 Dec 2021',
    live: false,
    shocks: [
      { factor: '\u26A1 Oil', val: '\u201340% then +90%' },
      { factor: '\uD83C\uDF3E Grains', val: '+25%' },
      { factor: '\u2699\uFE0F Metals', val: '+35%' },
      { factor: '\uD83D\uDEA2 Shipping', val: '+180%' },
    ],
    rankings: {
      bread: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 22.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 18.6 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 16.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 14.3 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 11.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 6.3 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.7 },
        ],
      },
      dairy: {
        top5: [
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 18.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 16.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 13.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 11.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 9.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 6.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 7.6 },
        ],
      },
      eggs: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 16.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 14.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 12.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 10.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 3.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 6.8 },
        ],
      },
      rice: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 14.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 12.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 10.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 8.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 7.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.4 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.1 },
        ],
      },
      oil: {
        top5: [
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 34.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 29.8 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 26.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 22.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 16.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 6.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 8.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 10.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 12.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 14.6 },
        ],
      },
      vegetables: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.8 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 10.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 9.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 7.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 5.6 },
        ],
      },
      meat: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 18.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 15.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 13.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 11.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 9.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 5.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 6.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.1 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.2 },
        ],
      },
      detergent: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 14.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 12.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 10.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 9.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 8.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 6.4 },
        ],
      },
      fuel: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 26.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 22.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 19.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 16.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 14.2 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 5.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 7.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 12.4 },
        ],
      },
      basket: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 21.6 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 18.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 15.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 13.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 11.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 6.9 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 9.2 },
        ],
      },
    },
  },
  'gulf-2003': {
    name: 'Iraq War / Gulf Oil Shock',
    dates: 'Mar 2003 \u2013 Dec 2004',
    live: false,
    shocks: [
      { factor: '\u26A1 Brent Crude', val: '+45%' },
      { factor: '\uD83E\uDE99 USD weakness', val: '\u201312%' },
      { factor: '\u2699\uFE0F Metals', val: '+28%' },
    ],
    rankings: {
      bread: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 16.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 13.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 11.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 9.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.4 },
        ],
      },
      dairy: {
        top5: [
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 14.1 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 12.4 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 10.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 6.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.9 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.1 },
        ],
      },
      eggs: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 10.6 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 9.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 7.8 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 6.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.2 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.2 },
        ],
      },
      rice: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 8.4 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 7.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 5.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 4.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 3.9 },
        ],
        bot5: [
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 1.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 1.9 },
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 2.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 3.2 },
        ],
      },
      oil: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 24.8 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 21.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 17.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 14.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 12.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 7.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 8.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 10.2 },
        ],
      },
      vegetables: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 7.8 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 6.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 5.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 4.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 4.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.2 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 1.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 2.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 3.6 },
        ],
      },
      meat: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 14.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 11.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 10.4 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.6 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.1 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 3.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 4.1 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 4.8 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 5.8 },
        ],
      },
      detergent: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 8.6 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 7.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 6.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 5.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 4.6 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 1.4 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 2.1 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 2.6 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 3.2 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 3.8 },
        ],
      },
      fuel: {
        top5: [
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 21.5 },
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 18.9 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 15.4 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 14.1 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 12.8 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 4.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 5.8 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 7.2 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.4 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 10.2 },
        ],
      },
      basket: {
        top5: [
          { f: '\uD83C\uDDEA\uD83C\uDDEC', c: 'Egypt', p: 15.2 },
          { f: '\uD83C\uDDF3\uD83C\uDDEC', c: 'Nigeria', p: 12.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDF0', c: 'Pakistan', p: 10.6 },
          { f: '\uD83C\uDDF9\uD83C\uDDF7', c: 'T\u00FCrkiye', p: 8.8 },
          { f: '\uD83C\uDDF5\uD83C\uDDED', c: 'Philippines', p: 7.4 },
        ],
        bot5: [
          { f: '\uD83C\uDDE7\uD83C\uDDF7', c: 'Brazil', p: 2.8 },
          { f: '\uD83C\uDDEE\uD83C\uDDE9', c: 'Indonesia', p: 3.6 },
          { f: '\uD83C\uDDEE\uD83C\uDDF3', c: 'India', p: 4.4 },
          { f: '\uD83C\uDDF2\uD83C\uDDE6', c: 'Morocco', p: 5.2 },
          { f: '\uD83C\uDDFA\uD83C\uDDE6', c: 'Ukraine', p: 6.4 },
        ],
      },
    },
  },
} as const

/** Flat list for easy iteration over all wars */
export const WAR_LIST: { id: WarId; name: string; dates: string; live: boolean }[] = (
  Object.entries(WARS) as [WarId, War][]
).map(([id, w]) => ({
  id,
  name: w.name,
  dates: w.dates,
  live: w.live,
}))
