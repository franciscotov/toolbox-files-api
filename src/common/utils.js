/**
@param {Array<{status: string, value: {data: string}}>} data
@returns @type {Array<{file: string, lines: Array<{text: string, number: string, hex: string>}}>}
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
          return headers.reduce((obj, header, index) => {
            if (header === 'number') {
              // thinking number prop has to be a valid number(without other character)
              obj[header] = checkIsValidNumber(values[index])
            } else {
              obj[header] = values[index] ?? ''
            }
            return obj
          }, {})
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
@returns @type {string}>}
*/

function checkIsValidNumber (str) {
  const num = Number(str)
  return Number.isNaN(num) ? '' : str
}

export { formatCsvDataToJson }
