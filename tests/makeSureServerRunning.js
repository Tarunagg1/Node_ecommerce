const chai = require('chai')
const chaiHttp = require('chai-http')
const { describe } = require('mocha')
const app = require('../index')

chai.use(chaiHttp)
chai.should()

describe('Make sure that status is 200', () => {
  it('should return 200', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if (err) {
          throw err
        }
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })
})
