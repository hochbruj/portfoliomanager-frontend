import firebase from '../config/fbConfig';
const API = require('../config/APIConfig');
const axios = require('axios');
const db = firebase.firestore();

export async function updateValuesBackground() {
  let msg = {};
  let offset;
  let dates = [];
  let date = new Date(); //today

  //calculte how many days before we get quotes
  if (date.getDay() === 1) {
    offset = 3;
  } else if (date.getDay() === 7) {
    offset = 2;
  } else {
    offset = 1;
  }
  date.setDate(date.getDate() - offset);
  date = date.toISOString().split('T')[0];

  //check if there was arleady a run
  const lastRun = await getLastRun();
  if (date === lastRun) {
    msg.message = 'Values were already updated on: ' + lastRun;
    msg.type = 'success';
  } else {
    // do the update run
    dates[0] = date;
    console.log('calling add values with', dates.toString());
    try {
      const result = await addValues(dates);
      msg.message = 'Values succesfully updated for date: ' + dates.toString();
      msg.type = 'success';
    } catch (err) {
      msg.type = 'error';
      msg.message = err.toString();
    }
  }
  return msg;
}

async function addValues(dates) {
  //1. Get all positions
  let msg = {};
  let positions = [];
  let position = {};
  let quote;

  const querySnapshot = await db.collection('positions').get();
  querySnapshot.forEach((doc) => {
    position = doc.data();
    position.id = doc.id;
    positions.push(position);
  });

  //2. get quotes

  //get single itmes so we don't need to do same AI calls
  let items = Array.from(new Set(positions.map((s) => s.item)));
  //remove the USD from list
  items = items.filter((e) => {
    return e !== 'USD';
  });
  //add the categories
  items = items.map((item) => {
    return {
      item: item,
      category: positions.find((s) => s.item === item).category,
    };
  });

  let itemObject = {};

  for (const item of items) {
    // console.log('trying to get quotes for', item.item);

    const quotes = await getQuotes(item.category, item.item, dates);
    itemObject[item.item] = quotes;
    // console.log('got quotes for', item.item, quotes);
  }

  msg.itemObject = itemObject;

  //now store documents in firestore
  dates.forEach((date) => {
    for (const position of positions) {
      // console.log('reading quote for', position.item);
      if (position.item === 'USD') {
        quote = 1;
      } else if (position.item.slice(-2) === 'AX') {
        quote = itemObject[position.item][date] * itemObject['AUD'][date];
      } else {
        quote = itemObject[position.item][date];
      }

      // console.log(
      //   'writing to db',
      //   position.id,
      //   position.category,
      //   position.item,
      //   quote
      // );

      db.collection('values')
        .add({
          positionId: position.id,
          portfolioId: position.portfolioId,
          amount: position.amount,
          quote: quote,
          date: new Date(date),
        })
        .then((ref) => {
          // console.log('Added document with ID: ', ref.id);
        });
    }

    // add date in fetchedQuotes
    db.collection('fetchedQuotes')
      .doc('dates')
      .update({
        dates: firebase.firestore.FieldValue.arrayUnion(new Date(date)),
      });
  });

  msg.positionsCount = positions.length;

  return msg;
}

async function getQuotes(category, item, dates) {
  let values = {};
  let url;
  let result, resultObj, resultArr;

  switch (category) {
    case 'Stock Short':
    case 'Stock Long':
      url = API.alpha.url + API.alpha.stock + item + API.alpha.key;
      try {
        result = await axios.get(url);
      } catch (err) {
        throw "Couldn't get stock quote for " + item;
      }
      resultObj = result.data['Time Series (Daily)'];
      if (resultObj == null) {
        throw "Couldn't get stock quote for " + item;
      }
      for (var date of dates) {
        if (resultObj[date]) {
          values[date] = parseFloat(resultObj[date]['4. close']);
        } else {
          throw "Couldn't get quote for " + item + ' on ' + date;
        }
      }
      //we need to wait because of API 5 per minute limit
      await sleep(15000);
      break;
    case 'Cash':
      url =
        API.alpha.url + API.alpha.FX1 + item + API.alpha.FX2 + API.alpha.key;
      try {
        result = await axios.get(url);
      } catch (err) {
        throw "Couldn't get currency quote for " + item;
      }
      resultObj = result.data['Time Series FX (Daily)'];
      if (resultObj == null) {
        throw "Couldn't get currency quote for " + item;
      }
      for (var date of dates) {
        values[date] = parseFloat(resultObj[date]['4. close']);
      }
      await sleep(15000);
      break;
    case 'Cryptocurrency':
      url = API.coinapi.url + item + API.coinapi.key;
      try {
        result = await axios.get(url);
      } catch (err) {
        throw "Couldn't get crypto quote for " + item;
      }
      if (result.data.rate == null) {
        throw "Couldn't get crypto quote for " + item;
      }
      for (var date of dates) {
        values[date] = parseFloat(result.data.rate);
      }
      break;
    case 'Precious Metals':
      url = API.quandl.url + item + API.quandl.key + API.quandl.start;
      try {
        result = await axios.get(url);
      } catch (err) {
        throw "Couldn't get metal quote for " + item;
      }
      resultArr = result.data['dataset_data']['data'];
      if (resultArr == null) {
        throw "Couldn't get metal quote for " + item;
      }
      resultArr.map((item) => {
        values[item[0]] = item[1];
      });
      break;
  }
  return values;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getLastRun() {
  return new Promise(function(resolve, reject) {
    db.collection('fetchedQuotes')
      .doc('dates')
      .get()
      .then(function(doc) {
        let dates = doc.data().dates;
        dates.sort(function(a, b) {
          return b.seconds - a.seconds;
        });
        return resolve(
          new Date(dates[0].seconds * 1000).toISOString().split('T')[0]
        );
      })
      .catch(function(error) {
        return reject(error);
      });
  });
}
