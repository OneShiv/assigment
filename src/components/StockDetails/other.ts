import {
  GET_GLOBAL_QUOTE,
  GET_STOCK_INTRADAY,
  GET_STOCK_OVERVIEW,
  INTERVAL_ONE_HOUE,
} from "../../api/constants";

function multiFetcher(urls: string[]) {
  return Promise.all(urls.map((url) => fetch(url)));
}

const queryParms = [
  `${GET_STOCK_OVERVIEW}&symbol=TSLA`,
  `${GET_STOCK_INTRADAY}${INTERVAL_ONE_HOUE}&symbol=TSLA`,
  `${GET_GLOBAL_QUOTE}&symbol=TSLA`,
];
