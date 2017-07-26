require('source-map-support').install()

import cps_traceback from '../dist'
cps_traceback.install()

import tap from 'tap-lite-tester'

const test_utils = @: cps_traceback
  , asFrameKeys(frames) ::
      let {head, tail} = frames
      head = head.map @ l => l[0].replace(/\s+-+\s+/, '')
      tail = tail.map @ l => l[0].replace(/\s+-+\s+/, '')
      return {head, tail}

tap.start()

require('./tap-test-smoke') @ tap, cps_traceback, test_utils
require('./tap-test-timers') @ tap, cps_traceback, test_utils
require('./tap-test-asyncawait') @ tap, cps_traceback, test_utils

tap.finish()

