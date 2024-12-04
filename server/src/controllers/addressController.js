const Address = require("../models/addressModel");

const addressController = {
  createAddress: async (req, res) => {
    try {
      const address = new Address({
        building_name: req.body.building_name,
        responsible_user: req.body.responsible_user,
      });
      await address.save();
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllAddresses: async (req, res) => {
    try {
      const addresses = await Address.find();
      res.status(200).json(addresses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAddressById: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      res.status(200).json(address);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateAddress: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      await address.updateOne({ $set: req.body });
      res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      address.deleteOne();
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = addressController;
