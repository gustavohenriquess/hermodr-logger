class Hermodr {
  private hasDatabase = false;
  private Log;
  private mongoose;
  private stackEnable = false;
  private settings = {
    LOG: "\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    WARN: "\x1b[43m\x1b[31m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    DEBUG: "\x1b[45m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    ERROR: "\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
  };

  constructor() {
    try {
      this.mongoose = require("mongoose");
      const logSchema = new this.mongoose.Schema({
        level: String,
        marker: String,
        date: String,
        messages: [],
        stack: String,
      });

      this.Log = this.mongoose.model("Log", logSchema);
      this.hasDatabase = true;

      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI NOT FOUND");
      }
    } catch (error) {
      let date = this.formattedDateTime(new Date());
      console.log(
        `\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m`,
        ` ERROR `,
        ` ${this.getMarker()}`,
        ` ${date} `,
        error.message
      );
      this.hasDatabase = false;
    }
  }

  config(options) {
    if (options?.stack) this.stackEnable = true;
  }
  log(...messages) {
    let date = this.formattedDateTime(new Date());
    let level = "LOG";

    this.makeLog(level, this.getMarker(), date, messages);
  }
  debug(...messages) {
    let date = this.formattedDateTime(new Date());
    let level = "DEBUG";

    this.makeLog(level, this.getMarker(), date, messages);
  }
  warn(...messages) {
    let date = this.formattedDateTime(new Date());
    let level = "WARN";

    this.makeLog(level, this.getMarker(), date, messages);
  }
  error(...messages) {
    let date = this.formattedDateTime(new Date());
    let level = "ERROR";

    this.makeLog(level, this.getMarker(), date, messages);
  }

  private getMarker = () => {
    const stack = new Error().stack;
    const stackArray = stack.split("\n");
    const caller = stackArray[3];
    const callerArray = caller.split("/");
    const file = callerArray[callerArray.length - 1];
    const fileArray = file.split(":");
    const marker = fileArray[0];

    return marker;
  };

  private getStack = () => {
    const stack = new Error().stack;
    const stackArray = stack.split("\n");
    stackArray.shift();
    stackArray.shift();
    stackArray.shift();
    stackArray.shift();

    return stackArray.join("\n");
  };

  private formattedDateTime(date: Date) {
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
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hour +
      ":" +
      minutes +
      ":" +
      seconds;

    return dateReturn;
  }

  private makeLog(
    level: string,
    marker: string,
    date: string,
    messages: string[]
  ) {
    const style = this.settings[level];

    console.log(
      `${style}`,
      ` ${level} `,
      ` ${marker} `,
      ` ${date} `,
      ` ${messages} `
    );
    if (this.stackEnable || level == "DEBUG" || level == "ERROR")
      console.log(this.getStack());

    this.insertDatabase(level, marker, date, messages);
  }

  private insertDatabase(
    level: string,
    marker: string,
    date: string,
    messages: string[]
  ) {
    if (!this.hasDatabase) return;

    const object = {
      level: level,
      marker: marker,
      date: date,
      messages: messages,
    };

    if (this.stackEnable || level == "DEBUG" || level == "ERROR")
      object["stack"] = this.getStack();

    this.mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        await this.Log.create(object);
        this.mongoose.connection.close();
      })
      .catch((error) => {
        this.mongoose.connection.close();
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
}

module.exports = new Hermodr();
