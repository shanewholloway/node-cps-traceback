'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff_stack_list = diff_stack_list;
exports.as_stack_filter = as_stack_filter;
exports.diff_frame_lines = diff_frame_lines;
class Traceback {
  constructor(trace_tip, asFrameList) {
    this.trace_tip = trace_tip;
    this.asFrameList = asFrameList;
  }

  async_stack() {
    return this.toString();
  }

  withError(error) {
    this.error = error;
    return this;
  }

  toString(lead = '') {
    const { tail, head } = this.toLines();
    const lines = head.length ? [lead].concat(tail, ['    ...'], head) : [lead].concat(tail);
    return lines.join('\n');
  }

  toLines(limit) {
    return this.toFrames(limit, flatten);
  }

  toFrames(limit, xform) {
    if (!xform) {
      xform = v => v;
    }
    const err_frames = this.toErrorFrames(limit);
    const head = xform(diff_stack_list(err_frames.head, this.stack_filter));
    const tail = xform(diff_stack_list(err_frames.tail, this.stack_filter));
    return { tail, head };
  }

  toErrorFrames(limit) {
    if (undefined === limit) {
      limit = this.default_limit;
    }
    const tip = this.trace_tip;
    const head = tip.early;
    const tail = this.asFrameList(tip, limit);
    const idx = head ? tail.indexOf(head[0]) : -1;
    if (-1 < idx) {
      tail.splice(idx, tail.length, ...head.splice(0, head.length));
    }

    if (undefined !== this.error) {
      tail.unshift(this.error);
    }
    return { tail, head };
  }
}exports.Traceback = Traceback;


Traceback.prototype.default_limit = 10;
Traceback.prototype.stack_filter = as_stack_filter(new Set(['bootstrap_node', 'AsyncHook.init'].concat(Object.keys(process.binding('natives')))));function diff_stack_list(error_frames, stack_filter, asRawFrames) {
  if (!error_frames || !error_frames.length) {
    return [];
  }

  if ('function' !== typeof stack_filter) {
    stack_filter = as_stack_filter(stack_filter);
  }

  const frames = error_frames.map(err => ({
    lines: err.stack.split(/\r?\n/).filter(stack_filter),
    key: err.triggerId ? err.message : false,
    err }));

  frames.reduce((cur, prev) => {
    cur.lines = diff_frame_lines(cur.lines, prev.lines);
    return prev;
  });

  if (asRawFrames) {
    return frames;
  } else {
    return frames.map(frame => [formatFrameLeader(frame)].concat(frame.lines));
  }
}

function formatFrameLeader(frame) {
  if (frame.key !== false) {
    return `  -- ${frame.key}`;
  }
  return frame.err.toString();
}const rx_stack_at = exports.rx_stack_at = /\s+at\s(.*)\s+\((.*)\)$/;
function as_stack_filter(suppress) {
  if (!suppress) {
    return line => rx_stack_at.exec(line);
  }

  if ('function' !== typeof suppress.has) {
    throw new TypeError(`Expected set-like suppress instance`);
  }

  return line => {
    const m = rx_stack_at.exec(line);
    if (!m) {
      return;
    }
    if (suppress.has(m[1]) || suppress.has(m[2])) {
      return;
    }
    const basename = m[2].split('.')[0];
    if (suppress.has(basename)) {
      return;
    }
    return true;
  };
}function diff_frame_lines(cur_lines, prev_lines) {
  let i0 = cur_lines.length - 1;
  let i1 = prev_lines.lastIndexOf(cur_lines[i0]);

  // match from the tail of cur_lines and walk backward until difference is found
  if (-1 === i1) {
    return cur_lines;
  }
  while (i0 >= 0 && i1 >= 0 && cur_lines[i0] === prev_lines[i1]) {
    i0--;i1--;
  }

  return cur_lines.slice(0, i0 + 1);
}

function flatten(lst) {
  return lst.reduce((a, b) => a.concat(b), []);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvZGUvdHJhY2ViYWNrLmpzeSJdLCJuYW1lcyI6WyJkaWZmX3N0YWNrX2xpc3QiLCJhc19zdGFja19maWx0ZXIiLCJkaWZmX2ZyYW1lX2xpbmVzIiwiVHJhY2ViYWNrIiwiY29uc3RydWN0b3IiLCJ0cmFjZV90aXAiLCJhc0ZyYW1lTGlzdCIsImFzeW5jX3N0YWNrIiwidG9TdHJpbmciLCJ3aXRoRXJyb3IiLCJlcnJvciIsImxlYWQiLCJ0YWlsIiwiaGVhZCIsInRvTGluZXMiLCJsaW5lcyIsImxlbmd0aCIsImNvbmNhdCIsImpvaW4iLCJsaW1pdCIsInRvRnJhbWVzIiwiZmxhdHRlbiIsInhmb3JtIiwidiIsImVycl9mcmFtZXMiLCJ0b0Vycm9yRnJhbWVzIiwic3RhY2tfZmlsdGVyIiwidW5kZWZpbmVkIiwiZGVmYXVsdF9saW1pdCIsInRpcCIsImVhcmx5IiwiaWR4IiwiaW5kZXhPZiIsInNwbGljZSIsInVuc2hpZnQiLCJwcm90b3R5cGUiLCJTZXQiLCJPYmplY3QiLCJrZXlzIiwicHJvY2VzcyIsImJpbmRpbmciLCJlcnJvcl9mcmFtZXMiLCJhc1Jhd0ZyYW1lcyIsImZyYW1lcyIsIm1hcCIsImVyciIsInN0YWNrIiwic3BsaXQiLCJmaWx0ZXIiLCJrZXkiLCJ0cmlnZ2VySWQiLCJtZXNzYWdlIiwicmVkdWNlIiwiY3VyIiwicHJldiIsImZyYW1lIiwiZm9ybWF0RnJhbWVMZWFkZXIiLCJyeF9zdGFja19hdCIsInN1cHByZXNzIiwibGluZSIsImV4ZWMiLCJoYXMiLCJUeXBlRXJyb3IiLCJtIiwiYmFzZW5hbWUiLCJjdXJfbGluZXMiLCJwcmV2X2xpbmVzIiwiaTAiLCJpMSIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJsc3QiLCJhIiwiYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFpRGdCQSxlLEdBQUFBLGU7UUE2QkFDLGUsR0FBQUEsZTtRQWVBQyxnQixHQUFBQSxnQjtBQTVGVCxNQUFNQyxTQUFOLENBQWdCO0FBQ3JCQyxjQUFZQyxTQUFaLEVB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QWpCLEVBQXNCO0FBQUcsU0FBT0EsSUFBSW5CLE1BQUosQ0FBYSxDQUFDb0IsQ0FBRCxFQUFHQyxDQUFILEtBQVNELEVBQUV2RCxNQUFGLENBQVN3RCxDQUFULENBQXRCLEVBQW1DLEVBQW5DLENBQVA7QUFBNEMiLCJmaWxlIjoidHJhY2ViYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY2xhc3MgVHJhY2ViYWNrIDo6XG4gIGNvbnN0cnVjdG9yKHRyYWNlX3RpcCwgYXNGcmFtZUxpc3QpIDo6XG4gICAgdGhpcy50cmFjZV90aXAgPSB0cmFjZV90aXBcbiAgICB0aGlzLmFzRnJhbWVMaXN0ID0gYXNGcmFtZUxpc3RcblxuICBhc3luY19zdGFjaygpIDo6IHJldHVybiB0aGlzLnRvU3RyaW5nKClcblxuICB3aXRoRXJyb3IoZXJyb3IpIDo6XG4gICAgdGhpcy5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuIHRoaXNcblxuICB0b1N0cmluZyhsZWFkPScnKSA6OlxuICAgIGNvbnN0IHt0YWlsLCBoZWFkfSA9IHRoaXMudG9MaW5lcygpXG4gICAgY29uc3QgbGluZXMgPSBoZWFkLmxlbmd0aFxuICAgICAgPyBbbGVhZF0uY29uY2F0IEAgdGFpbCwgWycgICAgLi4uJ10sIGhlYWRcbiAgICAgIDogW2xlYWRdLmNvbmNhdCBAIHRhaWxcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJylcblxuICB0b0xpbmVzKGxpbWl0KSA6OlxuICAgIHJldHVybiB0aGlzLnRvRnJhbWVzKGxpbWl0LCBmbGF0dGVuKVxuXG4gIHRvRnJhbWVzKGxpbWl0LCB4Zm9ybSkgOjpcbiAgICBpZiAhIHhmb3JtIDo6IHhmb3JtID0gdiA9PiB2XG4gICAgY29uc3QgZXJyX2ZyYW1lcyA9IHRoaXMudG9FcnJvckZyYW1lcyhsaW1pdClcbiAgICBjb25zdCBoZWFkID0geGZvcm0gQCBkaWZmX3N0YWNrX2xpc3QoZXJyX2ZyYW1lcy5oZWFkLCB0aGlzLnN0YWNrX2ZpbHRlcilcbiAgICBjb25zdCB0YWlsID0geGZvcm0gQCBkaWZmX3N0YWNrX2xpc3QoZXJyX2ZyYW1lcy50YWlsLCB0aGlzLnN0YWNrX2ZpbHRlcilcbiAgICByZXR1cm4gQHt9IHRhaWwsIGhlYWRcblxuICB0b0Vycm9yRnJhbWVzKGxpbWl0KSA6OlxuICAgIGlmIHVuZGVmaW5lZCA9PT0gbGltaXQgOjogbGltaXQgPSB0aGlzLmRlZmF1bHRfbGltaXRcbiAgICBjb25zdCB0aXAgPSB0aGlzLnRyYWNlX3RpcFxuICAgIGNvbnN0IGhlYWQgPSB0aXAuZWFybHlcbiAgICBjb25zdCB0YWlsID0gdGhpcy5hc0ZyYW1lTGlzdCh0aXAsIGxpbWl0KVxuICAgIGNvbnN0IGlkeCA9IGhlYWQgPyB0YWlsLmluZGV4T2YoaGVhZFswXSkgOiAtMVxuICAgIGlmIC0xIDwgaWR4IDo6XG4gICAgICB0YWlsLnNwbGljZSBAIGlkeCwgdGFpbC5sZW5ndGgsXG4gICAgICAgIC4uLiBoZWFkLnNwbGljZSgwLCBoZWFkLmxlbmd0aClcblxuICAgIGlmIHVuZGVmaW5lZCAhPT0gdGhpcy5lcnJvciA6OlxuICAgICAgdGFpbC51bnNoaWZ0IEAgdGhpcy5lcnJvclxuICAgIHJldHVybiBAe30gdGFpbCwgaGVhZFxuXG5UcmFjZWJhY2sucHJvdG90eXBlLmRlZmF1bHRfbGltaXQgPSAxMFxuVHJhY2ViYWNrLnByb3RvdHlwZS5zdGFja19maWx0ZXIgPSBhc19zdGFja19maWx0ZXIgQCBuZXcgU2V0IEBcbiAgWydib290c3RyYXBfbm9kZScsICdBc3luY0hvb2suaW5pdCddLmNvbmNhdCBAXG4gICAgT2JqZWN0LmtleXMocHJvY2Vzcy5iaW5kaW5nKCduYXRpdmVzJykpXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZfc3RhY2tfbGlzdChlcnJvcl9mcmFtZXMsIHN0YWNrX2ZpbHRlciwgYXNSYXdGcmFtZXMpIDo6XG4gIGlmICEgZXJyb3JfZnJhbWVzIHx8ICEgZXJyb3JfZnJhbWVzLmxlbmd0aCA6OlxuICAgIHJldHVybiBbXVxuXG4gIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdGFja19maWx0ZXIgOjpcbiAgICBzdGFja19maWx0ZXIgPSBhc19zdGFja19maWx0ZXIoc3RhY2tfZmlsdGVyKVxuXG4gIGNvbnN0IGZyYW1lcyA9IGVycm9yX2ZyYW1lcy5tYXAgQCBlcnIgPT4gQDpcbiAgICAgICAgbGluZXM6IGVyci5zdGFjay5zcGxpdCgvXFxyP1xcbi8pLmZpbHRlcihzdGFja19maWx0ZXIpXG4gICAgICAgIGtleTogZXJyLnRyaWdnZXJJZCA/IGVyci5tZXNzYWdlIDogZmFsc2VcbiAgICAgICAgZXJyXG5cbiAgZnJhbWVzLnJlZHVjZSBAIChjdXIsIHByZXYpID0+IDo6XG4gICAgY3VyLmxpbmVzID0gZGlmZl9mcmFtZV9saW5lcyBAIGN1ci5saW5lcywgcHJldi5saW5lc1xuICAgIHJldHVybiBwcmV2XG5cbiAgaWYgYXNSYXdGcmFtZXMgOjpcbiAgICByZXR1cm4gZnJhbWVzXG4gIGVsc2UgOjpcbiAgICByZXR1cm4gZnJhbWVzLm1hcCBAIGZyYW1lID0+XG4gICAgICBbZm9ybWF0RnJhbWVMZWFkZXIoZnJhbWUpXVxuICAgICAgICAuY29uY2F0IEAgZnJhbWUubGluZXNcblxuZnVuY3Rpb24gZm9ybWF0RnJhbWVMZWFkZXIoZnJhbWUpIDo6XG4gIGlmIGZyYW1lLmtleSAhPT0gZmFsc2UgOjpcbiAgICByZXR1cm4gYCAgLS0gJHtmcmFtZS5rZXl9YFxuICByZXR1cm4gZnJhbWUuZXJyLnRvU3RyaW5nKClcblxuZXhwb3J0IGNvbnN0IHJ4X3N0YWNrX2F0ID0gL1xccythdFxccyguKilcXHMrXFwoKC4qKVxcKSQvXG5leHBvcnQgZnVuY3Rpb24gYXNfc3RhY2tfZmlsdGVyKHN1cHByZXNzKSA6OlxuICBpZiAhIHN1cHByZXNzIDo6XG4gICAgcmV0dXJuIGxpbmUgPT4gcnhfc3RhY2tfYXQuZXhlYyhsaW5lKVxuXG4gIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdXBwcmVzcy5oYXMgOjpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgYEV4cGVjdGVkIHNldC1saWtlIHN1cHByZXNzIGluc3RhbmNlYFxuXG4gIHJldHVybiBsaW5lID0+IDo6XG4gICAgY29uc3QgbSA9IHJ4X3N0YWNrX2F0LmV4ZWMobGluZSlcbiAgICBpZiAhIG0gOjogcmV0dXJuXG4gICAgaWYgc3VwcHJlc3MuaGFzKG1bMV0pIHx8IHN1cHByZXNzLmhhcyhtWzJdKSA6OiByZXR1cm5cbiAgICBjb25zdCBiYXNlbmFtZSA9IG1bMl0uc3BsaXQoJy4nKVswXVxuICAgIGlmIHN1cHByZXNzLmhhcyhiYXNlbmFtZSkgOjogcmV0dXJuXG4gICAgcmV0dXJuIHRydWVcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZfZnJhbWVfbGluZXMoY3VyX2xpbmVzLCBwcmV2X2xpbmVzKSA6OlxuICBsZXQgaTAgPSBjdXJfbGluZXMubGVuZ3RoIC0gMVxuICBsZXQgaTEgPSBwcmV2X2xpbmVzLmxhc3RJbmRleE9mKGN1cl9saW5lc1tpMF0pXG5cbiAgLy8gbWF0Y2ggZnJvbSB0aGUgdGFpbCBvZiBjdXJfbGluZXMgYW5kIHdhbGsgYmFja3dhcmQgdW50aWwgZGlmZmVyZW5jZSBpcyBmb3VuZFxuICBpZiAtMSA9PT0gaTEgOjogcmV0dXJuIGN1cl9saW5lc1xuICB3aGlsZSBpMCA+PSAwICYmIGkxID49IDAgJiYgY3VyX2xpbmVzW2kwXSA9PT0gcHJldl9saW5lc1tpMV0gOjpcbiAgICBpMC0tOyBpMS0tXG5cbiAgcmV0dXJuIGN1cl9saW5lcy5zbGljZSgwLCBpMCsxKVxuXG5mdW5jdGlvbiBmbGF0dGVuKGxzdCkgOjogcmV0dXJuIGxzdC5yZWR1Y2UgQCAoYSxiKSA9PiBhLmNvbmNhdChiKSwgW11cblxuIl19