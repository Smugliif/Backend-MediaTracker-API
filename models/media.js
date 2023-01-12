const connection = require("../db/connection");

//Models
const media = {
    findAll: () =>
        new Promise((resolve, reject) => {
            connection.query(
                "SELECT media_consumed.id, date_started, date_finished, rating, title, type_id, type FROM media_consumed LEFT JOIN types ON media_consumed.type_id = types.id;",
                (err, result) => {
                    err ? reject(err) : resolve(result);
                }
            );
        }),
    findById: (id) =>
        new Promise((resolve, reject) => {
            const selectQuery = `SELECT media_consumed.id, date_started, date_finished, rating, title, type FROM media_consumed LEFT JOIN types ON media_consumed.type_id = types.id WHERE media_consumed.id = ?;`;
            connection.query(selectQuery, id, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        }),
    findByTitle: (title) =>
        new Promise((resolve, reject) => {
            const selectQuery =
                "SELECT media_consumed.id, date_started, date_finished, rating, title, type FROM media_consumed LEFT JOIN types ON media_consumed.type_id = types.id WHERE title LIKE ?;";
            connection.query(selectQuery, title, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        }),
    findByType: (type) =>
        new Promise((resolve, reject) => {
            const selectQuery =
                "SELECT media_consumed.id, date_started, date_finished, rating, title, type FROM media_consumed LEFT JOIN types ON media_consumed.type_id = types.id WHERE types.type LIKE ?;";
            connection.query(selectQuery, type, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        }),
    save: (pieceOfMedia) =>
        new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO media_consumed SET ?;",
                pieceOfMedia,
                (err, result) => {
                    err ? reject(err) : resolve(result);
                }
            );
        }),
    deleteById: (id) =>
        new Promise((resolve, reject) => {
            const deleteQuery = "DELETE FROM media_consumed WHERE id=?;";
            connection.query(deleteQuery, id, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        }),
    updateById: (pieceOfMedia) =>
        new Promise((resolve, reject) => {
            const updateQuery =
                "UPDATE media_consumed SET date_started = ?, date_finished = ?, rating = ?, title = ?, type_id = ? WHERE id=?;";
            connection.query(
                updateQuery,
                [
                    pieceOfMedia.date_started,
                    pieceOfMedia.date_finished,
                    pieceOfMedia.rating,
                    pieceOfMedia.title,
                    pieceOfMedia.type_id,
                    pieceOfMedia.id,
                ],
                (err, result) => {
                    err ? reject(err) : resolve(result);
                }
            );
        }),
};

module.exports = media;
