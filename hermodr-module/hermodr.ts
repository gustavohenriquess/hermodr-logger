class Hermodr {
  private hasDatabase = false;
  private stackEnable = false;
  private database;
  private databaseUri;
  private databaseName;
  private settings = {
    LOG: "\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    WARN: "\x1b[43m\x1b[31m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    DEBUG: "\x1b[45m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
    ERROR: "\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m",
  };

  constructor() {}

  config(options: {
    stack?: boolean;
    database?: {
      database: boolean;
      database_name: string;
      database_uri: string;
    };
  }): Promise<void> {
    if (options?.stack) this.stackEnable = true;
    if (options?.database && options?.database.database) {
      this.hasDatabase = options.database.database;
      this.databaseUri = options.database.database_uri;
      this.databaseName = options.database.database_name;
      this.database = new Databases(this.databaseName, this.databaseUri);
    }

    return;
  }
  log(...messages): Promise<void> {
    let date = this.formattedDateTime(new Date());
    let level = "LOG";

    this.makeLog(level, this.getMarker(3), date, messages);
    return;
  }
  debug(...messages): Promise<void> {
    let date = this.formattedDateTime(new Date());
    let level = "DEBUG";

    this.makeLog(level, this.getMarker(3), date, messages);
    return;
  }
  warn(...messages): Promise<void> {
    let date = this.formattedDateTime(new Date());
    let level = "WARN";

    this.makeLog(level, this.getMarker(3), date, messages);
    return;
  }
  error(...messages): Promise<void> {
    let date = this.formattedDateTime(new Date());
    let level = "ERROR";

    this.makeLog(level, this.getMarker(3), date, messages);
    return;
  }

  private getMarker = (line: number): string => {
    const stack = new Error().stack;
    const stackArray = stack.split("\n");
    const caller = stackArray[line];
    const callerArray = caller.split("/");
    const file = callerArray[callerArray.length - 1];
    const fileArray = file.split(":");
    const marker = fileArray[0];

    return marker;
  };

  private getStack = (): string => {
    const stack = new Error().stack;
    const stackArray = stack.split("\n");

    stackArray.slice(9);

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

  private async makeLog(
    level: string,
    marker: string,
    date: string,
    messages: string[]
  ): Promise<void> {
    const style = this.settings[level];
    let stack;
    console.log(
      `${style}`,
      ` ${level} `,
      ` ${marker} `,
      ` ${date} `,
      ` ${messages} `
    );
    if (this.stackEnable || level == "DEBUG" || level == "ERROR") {
      stack = this.getStack();
      console.log(stack);
    }

    if (!this.hasDatabase || !this.databaseUri) return;
    await this.database.insert(level, marker, date, messages, stack);

    return;
  }
}

class Databases {
  private Log;
  private mongoose;
  private database;
  private logSchema = {
    level: String,
    marker: String,
    date: String,
    messages: [],
    stack: String,
  };

  constructor(dbName: string, uri: string) {
    switch (dbName) {
      case "mongodb":
        this.database = dbName;
        this.configMongoDB(uri);
        break;

      default:
        break;
    }
  }

  async insert(
    level: string,
    marker: string,
    date: string,
    messages: string[],
    stack: string
  ) {
    switch (this.database) {
      case "mongodb":
        this.mongoDB(level, marker, date, messages, stack);
        break;

      default:
        break;
    }
  }

  async configMongoDB(uri): Promise<void> {
    try {
      this.mongoose = require("mongoose");
      const logSchema = new this.mongoose.Schema(this.logSchema);

      this.Log = new this.mongoose.model("Log", logSchema);

      if (!uri) {
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
    }
  }

  async mongoDB(
    level: string,
    marker: string,
    date: string,
    messages: string[],
    stack: string
  ): Promise<void> {
    const object = {
      level,
      marker,
      date,
      messages,
      stack,
    };

    await this.mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        await this.Log.create(object);
        // await this.mongoose.connection.close();
      })
      .catch(async (error) => {
        await this.mongoose.connection.close();
        const fileName = __filename.split(/[\\/]/).pop();
        console.log(
          `\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m`,
          ` ERROR `,
          ` ${fileName}`,
          ` ${date} `,
          ` ${error}`
        );
        console.log(error.stack);
      });

    return;
  }

  private getMarker = (): string => {
    const stack = new Error().stack;
    const stackArray = stack.split("\n");
    const caller = stackArray[4];
    const callerArray = caller.split("/");
    const file = callerArray[callerArray.length - 1];
    const fileArray = file.split(":");
    const marker = fileArray[0];

    return marker;
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
}

module.exports = new Hermodr();
