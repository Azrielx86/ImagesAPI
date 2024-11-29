import * as tracer from 'tracer';
import {appendFile} from "node:fs"
import {hostname} from 'os';

const procLogLevel: number = parseInt(process.env.LOGLEVEL || "0");
const levels: { [level: number]: string } = {
  0: 'log',
  1: 'trace',
  2: 'debug',
  3: 'info',
  4: 'warn',
  5: 'error',
};
export const logger = tracer.colorConsole({
  level: levels[procLogLevel],
  dateformat: 'HH:MM:ss.L',
  format: '{{timestamp}} [{{title}}] {{message}} (in {{file}}:{{line}})',
  transport: [
    (data) => {
      console.log(data.output)
    },
    (data) => {
      appendFile(`${hostname()}.log`, data.rawoutput + '\n', (err) => {
        if (err) throw err;
      })
    }
  ]
}) as {
  info: (...args: any[]) => void,
  warn: (...args: any[]) => void,
  debug: (...args: any[]) => void,
  error: (...args: any[]) => void,
  log: (...args: any[]) => void,
};
