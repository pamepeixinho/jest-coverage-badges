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

  const index = process.argv.findIndex(a => a.match(argName))
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

  const coverage = report.total[key].pct;
  const colour = getColour(coverage);

  return `https://img.shields.io/badge/Coverage${encodeURI(':')}${key}-${coverage}${encodeURI('%')}-${colour}.svg`;
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

const writeBadgeInFolder = (key, res) => {
  writeFile(`${outputPath}/badge-${key}.svg`, res, 'utf8', (writeError) => {
    if (writeError) {
      throw writeError;
    }
  });
}

const getBadgeByKey = report => (key) => {
  const url = getBadge(report, key);

  download(url, (err, res) => {
    if (err) {
      throw err;
    }
    mkdirp(outputPath, (folderError) => {
      if (folderError) {
        console.error(`Could not create output directory ${folderError}`);
      } else {
        writeBadgeInFolder(key, res);
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
});
