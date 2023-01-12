const media = require("../models/media");
const Joi = require("joi");
const types = require("../models/types");

//Get all media information
const getMedia = async (req, res) => {
    try {
        const response = await media.findAll();
        if (response) {
            res.send(response);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Get a media entry by its id
const getMediaById = async (req, res) => {
    try {
        //Get id from req.params
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).send("Please provide valid params");
            return;
        }
        const response = await media.findById(id);
        if (response.length === 1) {
            res.send(response[0]);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Get media information by title
const getMediaByTitle = async (req, res) => {
    try {
        const title = req.params.title;
        const response = await media.findByTitle(title);
        if (response) {
            res.send(response);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Get media information by type
const getMediaByType = async (req, res) => {
    try {
        const type = req.params.type;
        const response = await media.findByType(type);
        if (response) {
            res.send(response);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Save new media entry to database
const createMedia = async (req, res) => {
    //Define a schema to compare data payload to
    const schema = Joi.object({
        date_started: Joi.string().isoDate().allow(null),
        date_finished: Joi.string().isoDate().allow(null),
        rating: Joi.number().less(11).greater(0).allow(null),
        title: Joi.string().min(1).required(),
        type_id: Joi.number().integer().required(),
    });

    //Data validation
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //Incoming data payload
    const pieceOfMedia = {
        date_started: req.body.date_started,
        date_finished: req.body.date_finished,
        rating: req.body.rating,
        title: req.body.title,
        type_id: req.body.type_id,
    };

    try {
        const result = await media.findByTitle(pieceOfMedia.title);
        if (result.length > 0) {
            res.status(400).send("No duplicate titles allowed");
            return;
        }
        const typeResult = await types.findById(pieceOfMedia.type_id);
        if (typeResult.length === 0) {
            res.status(400).send("Type_id must be of an existing type's id");
            return;
        }

        const response = await media.save(pieceOfMedia);
        if (response) {
            pieceOfMedia.id = response.insertId;
            res.status(201).send(pieceOfMedia);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Update a media entry
const updateMedia = async (req, res) => {
    const schema = Joi.object({
        id: Joi.number().integer().required(),
        date_started: Joi.string().isoDate().allow(null),
        date_finished: Joi.string().isoDate().allow(null),
        rating: Joi.number().less(11).greater(0).allow(null),
        title: Joi.string().min(1).required(),
        type_id: Joi.number().required(),
    });
    //Check that request body matches requirements
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const pieceOfMedia = {
        id: req.body.id,
        date_started: req.body.date_started,
        date_finished: req.body.date_finished,
        rating: req.body.rating,
        title: req.body.title,
        type_id: req.body.type_id,
    };
    try {
        const result = await media.findById(pieceOfMedia.id);
        if (result.length === 0) {
            res.status(404).send("Not Found");
            return;
        }
        const typeResult = await types.findById(pieceOfMedia.type_id);
        if (typeResult.length === 0) {
            res.status(400).send("Type_id must be of an existing type's id");
            return;
        }
        const response = await media.updateById(pieceOfMedia);
        if (response) {
            res.send(pieceOfMedia);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Delete media entry by id
const deleteMedia = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        if (isNaN(id)) {
            res.status(400).send("Please provide valid params");
            return;
        }
        const result = await media.findById(id);
        if (result.length === 0) {
            res.status(404).send("Not Found");
            return;
        }
        const response = await media.deleteById(id);
        if (response) {
            res.status(200).send("Media deleted successfully");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

module.exports = {
    getMedia,
    getMediaById,
    getMediaByTitle,
    getMediaByType,
    createMedia,
    updateMedia,
    deleteMedia,
};
