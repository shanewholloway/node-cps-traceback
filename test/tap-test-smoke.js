module.exports = exports = function (tap, cps_traceback, test_utils) ::
  tap.test @ 'Smoke', t => ::
    const frames = cps_traceback.capture().toFrames()
    t.deepEqual @ test_utils.asFrameKeys(frames)
      , @: head:[], tail: @[] 'CPS[1]::PROMISE'

  tap.test @ 'Smoke async', async t => ::
    ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[1]::PROMISE'

    await t
    ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[3]::PROMISE', 'CPS[2]::PROMISE', 'CPS[1]::PROMISE'
