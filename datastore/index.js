const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
      callback(err, [])
    else {
      var result = data.map(fileName =>{
         var ids  = fileName.slice(0, fileName.length-4)
         fs.readFile(`${this.dataDir}/${ids}.txt`, (err,task)=>{
        if (err) throw err;
            // console.log(task.toString())
        console.log({ id : ids, text: task + '' })
         return JSON.stringify({ id : ids, text: task + '' })
        // console.log( "test----",{ id : x, text: text.toString() })
         }) 
        // })
         
       })
      callback(null, result )
    }
  })


// console.log() 
  // var data = _.map(items, (text, id) => {

  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var found = false; 
  fs.readdir(`${this.dataDir}`,(err, data)=> {
    data.forEach((element,i) => {
      if (element === `${id}.txt`) {
        found = true
        callback(null,id)
      } else if(i === data.length -1 && !found)  {
        callback(new Error(`No item with id: ${id}`,null));
      }
    })
})
      
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
    
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
