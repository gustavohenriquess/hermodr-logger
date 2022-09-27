let hasDatabase: boolean,
  Log,
  mongoose,
  stackEnable = false;

const settings = {
  LOG: "\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
  DEBUG: "\x1b[43m\x1b[31m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
  WARN: "\x1b[45m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
  ERROR: "\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
};

function formattedDateTime(date: Date) {
  let day: string;
  let month: string;
  let year: string;
  let hour: string;
  let minutes: string;
  let seconds: string;
  let dateReturn: string;

  day = date.getDate().toString();
  month = (date.getMonth() + 1).toString();
  year = date.getFullYear().toString();
  hour = date.getHours().toString();
  minutes = date.getMinutes().toString();
  seconds = date.getSeconds().toString();

  day = day.length == 1 ? "0" + day : day;
  month = month.length == 1 ? "0" + month : month;
  hour = hour.length == 1 ? "0" + hour : hour;
  minutes = minutes.length == 1 ? "0" + minutes : minutes;
  seconds = seconds.length == 1 ? "0" + seconds : seconds;

  dateReturn =
    year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;

  return dateReturn;
}

try {
  mongoose = require("mongoose");
  const logSchema = new mongoose.Schema({
    level: String,
    marker: String,
    date: String,
    messages: [],
    stack: String,
  });

  Log = mongoose.model("Log", logSchema);
  hasDatabase = true;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI NOT FOUND");
  }
} catch (error) {
  let date = formattedDateTime(new Date());
  console.log(
    `\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m`,
    ` ERROR `,
    ` hermodr.ts`,
    ` ${date} `,
    error.message
  );
  hasDatabase = false;
}

function makeLog(
  level: string,
  marker: string,
  date: string,
  messages: string[]
) {
  const style = settings[level];

  console.log(
    `${style}`,
    ` ${level} `,
    ` ${marker} `,
    ` ${date} `,
    ` ${messages} `
  );
  if (stackEnable || level == "DEBUG" || level == "ERROR")
    console.log(getStack());

  insertDatabase(level, marker, date, messages);
}

function insertDatabase(
  level: string,
  marker: string,
  date: string,
  messages: string[]
) {
  if (!hasDatabase) return;

  const object = {
    level: level,
    marker: marker,
    date: date,
    messages: messages,
  };

  if (stackEnable || level == "DEBUG" || level == "ERROR")
    object["stack"] = getStack();

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      await Log.create(object);
      mongoose.connection.close();
    })
    .catch((error) => {
      mongoose.connection.close();
      const fileName = __filename.split(/[\\/]/).pop();
      console.log(error.stack);
      console.log(
        `\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m`,
        ` ERROR `,
        ` ${fileName}`,
        ` ${date} `,
        ` ${error}`
      );
    });
}

const getMarker = () => {
  const stack = new Error().stack;
  const stackArray = stack.split("\n");
  const caller = stackArray[3];
  const callerArray = caller.split("/");
  const file = callerArray[callerArray.length - 1];
  const fileArray = file.split(":");
  const marker = fileArray[0];

  return marker;
};

const getStack = () => {
  const stack = new Error().stack;
  const stackArray = stack.split("\n");
  stackArray.shift();
  stackArray.shift();
  stackArray.shift();
  stackArray.shift();

  return stackArray.join("\n");
};

const Hermodr = {
  log: (...messages) => {
    let date = formattedDateTime(new Date());
    let level = "LOG";

    makeLog(level, getMarker(), date, messages);
  },
  debug: (...messages) => {
    let date = formattedDateTime(new Date());
    let level = "DEBUG";

    makeLog(level, getMarker(), date, messages);
  },
  warn: (...messages) => {
    let date = formattedDateTime(new Date());
    let level = "WARN";

    makeLog(level, getMarker(), date, messages);
  },
  error: (...messages) => {
    let date = formattedDateTime(new Date());
    let level = "ERROR";

    makeLog(level, getMarker(), date, messages);
  },
  config: (options) => {
    if (options.stack) stackEnable = true;
  },
};

module.exports = Hermodr;
