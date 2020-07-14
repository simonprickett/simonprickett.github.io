const fs = require('fs');
const glob = require('glob');

// TODO make this configurable through env vars...
const BASE_URL = 'https://simonprickett.dev'

const getKeyValue = (key, arr) => {
  const toFind = `${key}:`;

  for (const line of arr) {
    if (line.startsWith(toFind)) {
      return line.substring(toFind.length).trim().split('"').join('');
    }
  }
};

const getExcerpt = (arr) => {
  for (let n = 1; n < arr.length -2; n++) {
    if (arr[n].startsWith('---')) {
      return arr[n + 1];
    }
  }
};

const getUrlFromFileName = (fileName) => {
  return `${fileName.substring(21, fileName.length - 3)}`;
};

try {
  const postFileNames = glob.sync("../_posts/*.md");

  const latestPostFileName = postFileNames[postFileNames.length - 1];
  const latestPostData = fs.readFileSync(latestPostFileName, 'UTF-8');
  const latestPostLines = latestPostData.split(/\r?\n/);
  
  const title = getKeyValue('title', latestPostLines);
  const imageUrl = `${BASE_URL}/${getKeyValue('image', latestPostLines)}`;
  const excerpt = getExcerpt(latestPostLines);
  const url = `${BASE_URL}/${getUrlFromFileName(latestPostFileName)}/`;
  
  console.log(title);
  console.log(imageUrl);
  console.log(url);
  console.log(excerpt);

  // TODO get template README and update it...
} catch (err) {
  console.error(err);
}