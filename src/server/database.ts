import { promisify } from 'node:util';
import * as _ from 'sqlite3'
const db = new _.Database('rictcal.db')

function _useKeepConnection() {
    const s = db.run(`select 1`)
    return s
}

export {
    _useKeepConnection
}