// src/queryParser.js

function parseQuery(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, whereString] = match;
        const whereClauses = whereString ? parseWhereClause(whereString) : [];
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClauses
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseWhereClause(whereString) {
    try {
        const conditions = whereString.split(/ AND | OR /i);
        return conditions.map(condition => {
            const [field, operator, value] = condition.match(/(\w+)\s*(=|!=|>|<|>=|<=)\s*(.+)/).slice(1);
            if (!field || !operator || !value) {
                throw new Error('Invalid WHERE clause format');
            }
            return { field, operator, value: value.replace(/['"]+/g, '') };
        });
    } catch (error) {
        throw new Error('Error parsing WHERE clause: ' + error.message);
    }
}

module.exports = parseQuery;
