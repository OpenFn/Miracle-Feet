const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./mappings/content-input.json'));

const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

const result = groupBy(data, 'Name');

Object.keys(result).map(type => {
  const cleaned = result[type].map(x => {
    delete x['Name'];
    delete x['# Alert'];
    delete x['# SMS'];
    Object.keys(x).map(lang => {
      if (lang.length <= 3) {
        // This is how we identify language keys
        x[lang] = x[lang].split(/[{}]+/).map(bit => {
          if (bit.startsWith('case.')) {
            // These should not be nested inside "case"
            return bit.substring(5);
          }
          return bit;
        });
      }
      return lang;
    });
    return x;
  });
  result[type] = cleaned;
});

fs.writeFileSync(
  './mappings/content-output.json',
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  './mappings/content-output-minified.js',
  `const mapping=${JSON.stringify(result)})`
);