const sanitizeAndEscapeInput = (input) => {
    // Recursively unpack object to sanitize string input
    if (typeof input === 'object') {
        for (const key in input) {
          if (typeof input[key] === 'string') {
            input[key] = sanitizeAndEscapeInput(input[key]);
          } else if (typeof input[key] === 'object') {
            input[key] = sanitizeAndEscapeInput(input[key]);
          }
        }
        return input;
      } else if (typeof input === 'string') {
        return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        // Specifically prevent SQL injection
        .replace(/;/g, "&#59;")           // SQL ending semicolon
        .replace(/--/g, "&#45;&#45;")     // SQL comment start -- not escaping will break some queries
        .replace(/%/g, "&#37;")           // SQL wildcard
        .replace(/\(/g, "&#40;")          // SQL parenthesis
        .replace(/\)/g, "&#41;");         // SQL paranthesis
    } else { // ignore non string inputs
        return input;
      }
}

module.exports = { sanitizeAndEscapeInput };