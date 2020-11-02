// 5 - 8, 18 - 24
require('dotenv').config()
const InvoiceCronJob = require('./src/services/InvoiceCronJob')

new InvoiceCronJob().execute()
