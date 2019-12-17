const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird')
const readAllPromises =  Promise.promisify(fs.readFile)
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
   counter.getNextUniqueId((err, id)=>{
    fs.writeFile(`${this.dataDir}/${id}.txt`, text, (err)=>{
      if (err)
        throw err;
      else
        callback(err, { id, text })
     });
    });
};

exports.readAll = (callback) => {
  fs.readdir(`${this.dataDir}`, (err, data)=>{
    if(err)
      { callback(err, []) }
    var result = _.map(data, fileName =>{
    var ids = path.basename(`${this.dataDir}/${fileName}`, '.txt')
      return readAllPromises(`${this.dataDir}/${ids}.txt`)
      .then(task => {
        return { id : ids,
                text: task.toString()
              };
        });
    })
    Promise.all(result)
    .then(
      final =>callback(null, final ),
      err => callback(err, null)
    )
})
};

exports.readOne = (id, callback) => {
 var fileName = path.join(this.dataDir,`${id}.txt`)
 fs.readFile(fileName,(err,data)=>{
   if(err){ callback(err,null)}else{
    callback(null,{id,text:data.toString()})
   }

 })
}

//       console.log( data.toString())
//       callback(null, { id, text: data.toString() })
//     };

// // console.log('testing = :',data.toString())
//   });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }



exports.update = (id, text, callback) => {
/*   var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  } */
  var fileName = path.join(this.dataDir,`${id}.txt`)
  fs.writeFile(fileName,text,(err,data)=>{
    if(err){ callback(err,null)}else{
     callback(null,{id,text:data.toString()})
    }

  })
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
