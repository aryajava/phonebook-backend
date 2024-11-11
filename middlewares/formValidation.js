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

module.exports = {
  addPhonebookValidation,
};