const { Phonebook } = require('../models');

const addPhonebookValidation = (req, res, next) => {
  const { name, phone } = req.body;
  try {
    if ((!name && !phone) || (name && name.trim() === '' && phone && phone.trim() === '')) {
      throw new Error('Name and Phone is required');
    }
    if (!name || (name && name.trim() === '')) {
      throw new Error('Name is required');
    }
    if (!phone || (phone && phone.trim() === '')) {
      throw new Error('Phone is required');
    }
    if (name && name.length > 120) {
      throw new Error('Name is too long');
    }
    if (phone && phone.length > 13) {
      throw new Error('Phone is too long');
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });

  }
};

const updatePhonebookValidation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const getData = await Phonebook.findByPk(id);
    if (getData === null || !id || (id && id.trim() === '' || id && isNaN(id) || id && !getData)) {
      throw new Error('Not found');
    }
    if (name && name.trim() === '' && phone && phone.trim() === '' || !name && !phone) {
      throw new Error('Name and Phone is required');
    }
    if (name && name.trim() === '' || !name) {
      throw new Error('Name is required');
    }
    if (phone && phone.trim() === '' || !phone) {
      throw new Error('Phone is required');
    }
    if (name && name.length > 120) {
      throw new Error('Name is too long');
    }
    if (phone && phone.length > 13) {
      throw new Error('Phone is too long');
    }
    next();
  } catch (error) {
    if (error.message === 'Not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const updatePhonebookAvatarValidation = async (req, res, next) => {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  try {
    const { id } = req.params;
    const getData = await Phonebook.findByPk(id);
    if (getData === null || !id || (id && id.trim() === '' || id && isNaN(id) || id && !getData)) {
      throw new Error('Not found');
    }
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.avatar) {
      throw new Error('No files were uploaded');
    }
    if (!allowedExtensions.exec(req.files.avatar.name)) {
      throw new Error('File must be an image');
    }
    next();
  } catch (error) {
    if (error.message === 'Not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  addPhonebookValidation,
  updatePhonebookValidation,
  updatePhonebookAvatarValidation
};