const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { Op } = require('sequelize');
const { Phonebook } = require('../models');
const app = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Phonebook API Test', () => {
  // Clear phonebook data before test
  before((done) => {
    Phonebook.destroy({
      where: {
        name: {
          [Op.iLike]: '%Test Data%'
        }
      }
    }).then(() => {
      done();
    });
  });

  // Clear phonebook data after test
  after((done) => {
    Phonebook.destroy({
      where: {
        name: {
          [Op.iLike]: '%Test Data%'
        }
      }
    }).then(() => {
      done();
    });
  });

  // POST /api/phonebooks
  describe('POST /api/phonebooks', () => {
    // Error case post new phonebook without name and phone
    it('It should not POST a new phonebook without the name and phone field', (done) => {
      const phonebook = {};
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Name and Phone is required');
        done();
      });
    });

    // Error case post new phonebook without name
    it('It should not POST a new phonebook without the name field', (done) => {
      const phonebook = {
        phone: '081234567890',
      };
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Name is required');
        done();
      });
    });

    // Error case post new phonebook without phone
    it('It should not POST a new phonebook without the phone field', (done) => {
      const phonebook = {
        name: 'Test Data',
      };
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Phone is required');
        done();
      });
    });

    // Success case post new phonebook
    it('It should POST a new phonebook', (done) => {
      const phonebook = {
        name: 'Test Data',
        phone: '081234567890',
      };
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('name').eq('Test Data');
        response.body.should.have.property('phone').eq('081234567890');
        response.body.should.have.property('avatar');
        response.body.should.have.property('createdAt');
        response.body.should.have.property('updatedAt');
        done();
      });
    });
  });

  // GET /api/phonebooks
  describe('GET /api/phonebooks ', () => {
    // Success case post new phonebook for fillter (sort, limit, keyword)
    it('It should POST a new phonebook for fillter keyword', (done) => {
      const phonebook = {
        name: 'A Test Data',
        phone: '081234567890',
      };
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('name').eq('A Test Data');
        response.body.should.have.property('phone').eq('081234567890');
        response.body.should.have.property('avatar');
        response.body.should.have.property('createdAt');
        response.body.should.have.property('updatedAt');
        done();
      });
    });

    // Success case post new phonebook for fillter (sort, limit, keyword)
    it('It should POST a new phonebook for fillter keyword', (done) => {
      const phonebook = {
        name: 'Z Test Data',
        phone: '081234567890',
      };
      chai.request(app).post('/api/phonebooks').send(phonebook).end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('name').eq('Z Test Data');
        response.body.should.have.property('phone').eq('081234567890');
        response.body.should.have.property('avatar');
        response.body.should.have.property('createdAt');
        response.body.should.have.property('updatedAt');
        done();
      });
    });

    // Success case get all phonebooks
    it('It should GET all the phonebooks', (done) => {
      chai.request(app).get('/api/phonebooks').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });

    // Success case get all phonebooks with limit 1
    it('It should GET all the phonebooks with limit 1', (done) => {
      chai.request(app).get('/api/phonebooks?limit=1').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });

    // Success case get all phonebooks with page 1
    it('It should GET all the phonebooks with page 1', (done) => {
      chai.request(app).get('/api/phonebooks?page=1').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    })

    // Success case get all phonebooks with sort name desc
    it('It should GET all the phonebooks with sort name desc', (done) => {
      chai.request(app).get('/api/phonebooks?sort=desc').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name').eq('Z Test Data');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });

    // Success case get all phonebooks with sort name asc
    it('It should GET all the phonebooks with sort name asc', (done) => {
      chai.request(app).get('/api/phonebooks?sort=asc').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name').eq('A Test Data');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });

    // Success case get all phonebooks with keyword name
    it('It should GET all the phonebooks with keyword name', (done) => {
      chai.request(app).get('/api/phonebooks?keyword=Test').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });

    // Success case get all phonebooks with keyword phone
    it('It should GET all the phonebooks with keyword phone', (done) => {
      chai.request(app).get('/api/phonebooks?keyword=081234567890').end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('phonebooks');
        response.body.phonebooks.should.be.a('array');
        response.body.phonebooks[0].should.have.property('id');
        response.body.phonebooks[0].should.have.property('name');
        response.body.phonebooks[0].should.have.property('phone');
        response.body.phonebooks[0].should.have.property('avatar');
        response.body.phonebooks[0].should.have.property('createdAt');
        response.body.phonebooks[0].should.have.property('updatedAt');
        response.body.should.have.property('page');
        response.body.should.have.property('limit');
        response.body.should.have.property('pages');
        response.body.should.have.property('total');
        done();
      });
    });
  });

  // GET /api/phonebooks/:id
  describe('GET /api/phonebooks/:id', () => {
    // Success case get phonebook by id
    it('It should GET a phonebook by the given id', (done) => {
      const phonebook = {
        name: 'Test Data',
        phone: '081234567890',
      };
      Phonebook.create(phonebook).then((data) => {
        chai.request(app).get(`/api/phonebooks/${data.id}`).end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id').eq(data.id);
          response.body.should.have.property('name').eq('Test Data');
          response.body.should.have.property('phone').eq('081234567890');
          response.body.should.have.property('avatar');
          response.body.should.have.property('createdAt');
          response.body.should.have.property('updatedAt');
          done();
        });
      });
    });

    // Error case get phonebook by id
    it('It should not GET a phonebook by the given id', (done) => {
      const id = 9999;
      chai.request(app).get(`/api/phonebooks/${id}`).end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Not found');
        done();
      });
    });
  });

  // PUT /api/phonebooks/:id
  describe('PUT /api/phonebooks/:id', () => {
    // Error case put existing phonebook without name and phone
    it('It should not PUT an existing phonebook without the name and phone field', (done) => {
      const phonebook = {};
      chai.request(app).put('/api/phonebooks/1').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Name and Phone is required');
        done();
      });
    });

    // Error case put existing phonebook without name
    it('It should not PUT an existing phonebook without the name field', (done) => {
      const phonebook = {
        phone: '081234567890',
      };
      chai.request(app).put('/api/phonebooks/1').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Name is required');
        done();
      });
    });

    // Error case put existing phonebook without phone
    it('It should not PUT an existing phonebook without the phone field', (done) => {
      const phonebook = {
        name: 'Test Data',
      };
      chai.request(app).put('/api/phonebooks/1').send(phonebook).end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Phone is required');
        done();
      }
      );
    });

    // Success case put existing phonebook
    it('It should PUT an existing phonebook', (done) => {
      const phonebook = {
        name: 'Test Data',
        phone: '081234567890',
      };
      Phonebook.create(phonebook).then((data) => {
        const updatePhonebook = {
          name: 'Test Data Updated',
          phone: '081234567891',
        };
        chai.request(app).put(`/api/phonebooks/${data.id}`).send(updatePhonebook).end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id').eq(data.id);
          response.body.should.have.property('name').eq('Test Data Updated');
          response.body.should.have.property('phone').eq('081234567891');
          response.body.should.have.property('avatar');
          response.body.should.have.property('createdAt');
          response.body.should.have.property('updatedAt');
          done();
        });
      });
    });

    // Error case put existing phonebook with invalid id
    it('It should not PUT an existing phonebook with invalid id', (done) => {
      const id = 9999;
      const updatePhonebook = {
        name: 'Test Data Updated',
        phone: '081234567891',
      };
      chai.request(app).put(`/api/phonebooks/${id}`).send(updatePhonebook).end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Not found');
        done();
      });
    });
  });

  // PUT /api/phonebooks/:id/avatar
  describe('PUT /api/phonebooks/:id/avatar', () => {
    // Error case put existing phonebook avatar without avatar
    it('It should not PUT an existing phonebook avatar without avatar', (done) => {
      chai.request(app).put('/api/phonebooks/1/avatar').end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('No files were uploaded');
        done();
      });
    });

    // Error case put existing phonebook avatar with worng file type
    it('It should not PUT an existing phonebook avatar with worng file type', (done) => {
      chai.request(app).put('/api/phonebooks/1/avatar').attach('avatar', 'test/avatar.pdf').end((err, response) => {
        response.should.have.status(400);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('File must be an image');
        done();
      });
    });

    // Error case put existing phonebook avatar with invalid id
    it('It should not PUT an existing phonebook avatar with invalid id', (done) => {
      const id = 9999;
      chai.request(app).put(`/api/phonebooks/${id}/avatar`).attach('avatar', 'test/avatar.png').end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Not found');
        done();
      });
    });

    // Success case put existing phonebook avatar
    it('It should PUT an existing phonebook avatar', (done) => {
      const phonebook = {
        name: 'Test Data Upload Avatar',
        phone: '081234567890',
      };
      Phonebook.create(phonebook).then((data) => {
        chai.request(app).put(`/api/phonebooks/${data.id}/avatar`).attach('avatar', 'test/avatar.png').end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id').eq(data.id);
          response.body.should.have.property('name').eq('Test Data Upload Avatar');
          response.body.should.have.property('phone').eq('081234567890');
          response.body.should.have.property('avatar').that.is.not.null;
          response.body.should.have.property('createdAt');
          response.body.should.have.property('updatedAt');
          const avatarPath = path.join(__dirname, '../public/images', data.id.toString());
          if (fs.existsSync(avatarPath)) fs.rmSync(avatarPath, { recursive: true });
          done();
        });
      });
    });
  });

  // DELETE /api/phonebooks/:id
  describe('DELETE /api/phonebooks/:id', () => {
    // Error case delete existing phonebook with invalid id
    it('It should not DELETE an existing phonebook with invalid id', (done) => {
      const id = 9999;
      chai.request(app).delete(`/api/phonebooks/${id}`).end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('Not found');
        done();
      });
    });

    // Success case delete existing phonebook
    it('It should DELETE an existing phonebook', (done) => {
      const phonebook = {
        name: 'Test Data Deleted',
        phone: '081234567890',
      };
      Phonebook.create(phonebook).then((data) => {
        chai.request(app).delete(`/api/phonebooks/${data.id}`).end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id').eq(data.id);
          response.body.should.have.property('name').eq('Test Data Deleted');
          response.body.should.have.property('phone').eq('081234567890');
          response.body.should.have.property('avatar');
          response.body.should.have.property('createdAt');
          response.body.should.have.property('updatedAt');
          done();
        });
      });
    });
  });
});