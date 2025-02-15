const Collection = require("../models/collection.model");
const { createErrorResponse } = require("../../util/errorHandler");

// Create a new collection
const createCollection = async (req, res, next) => {
    try {
        const { title, description, visibility, tags } = req.body;
        const ownerId = req.user.id; // Assuming user ID is attached to the request

        const newCollection = await Collection.create({
            title,
            description,
            ownerId,
            visibility,
            tags,
        });

        res.status(201).json({
            code: 201,
            message: "Collection created successfully",
            data: newCollection,
        });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

// Get all collections
const getAllCollections = async (req, res, next) => {
    try {
        const collections = await Collection.find().populate("ownerId", "name email");
        if (collections.length === 0) {
            return res.status(404).json({
                code: 404,
                message: "No collections found",
            });
        }

        res.status(200).json({ code: 200, message: "Collections retrieved", data: collections });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

// Get a single collection by ID
const getCollectionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const collection = await Collection.findById(id).populate("ownerId", "name email");

        if (!collection) {
            return res.status(404).json({
                code: 404,
                message: "No collection found",
            });
        }

        res.status(200).json({ code: 200, message: "Collection retrieved", data: collection });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

// Update a collection
const updateCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCollection = await Collection.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCollection) throw new NotFoundError("Collection not found");

        res.status(200).json({ code: 200, message: "Collection updated", data: updatedCollection });
    } catch (error) {
        createErrorResponse(res, error);
    }
};

// Delete a collection
const deleteCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCollection = await Collection.findByIdAndDelete(id);
        if (!deletedCollection) throw new NotFoundError("Collection not found");

        res.status(200).json({ code: 200, message: "Collection deleted" });
    } catch (error) {
        createErrorResponse(res, error);
    }
};


module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
};