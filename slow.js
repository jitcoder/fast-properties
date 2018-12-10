'use strict';
let v8 = require('v8');
let start = Date.now();
let fieldMap = {};
let amount = 2E5;
let cycles = 4;
for (let c = 0; c < cycles; c++) {
    fieldMap['a_'+c] = 'a'+c;
    fieldMap['b_'+c] = 'b_'+c;
    fieldMap['c_'+c] = 'c'+c;
}
let rowKeys = Object.keys(fieldMap);
let map = function(){};
for (let c = 0; c < cycles; c++) {
    map.prototype['a_'+c] = undefined;
    map.prototype['b_'+c] = undefined;
    map.prototype['c_'+c] = undefined;
}
let now = start.toString();
let vals = [];
for (let i = 0; i < amount; i++) {
    let proto = {};
    for (let c = 0; c < cycles; c++) {
        proto['a_'+c] = now + c + 'a';
        proto['b_'+c] = now + c + 'b';
        proto['c_'+c] = now + c + 'c';
    }
    vals.push(proto);
}
//end build initial data
for (let i = 0; i < amount; i++) {
    let item = vals[i];
    for (let key of rowKeys) {
        if (key !== fieldMap[key]) {
            item[fieldMap[key]] = item[key];
            delete item[key];
        }
    }
}
console.log(%HasFastProperties(vals[0]));
for (let i = 0; i < amount; i++) {
    let item = vals[i];
    for (let c = 0; c < cycles; c++) {
        item['c'+c] = now + c + 'e';
    }
}
/* adding keys will cause the V8 to create a new class transition
 * from our Map prototype and result in dictionary lookup */
/*
console.log(%HasFastProperties(vals[0]));
for (let i = 0; i < amount; i++) {
    let item = vals[i];
    for (let c = 0; c < cycles; c++) {
        item[i+'d'+c] = item[i+'a'+c];
    }
}
*/
console.log(Date.now() - start, %HasFastProperties(vals[0]), vals[0]);
let stats = v8.getHeapStatistics();
Object.keys(stats).forEach((key) => {
    stats[key] = parseFloat(stats[key]/1E6);
});
console.log(stats);
