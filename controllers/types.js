const types = require("../models/types");
const Joi = require("joi");

//Get all types
const getTypes = async (req, res) => {
    try {
        const response = await types.findAll();
        if (response) {
            res.send(response);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Get types by their IDs
const getTypeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).send("Please provide valid params");
            return;
        }
        const response = await types.findById(id);
        if (response.length === 1) {
            res.send(response[0]);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Get a type by name
const getTypeByName = async (req, res) => {
    try {
        const name = req.params.type;
        const response = await types.findByName(name);
        if (response.length === 1) {
            res.send(response[0]);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Save new type
const createType = async (req, res) => {
    //Joi schema
    const schema = Joi.object({
        type: Joi.string().min(2).required(),
    });

    //Data validation
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const type = {
        type: req.body.type,
    };
    try {
        const result = await types.findByName(type.type);
        if (result.length === 1) {
            res.status(400).send("A type by that name already exists");
            return;
        }
        const response = await types.save(type);
        if (response) {
            type.id = response.insertId;
            res.status(201).send(type);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Update an existing type
const updateType = async (req, res) => {
    //Joi schema
    const schema = Joi.object({
        id: Joi.number().integer().required(),
        type: Joi.string().min(2).required(),
    });

    //Data validation
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const type = {
        id: req.body.id,
        type: req.body.type,
    };

    try {
        const result = await types.findById(type.id);
        if (result.length === 0) {
            res.status(404).send("Not Found");
            return;
        }
        const nameResult = await types.findByName(type.type);
        if (nameResult.length === 1) {
            res.status(400).send("A type by that name already exists");
            return;
        }

        const response = await types.updateById(type);
        if (response) {
            res.send(type);
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

//Delete type by id
const deleteType = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        if (isNaN(id)) {
            res.status(400).send("Please provide valid params");
            return;
        }
        const result = await types.findById(id);
        if (result.length === 0) {
            res.status(404).send("Not Found");
            return;
        }
        const response = await types.deleteById(id);
        if (response) {
            res.status(200).send("Type deleted successfully");
        }
    } catch (e) {
        res.sendStatus(500);
    }
};

module.exports = {
    getTypes,
    getTypeById,
    getTypeByName,
    createType,
    updateType,
    deleteType,
};
