#!/usr/bin/env node

/* eslint-disable semi */
const mkdirp = require('mkdirp');
const { get } = require('https');
const { readFile, writeFile } = require('fs');

/**
 * Will lookup the argument in the cli arguments list and will return a
 * value passed as CLI arg (if found)
 * Otherwise will return default value passed
 * @param argName - name of hte argument to look for
 * @param defaultOutput - default value to return if could not find argument in cli command
 * @private
 */
const findArgument = (argName, defaultOutput) => {
  if (!argName) {
    return defaultOutput;
  }

  const index = process.argv.findIndex(a => a.match(argName));
  if (index < 0) {
    return defaultOutput;
  }

  try {
    return process.argv[index + 1];
  } catch (e) {
    return defaultOutput;
  }
}

const outputPath = findArgument('output', './coverage');
const inputPath = findArgument('input', './coverage/coverage-summary.json');

const getColour = (coverage) => {
  if (coverage < 80) {
    return 'red';
  }

  if (coverage < 90) {
    return 'yellow';
  }

  return 'brightgreen';
};

const reportKeys = ['lines', 'statements', 'functions', 'branches'];

const getBadge = (report, key) => {
  if (!(report && report.total && report.total[key])) {
    throw new Error('malformed coverage report');
  }

  coverage = (!report.total[key] || typeof report.total[key].pct !== 'number') ? 0 : report.total[key].pct;

  return getBadgeUrl(coverage, key);
}

const getAverageBadge = (report, inputString) => {
  let keys;
  if (inputString === 'all') {
    keys = reportKeys;
  } else {
    keys = inputString.split(',');
  }

  if (keys.length > 0) {
    let coverages = keys.map(key => {
      if (!(report && report.total && report.total[key])) {
        throw new Error('malformed coverage report');
      }

      return (!report.total[key] || typeof report.total[key].pct !== 'number') ? 0 : report.total[key].pct;
    });

    let averageCoverage = coverages.reduce((a, b) => (a+b)) / coverages.length;

    return getBadgeUrl(averageCoverage);
  }
  throw new Error('No keys given');
}

const getBadgeUrl = (coverage, key) => {
  return `https://img.shields.io/badge/Coverage${key ? encodeURI(':')+key : ''}-${coverage}${encodeURI('%')}-${getColour(coverage)}.svg`;
}

const download = (url, cb) => {
  get(url, (res) => {
    let file = '';
    res.on('data', (chunk) => {
      file += chunk;
    });
    res.on('end', () => cb(null, file));
  }).on('error', err => cb(err));
}

const writeBadgeInFolder = (res, key) => {
  writeFile(`${outputPath}/badge${key ? '-'+key : ''}.svg`, res, 'utf8', (writeError) => {
    if (writeError) {
      throw writeError;
    }
  });
}

const getBadgeByKey = report => (key) => {
  saveBadge(getBadge(report, key), key);
}

const saveBadge = (url, key) => {
  download(url, (err, res) => {
    if (err) {
      throw err;
    }
    mkdirp(outputPath, (folderError) => {
      if (folderError) {
        console.error(`Could not create output directory ${folderError}`);
      } else {
        writeBadgeInFolder(res, key);
      }
    })
  })
}

readFile(`${inputPath}`, 'utf8', (err, res) => {
  if (err) {
    throw err;
  }

  const report = JSON.parse(res);
  reportKeys.forEach(getBadgeByKey(report));

  let average = findArgument('average', '');

  if (average === undefined && process.argv.filter(a => a.match('average'))) {
    average = 'all';
  }
  if (average) {
    saveBadge(getAverageBadge(report, average), 'average');
  }
});
