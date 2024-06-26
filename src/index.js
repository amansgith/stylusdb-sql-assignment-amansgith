// src/index.js

const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    const { fields, table, whereClauses } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);

    // Apply WHERE clause filtering
    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => {
            // Expand this to handle different operators
            switch (clause.operator) {
                case '=':
                    return row[clause.field] === clause.value;
                case '!=':
                    return row[clause.field] !== clause.value;
                case '>':
                    return row[clause.field] > clause.value;
                case '<':
                    return row[clause.field] < clause.value;
                case '>=':
                    return row[clause.field] >= clause.value;
                case '<=':
                    return row[clause.field] <= clause.value;
                default:
                    throw new Error('Unsupported operator');
            }
        }))
        : data;

    // Select the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            if (row.hasOwnProperty(field)) {
                selectedRow[field] = row[field];
            } else {
                throw new Error(`Field ${field} does not exist in the data`);
            }
        });
        return selectedRow;
    });
}

module.exports = executeSELECTQuery;
