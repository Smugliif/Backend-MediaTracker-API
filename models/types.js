const connection = require("../db/connection");

const types = {
    findAll: () =>
        new Promise((resolve, reject) => {
            connection.query("SELECT * FROM types;", (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
    findById: (id) =>
        new Promise((resolve, reject) => {
            const selectQuery = `SELECT * FROM types WHERE id = ?;`;
            connection.query(selectQuery, id, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
    findByName: (name) =>
        new Promise((resolve, reject) => {
            const selectQuery = `SELECT * FROM types WHERE type LIKE ?;`;
            connection.query(selectQuery, name, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
    save: (type) =>
        new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO types SET ?;",
                type,
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                }
            );
        }),
    updateById: (type) =>
        new Promise((resolve, reject) => {
            const updateQuery = "UPDATE types SET type = ? WHERE id = ?;";
            connection.query(
                updateQuery,
                [type.type, type.id],
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                }
            );
        }),
    deleteById: (id) =>
        new Promise((resolve, reject) => {
            const deleteQuery = "DELETE FROM types WHERE id = ?;";
            connection.query(deleteQuery, id, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
};

module.exports = types;
