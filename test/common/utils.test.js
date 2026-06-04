import { expect } from 'chai'
import { formatCsvDataToJson, checkIsValidNumber } from '../../src/common/utils.js'

describe('common/utils', () => {
  describe('checkIsValidNumber', () => {
    it('returns the same string when it is a valid number', () => {
      expect(checkIsValidNumber('123')).to.equal('123')
      expect(checkIsValidNumber('0')).to.equal('0')
      expect(checkIsValidNumber(' 42 ')).to.equal(' 42 ')
    })

    it('returns empty string for invalid numbers', () => {
      expect(checkIsValidNumber('123e')).to.equal('')
      expect(checkIsValidNumber('abc')).to.equal('')
      expect(checkIsValidNumber('')).to.equal('')
    })
  })

  describe('formatCsvDataToJson', () => {
    it('formats multiple fulfilled CSV responses into JSON', () => {
      const settled = [
        {
          status: 'fulfilled',
          value: { data: 'file1,number,text,hex\nfile1,123,hello,abcd' }
        },
        {
          status: 'fulfilled',
          value: { data: 'file2,number,text,hex\nfile2,456,world,ef01' }
        }
      ]

      const out = formatCsvDataToJson(settled)
      expect(out).to.deep.equal([
        {
          file: 'file1',
          lines: [ { number: '123', text: 'hello', hex: 'abcd' } ]
        },
        {
          file: 'file2',
          lines: [ { number: '456', text: 'world', hex: 'ef01' } ]
        }
      ])
    })

    it('ignores rows where number is invalid or columns missing', () => {
      const settled = [
        {
          status: 'fulfilled',
          value: { data: 'file1,number,text,hex\nfile1,123e,hello,abcd\nfile1,123,hello,abcd' }
        },
        {
          status: 'fulfilled',
          value: { data: 'file2,number,text,hex\nfile2,,' }
        }
      ]

      const out = formatCsvDataToJson(settled)
      expect(out).to.deep.equal([
        {
          file: 'file1',
          lines: [ { number: '123', text: 'hello', hex: 'abcd' } ]
        }
      ])
    })

    it('returns empty array when no fulfilled items or no valid lines', () => {
      const settled = [
        { status: 'rejected', reason: new Error('fail') },
        { status: 'fulfilled', value: { data: 'file1,number,text,hex\n' } }
      ]

      const out = formatCsvDataToJson(settled)
      expect(out).to.deep.equal([])
    })
  })
})
