const defaultColors = {
  keyColor: "var(--primary-color)",
  numberColor: "#164",
  stringColor: "rgb(0,187,0)",
  trueColor: "lightseagreen",
  falseColor: "#f66578",
  nullColor: "cornflowerblue"
};

const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#x60;",
  "=": "&#x3D;"
};

function escapeHtml(html) {
  return String(html).replace(/[&<>"'`=]/g, function (s) {
    return entityMap[s];
  });
}

export default function (data, colorOptions = {}) {
  let json;
  const valueType = typeof data;
  if (valueType !== "string") {
    json = JSON.stringify(data, null, 2) || valueType;
  } else {
    json = data;
  }
  let colors = Object.assign({}, defaultColors, colorOptions);
  json = json.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
  json = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g,
    (match) => {
      let color = colors.numberColor;
      let style = "";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = colors.keyColor;
        } else {
          color = colors.stringColor;
          const value = escapeHtml(match.substr(1, match.length - 2));
          match = '"' + value + '"';
          style = "word-wrap:break-word;white-space:pre-wrap;";
        }
      } else {
        color = /true/.test(match)
          ? colors.trueColor
          : /false/.test(match)
          ? colors.falseColor
          : /null/.test(match)
          ? colors.nullColor
          : color;
      }
      return `<span style="${style}color:${color}">${match}</span>`;
    }
  );

  return json;
}
