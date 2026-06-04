
/**
 * @typedef {Object} Line
 * @property {string} text
 * @property {string} number
 * @property {string} hex
 */

/**
 * @typedef {Object} FormattedFile
 * @property {string} file
 * @property {Array<Line> | Array<{}>} lines
 */

/**
 * @typedef {Array<FormattedFile>} Response
 */

/**
@param {Array<{status: string, value: {data: string}}>} data
@returns {Response}
*/

function formatCsvDataToJson (data) {
  const jsonData = []
  for (const item of data) {
    if (item.status === 'fulfilled') {
      const rows = item.value.data.split('\n')
      const headers = rows[0].split(',')
      let file = ''
      headers.shift()
      const lines = rows
        .slice(1)
        .map((row) => {
          const values = row.split(',')
          if (!file) {
            file = values[0]
          }
          values.shift()
          return headers.reduce(
            /**
             * @param {Record<string, string>} obj
             * @param {string} header
             * @param {number} index
             */
            (obj, header, index) => {
              if (header === 'number') {
                // thinking number prop has to be a valid number(without other character)
                obj[header] = checkIsValidNumber(values[index])
              } else {
                obj[header] = values[index] ?? ''
              }
              return obj
            },
            /** @type {Record<string, string>} */ ({})
          )
        })
        .filter((row) => headers.every((header) => row[header]))
      if (lines.length > 0) {
        jsonData.push({ file, lines })
      }
    }
  }
  return jsonData
}

/**
@param {string} str
@returns {string}>}
*/
function checkIsValidNumber (str) {
  const num = Number(str)
  return Number.isNaN(num) ? '' : str
}

const errorTypes = {
  fileNotFound: 'file_not_found',
  internalServerError: 'internal_server_error'
}
const errorMassages = {
  fileNotFound: 'Please enter a valid file',
  internalServerError: 'Inernal Server Error'
}

/**
 * @typedef {Object} Error
 * @property {string} error
 * @property {string} message
 */

/**
@param {string} error
@param {string} message
@returns {Error}
*/
function buildErrorObject (error, message) {
  return { error, message }
}

export { formatCsvDataToJson, errorTypes, errorMassages, buildErrorObject }
