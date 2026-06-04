import { expect } from 'chai'
import axios from 'axios'
import { getFiles, getFilesList } from '../src/services/filesService.js'
/* eslint-env mocha */

function createMockRes () {
  const res = {
    statusCode: null,
    body: null,
    status (code) {
      this.statusCode = code
      return this
    },
    send (payload) {
      this.body = payload
      return this
    }
  }
  return res
}

describe('filesService', () => {
  let originalAxiosGet

  before(() => {
    originalAxiosGet = axios.get
  })

  after(() => {
    axios.get = originalAxiosGet
  })

  afterEach(() => {
    axios.get = originalAxiosGet
  })

  describe('getFilesList', () => {
    it('returns the file list response from the API', async () => {
      axios.get = async (url) => {
        expect(url).to.equal('https://echo-serv.tbxnet.com/v1/secret/files')
        return {
          data: {
            files: ['file1.csv', 'file2.csv']
          }
        }
      }

      const res = createMockRes()
      await getFilesList({}, res)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal({ files: ['file1.csv', 'file2.csv'] })
    })
  })

  describe('getFiles', () => {
    it('returns formatted CSV payloads for available files', async () => {
      axios.get = async (url) => {
        if (url.endsWith('/secret/files')) {
          return {
            data: {
              files: ['file1.csv', 'file2.csv']
            }
          }
        }

        if (url.endsWith('/secret/file/file1.csv')) {
          return {
            data: 'file1,number,text,hex\nfile1,123,hello,abcd'
          }
        }

        if (url.endsWith('/secret/file/file2.csv')) {
          return {
            data: 'file2,number,text,hex\nfile2,456,world,ef01'
          }
        }

        throw new Error(`Unexpected URL: ${url}`)
      }

      const res = createMockRes()
      await getFiles({}, res)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal([
        {
          file: 'file1',
          lines: [
            {
              number: '123',
              text: 'hello',
              hex: 'abcd'
            }
          ]
        },
        {
          file: 'file2',
          lines: [
            {
              number: '456',
              text: 'world',
              hex: 'ef01'
            }
          ]
        }
      ])
    })

    it('returns an empty array when the file list is empty', async () => {
      axios.get = async (url) => {
        if (url.endsWith('/secret/files')) {
          return {
            data: {
              files: []
            }
          }
        }

        throw new Error(`Unexpected URL: ${url}`)
      }

      const res = createMockRes()
      await getFiles({}, res)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal([])
    })
  })
})
