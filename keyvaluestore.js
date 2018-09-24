var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var db = new AWS.DynamoDB();

function keyvaluestore(table) {
  this.LRU = require("lru-cache");
  this.cache = this.LRU({ max: 500 });
  this.tableName = table;
};

/**
 * Initialize the tables
 *
 */
keyvaluestore.prototype.init = function(whendone) {

  var tableName = this.tableName;
  var self = this;

  db.describeTable({TableName : tableName}, function (err, data) {
    if (err) {
      var params = {
          AttributeDefinitions: [
            {
            AttributeName: "keyword",
            AttributeType: "S"
            },
            {
            AttributeName: "inx",
            AttributeType: "N"
            }
          ],
          KeySchema: [
            {
            AttributeName: "Keyword",
            KeyType: "HASH"
            },
            {
            AttributeName: "inx",
            KeyType: "RANGE"
            }
          ],
          ProvisionedThroughput: {
           ReadCapacityUnits: 1,
           WriteCapacityUnits: 1
          },
          TableName: tableName
        };
      db.createTable(params, function (err, data) {
        if (err) {
          console.log(err);
        }
      })
    }
    else {
      //console.log(data);
    }
  })
  whendone(); //Call Callback function.
};

/**
 * Get result(s) by key
 *
 * @param search
 *
 * Callback returns a list of objects with keys "inx" and "value"
 */

keyvaluestore.prototype.get = function(search, callback) {
  var self = this;

  if (self.cache.get(search))
        callback(null, self.cache.get(search));
  else {
        var searchValues = search.split(" ");
        var resultValues = [];
        searchValues.forEach(function (value) {

          var params = {
            ExpressionAttributeValues: {
             ":v1": {
               S: value
              }
            },
            KeyConditionExpression: "keyword = :v1",
            TableName: self.tableName
           };

          db.query(params, function (err, data) {
                if (err) {
                  console.log(err);
                }
                else {

                  data.Items.forEach(function (item) {
                    resultValues.push({
                      "inx": item.inx.N,
                      "value": item.Value.S,
                      "key": item.keyword.S
                    });
                  })
                  self.cache.set(search, resultValues);
                //  console.log(resultValues);
                  callback(err, resultValues)
                }
          })
        })

    /*
     *
     * La función QUERY debe generar un arreglo de objetos JSON son cada
     * una de los resultados obtenidos. (inx, value, key).
     * Al final este arreglo debe ser insertado al cache. Y llamar a callback
     *
     * Ejemplo:
     *    var items = [];
     *    items.push({"inx": data.Items[0].inx.N, "value": data.Items[0].value.S, "key": data.Items[0].key});
     *    self.cache.set(search, items)
     *    callback(err, items);
     */




  }
};


module.exports = keyvaluestore;