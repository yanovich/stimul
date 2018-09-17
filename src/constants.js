
export const colors = {
  blue: {
    deep: 'rgb(0, 121, 191)',
    light: 'lightblue',
    lighter: '#d9fcff',
    soft: '#E6FCFF',
  },
  black: '#4d4d4d',
  shadow: 'rgba(0,0,0,0.2)',
  grey: {
    darker: '#C1C7D0',
    dark: '#E2E4E6',
    medium: '#DFE1E5',
    N30: '#EBECF0',
    light: '#F4F5F7',
  },
  green: 'rgb(185, 244, 188)',
  white: 'white',
  purple: 'rebeccapurple',
};

export const quf = (query) =>{
  return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query
      })
    })
      .then(r => r.json())
      .then(data => data)
};

export const grid = 8;

export const borderRadius = 2;

export const url = 'http://185.168.187.103:8500/graphql';
