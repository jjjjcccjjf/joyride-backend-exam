function responseTemplate(data, errors) {

    let dataLength = 0;
    if (data instanceof Array) {
        dataLength = data.length
    } else if (data instanceof Object) {
        if (Object.keys(data).length === 0) {
            dataLength = 0
        } else {
            dataLength = 1
        }
    }

    return {
        data: data,
        meta: {
            errors: errors,
            totalRows: dataLength
        }
    }
}

module.exports = responseTemplate