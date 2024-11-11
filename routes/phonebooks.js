var express = require('express');
const { Phonebook } = require('../models');
const { Op } = require('sequelize');
const { addPhonebookValidation } = require('../middlewares/formValidation');
var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, keyword = '', sort = 'asc' } = req.query;
    const { count, rows } = await Phonebook.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } }
        ]
      },
      order: [['name', sort]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    res.status(200).json({
      phonebooks: rows,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
      total: parseInt(count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Phonebook.findByPk(id);
    if (data === null) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', addPhonebookValidation, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const data = await Phonebook.create({ name, phone });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Phonebook.update(req.body, { where: { id }, returning: true, plain: true });
    if (data[0] === 0) {
      res.status(400).json({ error: 'Bad request' });
    } else {
      res.status(201).json(data[1]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/avatar', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Phonebook.update({ avatar: req.files }, { where: { id }, returning: true, plain: true });
    if (data[0] === 0) {
      res.status(400).json({ error: 'Bad request' });
    } else {
      res.status(201).json(data[1]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Phonebook.findByPk(id);
    const result = await Phonebook.destroy({ where: { id } });
    if (result === 0) {
      res.status(400).json({ error: 'Bad request' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
