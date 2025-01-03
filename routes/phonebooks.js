var express = require('express');
const fs = require("fs");
const path = require("path");
const { Phonebook } = require('../models');
const { Op } = require('sequelize');
const { addPhonebookValidation, updatePhonebookValidation, updatePhonebookAvatarValidation } = require('../middlewares/formValidation');
const moment = require('moment');
const sharp = require("sharp");
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
    const defaultAvatarFilename = 'defaultAvatar.png';
    const defaultAvatarPath = path.join(__dirname, '../public/images/', defaultAvatarFilename);
    const data = await Phonebook.create({ name, phone, avatar: defaultAvatarFilename });
    const uploadDir = path.join(__dirname, '../public/images', data.id.toString());
    const uploadPath = path.join(uploadDir, `${defaultAvatarFilename}`);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    await sharp(defaultAvatarPath).resize(256, 256).toFormat('png').toFile(uploadPath);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', updatePhonebookValidation, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Phonebook.update(req.body, { where: { id }, returning: true, plain: true });
    if (data[0] === 0) {
      res.status(400).json({ error: 'Bad request' });
    }
    else {
      res.status(201).json(data[1]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/avatar', updatePhonebookAvatarValidation, async (req, res, next) => {
  try {
    const { id } = req.params;
    const avatarFile = req.files.avatar;
    const filename = `${id}${moment().format('YYYYMMDDHHmmss')}_avatar.jpg`;
    const uploadDir = path.join(__dirname, '../public/images', id.toString());
    const uploadPath = path.join(uploadDir, `${filename}`);
    const oldAvatar = await Phonebook.findByPk(id);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (oldAvatar.avatar) {
      const oldAvatarPath = path.join(uploadDir, oldAvatar.avatar);
      if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
    }
    avatarFile.mv(uploadPath);
    // await sharp(avatarFile.data).resize(256, 256).toFormat('jpg').toFile(uploadPath);
    const data = await Phonebook.update({ avatar: filename }, { where: { id }, returning: true, plain: true });
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
    const avatarPath = path.join(__dirname, '../public/images', id.toString());
    const result = await Phonebook.destroy({ where: { id } });
    if (result === 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      if (fs.existsSync(avatarPath)) fs.rmSync(avatarPath, { recursive: true });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
