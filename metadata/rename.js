require('dotenv').config();

const fs = require('fs');
const recursive = require('recursive-fs');

const rename = async() => {
  const src = './json';
  recursive.readdirr(src, function (err, dirs, files) {
    files.forEach((file) => {
      var name = file.split("/");
      name = name[name.length-1];
      if (Number(name) > 0) {
        fs.rename(file, './json/'+Number(name), function(err) {});
      }
    });
  });
}

// upload10k();
rename();