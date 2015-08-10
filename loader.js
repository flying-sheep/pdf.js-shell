'use strict'

const v8 = require('v8')
v8.setFlagsFromString('--harmony_arrow_functions')
v8.setFlagsFromString('--harmony_modules')
require('./main')