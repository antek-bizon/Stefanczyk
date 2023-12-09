import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('SqliteApp.db')
const alarmTableName = 'alarms'
const errCallback = e => console.error(e)

export function createTable () {
  db.transaction(tx => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS 
    ${alarmTableName}(id integer primary key not null, alarm text);`)
  }, errCallback)
}

export function add (json) {
  if (typeof json !== 'string') {
    console.error('Not a string:', json)
    return
  }
  db.transaction(tx => {
    tx.executeSql(`INSERT INTO ${alarmTableName}(alarm) 
    VALUES ('${json}');`)
  }, errCallback)
}

export function update (id, json) {
  db.transaction(tx => {
    tx.executeSql(`UPDATE ${alarmTableName} 
    SET alarm ='${json}' WHERE (id = ${id});`)
  }, errCallback)
}

export function getAll () {
  const query = `SELECT * FROM ${alarmTableName};`

  return new Promise((resolve, reject) => db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      resolve(results)
    }, function (tx, error) {
      reject(error)
    })
  }, errCallback))
}

export function remove (id) {
  db.transaction(tx => {
    tx.executeSql(`DELETE FROM ${alarmTableName}
    WHERE (id = ${id});`)
  }, errCallback)
}

export function clear () {
  db.transaction(tx => {
    tx.executeSql(`DROP TABLE ${alarmTableName};`)
  }, errCallback)
}
