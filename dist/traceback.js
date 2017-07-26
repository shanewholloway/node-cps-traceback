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

  get async_stack() {
    return this.toString();
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
    key: err.message, lines: err.stack.split(/\r?\n/).filter(stack_filter) }));

  frames.reduce((cur, prev) => {
    cur.lines = diff_frame_lines(cur.lines, prev.lines);
    return prev;
  });

  if (asRawFrames) {
    return frames;
  } else {
    return frames.map(frame => [`    -- ${frame.key}`].concat(frame.lines));
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvZGUvdHJhY2ViYWNrLmpzeSJdLCJuYW1lcyI6WyJkaWZmX3N0YWNrX2xpc3QiLCJhc19zdGFja19maWx0ZXIiLCJkaWZmX2ZyYW1lX2xpbmVzIiwiVHJhY2ViYWNrIiwiY29uc3RydWN0b3IiLCJ0cmFjZV90aXAiLCJhc0ZyYW1lTGlzdCIsImFzeW5jX3N0YWNrIiwidG9TdHJpbmciLCJsZWFkIiwidGFpbCIsImhlYWQiLCJ0b0xpbmVzIiwibGluZXMiLCJsZW5ndGgiLCJjb25jYXQiLCJqb2luIiwibGltaXQiLCJ0b0ZyYW1lcyIsImZsYXR0ZW4iLCJ4Zm9ybSIsInYiLCJlcnJfZnJhbWVzIiwidG9FcnJvckZyYW1lcyIsInN0YWNrX2ZpbHRlciIsInVuZGVmaW5lZCIsImRlZmF1bHRfbGltaXQiLCJ0aXAiLCJlYXJseSIsImlkeCIsImluZGV4T2YiLCJzcGxpY2UiLCJwcm90b3R5cGUiLCJTZXQiLCJPYmplY3QiLCJrZXlzIiwicHJvY2VzcyIsImJpbmRpbmciLCJlcnJvcl9mcmFtZXMiLCJhc1Jhd0ZyYW1lcyIsImZyYW1lcyIsIm1hcCIsImVyciIsImtleSIsIm1lc3NhZ2UiLCJzdGFjayIsInNwbGl0IiwiZmlsdGVyIiwicmVkdWNlIiwiY3VyIiwicHJldiIsImZyYW1lIiwicnhfc3RhY2tfYXQiLCJzdXBwcmVzcyIsImxpbmUiLCJleGVjIiwiaGFzIiwiVHlwZUVycm9yIiwibSIsImJhc2VuYW1lIiwiY3VyX2xpbmVzIiwicHJldl9saW5lcyIsImkwIiwiaTEiLCJsYXN0SW5kZXhPZiIsInNsaWNlIiwibHN0IiwiYSIsImIiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMENnQkEsZSxHQUFBQSxlO1FBc0JBQyxlLEdBQUFBLGU7UUFlQUMsZ0IsR0FBQUEsZ0I7QUE5RVQsTUFBTUMsU0FBTixDQUFnQjtBQUNyQkMsY0FBWUMsU0FBWixFQUF1QkMsV0FBdkIsRUFBb0M7QUFDbEMsU0FBS0QsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUE4Qjs7QUFFaEMsTUFBSUMsV0FBSixHQUFrQjtBQUFHLFdBQU8sS0FBS0MsUUFBTCxFQUFQO0FBQXNCOztBQUUzQ0EsV0FBU0MsT0FBSyxFQUFkLEVBQWtCO0FBQ2hCLFVBQU0sRUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEtBQWUsS0FBS0MsT0FBTCxFQUFyQjtBQUNBLFVBQU1DLFFBQVFGLEtBQUtHLE1BQUwsR0FDVixDQUFDTCxJQUFELEVBQU9NLE1BQVAsQ0FBZ0JMLElBQWhCLEVBQXNCLENBQUMsU0FBRCxDQUF0QixFQUFtQ0MsSUFBbkMsQ0FEVSxHQUVWLENBQUNGLElBQUQsRUFBT00sTUFBUCxDQUFnQkwsSUFBaEIsQ0FGSjtBQUdBLFdBQU9HLE1BQU1HLElBQU4sQ0FBVyxJQUFYLENBQVA7QUFBdUI7O0FBRXpCSixVQUFRSyxLQUFSLEVBQWU7QUFDYixXQUFPLEtBQUtDLFFBQUwsQ0FBY0QsS0FBZCxFQUFxQkUsT0FBckIsQ0FBUDtBQUFvQzs7QUFFdENELFdBQVNELEtBQVQsRUFBZ0JHLEtBQWhCLEVBQXVCO0FBQ3JCLFFBQUcsQ0FBRUEsS0FBTCxFQUFhO0FBQUNBLGNBQVFDLEtBQUtBLENBQWI7QUFBYztBQUM1QixVQUFNQyxhQUFhLEtBQUtDLGFBQUwsQ0FBbUJOLEtBQW5CLENBQW5CO0FBQ0EsVUFBTU4sT0FBT1MsTUFBUXBCLGdCQUFnQnNCLFdBQVdYLElBQTNCLEVBQWlDLEtBQUthLFlBQXRDLENBQVIsQ0FBYjtBQUNBLFVBQU1kLE9BQU9VLE1BQVFwQixnQkFBZ0JzQixXQUFXWixJQUEzQixFQUFpQyxLQUFLYyxZQUF0QyxDQUFSLENBQWI7QUFDQSxXQUFPLEVBQUlkLElBQUosRUFBVUMsSUFBVixFQUFQO0FBQXFCOztBQUV2QlksZ0JBQWNOLEtBQWQsRUFBcUI7QUFDbkIsUUFBR1EsY0FBY1IsS0FBakIsRUFBeUI7QUFBQ0EsY0FBUSxLQUFLUyxhQUFiO0FBQTBCO0FBQ3BELFVBQU1DLE1BQU0sS0FBS3RCLFNBQWpCO0FBQ0EsVUFBTU0sT0FBT2dCLElBQUlDLEtBQWpCO0FBQ0EsVUFBTWxCLE9BQU8sS0FBS0osV0FBTCxDQUFpQnFCLEdBQWpCLEVBQXNCVixLQUF0QixDQUFiO0FBQ0EsVUFBTVksTUFBTWxCLE9BQU9ELEtBQUtvQixPQUFMLENBQWFuQixLQUFLLENBQUwsQ0FBYixDQUFQLEdBQStCLENBQUMsQ0FBNUM7QUFDQSxRQUFHLENBQUMsQ0FBRCxHQUFLa0IsR0FBUixFQUFjO0FBQ1puQixXQUFLcUIsTUFBTCxDQUFjRixHQUFkLEVBQW1CbkIsS0FBS0ksTUFBeEIsRUFDRSxHQUFJSCxLQUFLb0IsTUFBTCxDQUFZLENBQVosRUFBZXBCLEtBQUtHLE1BQXBCLENBRE47QUFDaUM7QUFDbkMsV0FBTyxFQUFJSixJQUFKLEVBQVVDLElBQVYsRUFBUDtBQUFxQjtBQWpDRixDLFFBQVZSLFMsR0FBQUEsUzs7O0FBbUNiQSxVQUFVNkIsU0FBVixDQUFvQk4sYUFBcEIsR0FBb0MsRUFBcEM7QUFDQXZCLFVBQVU2QixTQUFWLENBQW9CUixZQUFwQixHQUFtQ3ZCLGdCQUFrQixJQUFJZ0MsR0FBSixDQUNuRCxDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixFQUFxQ2xCLE1BQXJDLENBQ0VtQixPQUFPQyxJQUFQLENBQVlDLFFBQVFDLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBWixDQURGLENBRG1ELENBQWxCLENBQW5DLENBS08sU0FBU3JDLGVBQVQsQ0FBeUJzQyxZQUF6QixFQUF1Q2QsWUFBdkMsRUFBcURlLFdBQXJELEVBQWtFO0FBQ3ZFLE1BQUcsQ0FBRUQsWUFBRixJQUFrQixDQUFFQSxhQUFheEIsTUFBcEMsRUFBNkM7QUFDM0MsV0FBTyxFQUFQO0FBQVM7O0FBRVgsTUFBRyxlQUFlLE9BQU9VLFlBQXpCLEVBQXdDO0FBQ3RDQSxtQkFBZXZCLGdCQUFnQnVCLFlBQWhCLENBQWY7QUFBNEM7O0FBRTlDLFFBQU1nQixTQUFTRixhQUFhRyxHQUFiLENBQW1CQyxRQUFTO0FBQ3pDQyxTQUFLRCxJQUFJRSxPQURnQyxFQUN2Qi9CLE9BQU82QixJQUFJRyxLQUFKLENBQVVDLEtBQVYsQ0FBZ0IsT0FBaEIsRUFBeUJDLE1BQXpCLENBQWdDdkIsWUFBaEMsQ0FEZ0IsRUFBVCxDQUFuQixDQUFmOztBQUdBZ0IsU0FBT1EsTUFBUCxDQUFnQixDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZTtBQUM3QkQsUUFBSXBDLEtBQUosR0FBWVgsaUJBQW1CK0MsSUFBSXBDLEtBQXZCLEVBQThCcUMsS0FBS3JDLEtBQW5DLENBQVo7QUFDQSxXQUFPcUMsSUFBUDtBQUFXLEdBRmI7O0FBSUEsTUFBR1gsV0FBSCxFQUFpQjtBQUNmLFdBQU9DLE1BQVA7QUFBYSxHQURmLE1BRUs7QUFDSCxXQUFPQSxPQUFPQyxHQUFQLENBQWFVLFNBQ2xCLENBQUUsVUFBU0EsTUFBTVIsR0FBSSxFQUFyQixFQUNHNUIsTUFESCxDQUNZb0MsTUFBTXRDLEtBRGxCLENBREssQ0FBUDtBQUV5QjtBQUFBLENBRXRCLE1BQU11QyxvQ0FBYyx5QkFBcEI7QUFDQSxTQUFTbkQsZUFBVCxDQUF5Qm9ELFFBQXpCLEVBQW1DO0FBQ3hDLE1BQUcsQ0FBRUEsUUFBTCxFQUFnQjtBQUNkLFdBQU9DLFFBQVFGLFlBQVlHLElBQVosQ0FBaUJELElBQWpCLENBQWY7QUFBcUM7O0FBRXZDLE1BQUcsZUFBZSxPQUFPRCxTQUFTRyxHQUFsQyxFQUF3QztBQUN0QyxVQUFNLElBQUlDLFNBQUosQ0FBaUIscUNBQWpCLENBQU47QUFBMkQ7O0FBRTdELFNBQU9ILFFBQVE7QUFDYixVQUFNSSxJQUFJTixZQUFZRyxJQUFaLENBQWlCRCxJQUFqQixDQUFWO0FBQ0EsUUFBRyxDQUFFSSxDQUFMLEVBQVM7QUFBQztBQUFNO0FBQ2hCLFFBQUdMLFNBQVNHLEdBQVQsQ0FBYUUsRUFBRSxDQUFGLENBQWIsS0FBc0JMLFNBQVNHLEdBQVQsQ0FBYUUsRUFBRSxDQUFGLENBQWIsQ0FBekIsRUFBOEM7QUFBQztBQUFNO0FBQ3JELFVBQU1DLFdBQVdELEVBQUUsQ0FBRixFQUFLWixLQUFMLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFqQjtBQUNBLFFBQUdPLFNBQVNHLEdBQVQsQ0FBYUcsUUFBYixDQUFILEVBQTRCO0FBQUM7QUFBTTtBQUNuQyxXQUFPLElBQVA7QUFBVyxHQU5iO0FBTWEsQ0FFUixTQUFTekQsZ0JBQVQsQ0FBMEIwRCxTQUExQixFQUFxQ0MsVUFBckMsRUFBaUQ7QUFDdEQsTUFBSUMsS0FBS0YsVUFBVTlDLE1BQVYsR0FBbUIsQ0FBNUI7QUFDQSxNQUFJaUQsS0FBS0YsV0FBV0csV0FBWCxDQUF1QkosVUFBVUUsRUFBVixDQUF2QixDQUFUOztBQUVBO0FBQ0EsTUFBRyxDQUFDLENBQUQsS0FBT0MsRUFBVixFQUFlO0FBQUMsV0FBT0gsU0FBUDtBQUFnQjtBQUNoQyxTQUFNRSxNQUFNLENBQU4sSUFBV0MsTUFBTSxDQUFqQixJQUFzQkgsVUFBVUUsRUFBVixNQUFrQkQsV0FBV0UsRUFBWCxDQUE5QyxFQUErRDtBQUM3REQsU0FBTUM7QUFBSTs7QUFFWixTQUFPSCxVQUFVSyxLQUFWLENBQWdCLENBQWhCLEVBQW1CSCxLQUFHLENBQXRCLENBQVA7QUFBK0I7O0FBRWpDLFNBQVMzQyxPQUFULENBQWlCK0MsR0FBakIsRUFBc0I7QUFBRyxTQUFPQSxJQUFJbEIsTUFBSixDQUFhLENBQUNtQixDQUFELEVBQUdDLENBQUgsS0FBU0QsRUFBRXBELE1BQUYsQ0FBU3FELENBQVQsQ0FBdEIsRUFBbUMsRUFBbkMsQ0FBUDtBQUE0QyIsImZpbGUiOiJ0cmFjZWJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjbGFzcyBUcmFjZWJhY2sgOjpcbiAgY29uc3RydWN0b3IodHJhY2VfdGlwLCBhc0ZyYW1lTGlzdCkgOjpcbiAgICB0aGlzLnRyYWNlX3RpcCA9IHRyYWNlX3RpcFxuICAgIHRoaXMuYXNGcmFtZUxpc3QgPSBhc0ZyYW1lTGlzdFxuXG4gIGdldCBhc3luY19zdGFjaygpIDo6IHJldHVybiB0aGlzLnRvU3RyaW5nKClcblxuICB0b1N0cmluZyhsZWFkPScnKSA6OlxuICAgIGNvbnN0IHt0YWlsLCBoZWFkfSA9IHRoaXMudG9MaW5lcygpXG4gICAgY29uc3QgbGluZXMgPSBoZWFkLmxlbmd0aFxuICAgICAgPyBbbGVhZF0uY29uY2F0IEAgdGFpbCwgWycgICAgLi4uJ10sIGhlYWRcbiAgICAgIDogW2xlYWRdLmNvbmNhdCBAIHRhaWxcbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJylcblxuICB0b0xpbmVzKGxpbWl0KSA6OlxuICAgIHJldHVybiB0aGlzLnRvRnJhbWVzKGxpbWl0LCBmbGF0dGVuKVxuXG4gIHRvRnJhbWVzKGxpbWl0LCB4Zm9ybSkgOjpcbiAgICBpZiAhIHhmb3JtIDo6IHhmb3JtID0gdiA9PiB2XG4gICAgY29uc3QgZXJyX2ZyYW1lcyA9IHRoaXMudG9FcnJvckZyYW1lcyhsaW1pdClcbiAgICBjb25zdCBoZWFkID0geGZvcm0gQCBkaWZmX3N0YWNrX2xpc3QoZXJyX2ZyYW1lcy5oZWFkLCB0aGlzLnN0YWNrX2ZpbHRlcilcbiAgICBjb25zdCB0YWlsID0geGZvcm0gQCBkaWZmX3N0YWNrX2xpc3QoZXJyX2ZyYW1lcy50YWlsLCB0aGlzLnN0YWNrX2ZpbHRlcilcbiAgICByZXR1cm4gQHt9IHRhaWwsIGhlYWRcblxuICB0b0Vycm9yRnJhbWVzKGxpbWl0KSA6OlxuICAgIGlmIHVuZGVmaW5lZCA9PT0gbGltaXQgOjogbGltaXQgPSB0aGlzLmRlZmF1bHRfbGltaXRcbiAgICBjb25zdCB0aXAgPSB0aGlzLnRyYWNlX3RpcFxuICAgIGNvbnN0IGhlYWQgPSB0aXAuZWFybHlcbiAgICBjb25zdCB0YWlsID0gdGhpcy5hc0ZyYW1lTGlzdCh0aXAsIGxpbWl0KVxuICAgIGNvbnN0IGlkeCA9IGhlYWQgPyB0YWlsLmluZGV4T2YoaGVhZFswXSkgOiAtMVxuICAgIGlmIC0xIDwgaWR4IDo6XG4gICAgICB0YWlsLnNwbGljZSBAIGlkeCwgdGFpbC5sZW5ndGgsXG4gICAgICAgIC4uLiBoZWFkLnNwbGljZSgwLCBoZWFkLmxlbmd0aClcbiAgICByZXR1cm4gQHt9IHRhaWwsIGhlYWRcblxuVHJhY2ViYWNrLnByb3RvdHlwZS5kZWZhdWx0X2xpbWl0ID0gMTBcblRyYWNlYmFjay5wcm90b3R5cGUuc3RhY2tfZmlsdGVyID0gYXNfc3RhY2tfZmlsdGVyIEAgbmV3IFNldCBAXG4gIFsnYm9vdHN0cmFwX25vZGUnLCAnQXN5bmNIb29rLmluaXQnXS5jb25jYXQgQFxuICAgIE9iamVjdC5rZXlzKHByb2Nlc3MuYmluZGluZygnbmF0aXZlcycpKVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmX3N0YWNrX2xpc3QoZXJyb3JfZnJhbWVzLCBzdGFja19maWx0ZXIsIGFzUmF3RnJhbWVzKSA6OlxuICBpZiAhIGVycm9yX2ZyYW1lcyB8fCAhIGVycm9yX2ZyYW1lcy5sZW5ndGggOjpcbiAgICByZXR1cm4gW11cblxuICBpZiAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3RhY2tfZmlsdGVyIDo6XG4gICAgc3RhY2tfZmlsdGVyID0gYXNfc3RhY2tfZmlsdGVyKHN0YWNrX2ZpbHRlcilcblxuICBjb25zdCBmcmFtZXMgPSBlcnJvcl9mcmFtZXMubWFwIEAgZXJyID0+IEA6XG4gICAga2V5OiBlcnIubWVzc2FnZSwgbGluZXM6IGVyci5zdGFjay5zcGxpdCgvXFxyP1xcbi8pLmZpbHRlcihzdGFja19maWx0ZXIpXG5cbiAgZnJhbWVzLnJlZHVjZSBAIChjdXIsIHByZXYpID0+IDo6XG4gICAgY3VyLmxpbmVzID0gZGlmZl9mcmFtZV9saW5lcyBAIGN1ci5saW5lcywgcHJldi5saW5lc1xuICAgIHJldHVybiBwcmV2XG5cbiAgaWYgYXNSYXdGcmFtZXMgOjpcbiAgICByZXR1cm4gZnJhbWVzXG4gIGVsc2UgOjpcbiAgICByZXR1cm4gZnJhbWVzLm1hcCBAIGZyYW1lID0+XG4gICAgICBbYCAgICAtLSAke2ZyYW1lLmtleX1gXVxuICAgICAgICAuY29uY2F0IEAgZnJhbWUubGluZXNcblxuZXhwb3J0IGNvbnN0IHJ4X3N0YWNrX2F0ID0gL1xccythdFxccyguKilcXHMrXFwoKC4qKVxcKSQvXG5leHBvcnQgZnVuY3Rpb24gYXNfc3RhY2tfZmlsdGVyKHN1cHByZXNzKSA6OlxuICBpZiAhIHN1cHByZXNzIDo6XG4gICAgcmV0dXJuIGxpbmUgPT4gcnhfc3RhY2tfYXQuZXhlYyhsaW5lKVxuXG4gIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdXBwcmVzcy5oYXMgOjpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgYEV4cGVjdGVkIHNldC1saWtlIHN1cHByZXNzIGluc3RhbmNlYFxuXG4gIHJldHVybiBsaW5lID0+IDo6XG4gICAgY29uc3QgbSA9IHJ4X3N0YWNrX2F0LmV4ZWMobGluZSlcbiAgICBpZiAhIG0gOjogcmV0dXJuXG4gICAgaWYgc3VwcHJlc3MuaGFzKG1bMV0pIHx8IHN1cHByZXNzLmhhcyhtWzJdKSA6OiByZXR1cm5cbiAgICBjb25zdCBiYXNlbmFtZSA9IG1bMl0uc3BsaXQoJy4nKVswXVxuICAgIGlmIHN1cHByZXNzLmhhcyhiYXNlbmFtZSkgOjogcmV0dXJuXG4gICAgcmV0dXJuIHRydWVcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZfZnJhbWVfbGluZXMoY3VyX2xpbmVzLCBwcmV2X2xpbmVzKSA6OlxuICBsZXQgaTAgPSBjdXJfbGluZXMubGVuZ3RoIC0gMVxuICBsZXQgaTEgPSBwcmV2X2xpbmVzLmxhc3RJbmRleE9mKGN1cl9saW5lc1tpMF0pXG5cbiAgLy8gbWF0Y2ggZnJvbSB0aGUgdGFpbCBvZiBjdXJfbGluZXMgYW5kIHdhbGsgYmFja3dhcmQgdW50aWwgZGlmZmVyZW5jZSBpcyBmb3VuZFxuICBpZiAtMSA9PT0gaTEgOjogcmV0dXJuIGN1cl9saW5lc1xuICB3aGlsZSBpMCA+PSAwICYmIGkxID49IDAgJiYgY3VyX2xpbmVzW2kwXSA9PT0gcHJldl9saW5lc1tpMV0gOjpcbiAgICBpMC0tOyBpMS0tXG5cbiAgcmV0dXJuIGN1cl9saW5lcy5zbGljZSgwLCBpMCsxKVxuXG5mdW5jdGlvbiBmbGF0dGVuKGxzdCkgOjogcmV0dXJuIGxzdC5yZWR1Y2UgQCAoYSxiKSA9PiBhLmNvbmNhdChiKSwgW11cblxuIl19