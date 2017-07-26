module.exports = exports = function (tap, cps_traceback, test_utils) ::

  tap.test @ 'setTimeout', t => ::
    return new Promise @ (resolve, reject) => ::
      let tid = setTimeout @ () => ::
        try ::
          inner()
          resolve()
        catch err ::
          reject(err)

    function inner(count) ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[2]::Timeout', 'CPS[1]::PROMISE'


  tap.test @ 'setInterval', t => ::
    return new Promise @ (resolve, reject) => ::
      let count = 0
      let tid = setInterval @ () => ::
        try ::
          inner(count++)
          if count > 2 ::
            tid = clearInterval(tid)
            resolve()
        catch err ::
          tid = clearInterval(tid)
          reject(err)

    function inner(count) ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[2]::Timeout', 'CPS[1]::PROMISE'


  tap.test @ 'setImmediate', t => ::
    return new Promise @ (resolve, reject) => ::
      setImmediate @ () => ::
        try ::
          inner()
          resolve()
        catch err ::
          reject(err)

    function inner(count) ::
      const frames = cps_traceback.capture().toFrames()
      t.deepEqual @ test_utils.asFrameKeys(frames)
        , @: head:[], tail: @[] 'CPS[2]::Immediate', 'CPS[1]::PROMISE'

