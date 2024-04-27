// src/index.js

const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    const { fields, table } = parseQuery(query);
    try {
        const data = await readCSV(`${table}.csv`);
        // Filter the fields based on the query
        return data.map(row => {
            const filteredRow = {};
            fields.forEach(field => {
                filteredRow[field] = row[field];
            });
            return filteredRow;
        });
    } catch (error) {
        // Handle any errors related to reading the CSV file
        console.error('Error executing SELECT query:', error.message);
        throw error;
    }
}

module.exports = executeSELECTQuery;
