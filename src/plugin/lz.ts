const code2char = String.fromCharCode;

const _compress = (
  uncompressed: string,
  bitsPerChar: number,
  getCharFromInt: (i: number) => string
) => {
  if (uncompressed == null) return "";
  const context_dictionary: {[key: string]: number} = {};
  const context_dictionaryToCreate: {[key: string]: boolean} = {};
  let context_data: string[] = [];
  let i;
  let ii;
  let value;
  let context_c = "";
  let context_wc = "";
  let context_w: string = "";
  let context_enlargeIn = 2; // Compensate for the first entry which should not count
  let context_dictSize = 3;
  let context_numBits = 2;
  let context_data_val = 0;
  let context_data_position = 0;

  for (ii = 0; ii < uncompressed.length; ii += 1) {
    context_c = uncompressed.charAt(ii);
    if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
      context_dictionary[context_c] = context_dictSize++;
      context_dictionaryToCreate[context_c] = true;
    }

    context_wc = context_w + context_c;
    if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
      context_w = context_wc;
    }
    else {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)< 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            }
            else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            }
            else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            }
            else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            }
            else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      }
      else {
        value = context_dictionary[context_w];
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          }
          else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      // Add wc to the dictionary.
      context_dictionary[context_wc] = context_dictSize++;
      context_w = String(context_c);
    }
  }

  // Output the code for w.
  if (context_w !== "") {
    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
      if (context_w.charCodeAt(0)< 256) {
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
        }
        value = context_w.charCodeAt(0);
        for (i = 0; i < 8; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      } else {
        value = 1;
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | value;
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = 0;
        }
        value = context_w.charCodeAt(0);
        for (i = 0; i < 16; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
      delete context_dictionaryToCreate[context_w];
    } else {
      value = context_dictionary[context_w];
      for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value&1);
        if (context_data_position == bitsPerChar-1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }
    }
    context_enlargeIn--;
    if (context_enlargeIn == 0) {
      context_enlargeIn = Math.pow(2, context_numBits);
      context_numBits++;
    }
  }

  // Mark the end of the stream
  value = 2;
  for (i = 0; i < context_numBits; i++) {
    context_data_val = (context_data_val << 1) | (value & 1);
    if (context_data_position == bitsPerChar-1) {
      context_data_position = 0;
      context_data.push(getCharFromInt(context_data_val));
      context_data_val = 0;
    }
    else {
      context_data_position++;
    }
    value = value >> 1;
  }

  // Flush the last char
  while (true) {
    context_data_val = (context_data_val << 1);
    if (context_data_position == bitsPerChar-1) {
      context_data.push(getCharFromInt(context_data_val));
      break;
    }
    else context_data_position++;
  }
  return context_data.join('');
};

const _decompress = (
  length: number,
  resetValue: number,
  getCodeAt: (index: number) => number
) => {
  const dictionary: (string | number)[] = [];
  const data = {val:getCodeAt(0), position:resetValue, index:1};
  var enlargeIn = 4;
  var dictSize = 4;
  var numBits = 3;
  var entry: string = "";
  var result = [];
  var i;
  var w: string;
  var bits, resb, maxpower, power;
  var c: number | string;

  for (i = 0; i < 3; i += 1) {
    dictionary[i] = i;
  }

  bits = 0;
  maxpower = Math.pow(2,2);
  power=1;
  while (power!=maxpower) {
    resb = data.val & data.position;
    data.position >>= 1;
    if (data.position == 0) {
      data.position = resetValue;
      data.val = getCodeAt(data.index++);
    }
    bits |= (resb>0 ? 1 : 0) * power;
    power <<= 1;
  }

  switch (bits) {
    case 0:
      bits = 0;
      maxpower = Math.pow(2,8);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getCodeAt(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = code2char(bits);
      break;
    case 1:
      bits = 0;
      maxpower = Math.pow(2,16);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getCodeAt(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }
      c = code2char(bits);
      break;
    case 2:
      return "";
  }
  dictionary[3] = c;
  w = c;
  result.push(c);
  while (true) {
    if (data.index > length) {
      return "";
    }

    bits = 0;
    maxpower = Math.pow(2,numBits);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getCodeAt(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (c = bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2,8);
        power=1;
        while (power!=maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getCodeAt(data.index++);
          }
          bits |= (resb>0 ? 1 : 0) * power;
          power <<= 1;
        }

        dictionary[dictSize++] = code2char(bits);
        c = dictSize-1;
        enlargeIn--;
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2,16);
        power=1;
        while (power!=maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getCodeAt(data.index++);
          }
          bits |= (resb>0 ? 1 : 0) * power;
          power <<= 1;
        }
        dictionary[dictSize++] = code2char(bits);
        c = dictSize-1;
        enlargeIn--;
        break;
      case 2:
        return result.join('');
    }

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }

    if (dictionary[c]) {
      entry = dictionary[c];
    } else {
      if (c === dictSize) {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }
    result.push(entry);

    // Add w+entry[0] to the dictionary.
    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;

    w = entry;

    if (enlargeIn == 0) {
      enlargeIn = Math.pow(2, numBits);
      numBits++;
    }
  }
};

const lzCompressUtf16 = (input: string) => {
  return _compress(input, 15, (a: number) => code2char(a+32)) + " ";
};

const lzDecompressUtf16 = (compressed: string) => {
  if (compressed == null) return "";
  if (compressed == "") return null;
  return _decompress(compressed.length, 16384, (index: number) => { return compressed.charCodeAt(index) - 32; });
};

export {
  lzCompressUtf16,
  lzDecompressUtf16,
};
