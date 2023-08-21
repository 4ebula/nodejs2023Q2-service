import { Injectable, Logger } from '@nestjs/common';
import { WriteStream, createWriteStream, mkdirSync, statSync } from 'fs';
import { LogTypes } from './models';

@Injectable()
export class LoggerService extends Logger {
  private readonly path = './logs';
  private readonly sizeLimit = parseInt(process.env.LOG_SIZE) * 1024;
  private logLevel: number = 0;

  private requestWs: WriteStream;
  private currentRequestsFileName: string;
  private requestDataStack: string[] = [];
  private isRequestWriteInProgress = false;

  private errorWs: WriteStream;
  private currentErrorFileName: string;
  private errorDataStack: string[] = [];
  private isErrorWriteInProgress = false;

  private logWs: WriteStream;
  private currentLogFileName: string;
  private logDataStack: string[] = [];
  private isLogWriteInProgress = false;

  constructor() {
    super();
    const logLevel = parseInt(process.env.LOG_LEVEL);
    this.logLevel = Number.isNaN(logLevel) ? 0 : logLevel;
    console.log(this.logLevel);
    this.checkFolderExistance();
  }

  error(message: any): void {
    if (this.logLevel > 0) {
      super.error(message);

      this.errorDataStack.push(message);
      this.writeError();
    }
  }

  warn(message: any): void {
    if (this.logLevel > 1) {
      super.warn(message);
      this.logDataStack.push(message);

      this.writeLog();
    }
  }

  verbose(message: any): void {
    if (this.logLevel > 4) {
      super.verbose(message);
      this.logDataStack.push(message);

      this.writeLog();
    }
  }

  debug(message: any): void {
    if (this.logLevel > 3) {
      super.debug(message);
      this.logDataStack.push(message);

      this.writeLog();
    }
  }

  log(message: any): void {
    if (this.logLevel > 2) {
      this.logRequest(message);
    }
  }

  logRequest(message: any): void {
    super.log(message);

    this.requestDataStack.push(message);
    this.writeRequestsToFile();
  }

  private async writeError(): Promise<void> {
    if (this.isErrorWriteInProgress) {
      return;
    }

    do {
      this.isErrorWriteInProgress = true;
      if (!this.currentErrorFileName) {
        this.currentErrorFileName = this.createFileName(LogTypes.Error);
      }

      const path = this.getFilePath(this.currentErrorFileName);

      if (!this.errorWs) {
        this.errorWs = createWriteStream(path, 'utf-8');
      } else {
        try {
          const { size } = statSync(path);
          if (size > this.sizeLimit) {
            this.currentErrorFileName = this.createFileName(LogTypes.Error);
            this.errorWs = createWriteStream(
              this.getFilePath(this.currentErrorFileName),
              'utf-8',
            );
          }
        } catch {
          this.errorWs = createWriteStream(path, 'utf-8');
        }
      }

      const data = this.errorDataStack.pop();
      await this.write(data, this.errorWs);
    } while (this.errorDataStack.length);

    this.isErrorWriteInProgress = false;
  }

  private async writeRequestsToFile(): Promise<void> {
    if (this.isRequestWriteInProgress) {
      return;
    }

    do {
      this.isRequestWriteInProgress = true;
      if (!this.currentRequestsFileName) {
        this.currentRequestsFileName = this.createFileName(LogTypes.Request);
      }

      const path = this.getFilePath(this.currentRequestsFileName);

      if (!this.requestWs) {
        this.requestWs = createWriteStream(path, 'utf-8');
      } else {
        try {
          const { size } = statSync(path);
          if (size > this.sizeLimit) {
            this.currentRequestsFileName = this.createFileName(
              LogTypes.Request,
            );
            this.requestWs = createWriteStream(
              this.getFilePath(this.currentRequestsFileName),
              'utf-8',
            );
          }
        } catch {
          this.requestWs = createWriteStream(path, 'utf-8');
        }
      }

      const data = this.requestDataStack.pop();
      await this.write(data, this.requestWs);
    } while (this.requestDataStack.length);

    this.isRequestWriteInProgress = false;
  }

  private async writeLog(): Promise<void> {
    if (this.isLogWriteInProgress) {
      return;
    }

    do {
      this.isLogWriteInProgress = true;
      if (!this.currentLogFileName) {
        this.currentLogFileName = this.createFileName(LogTypes.Common);
      }

      const path = this.getFilePath(this.currentLogFileName);

      if (!this.logWs) {
        this.logWs = createWriteStream(path, 'utf-8');
      } else {
        try {
          const { size } = statSync(path);
          if (size > this.sizeLimit) {
            this.currentLogFileName = this.createFileName(LogTypes.Common);
            this.logWs = createWriteStream(
              this.getFilePath(this.currentLogFileName),
              'utf-8',
            );
          }
        } catch {
          this.logWs = createWriteStream(path, 'utf-8');
        }
      }

      const data = this.logDataStack.pop();
      await this.write(data, this.logWs);
    } while (this.logDataStack.length);

    this.isLogWriteInProgress = false;
  }

  private checkFolderExistance(): void {
    mkdirSync(this.path, { recursive: true });
  }

  private async write(data: string, ws: WriteStream): Promise<void> {
    return new Promise((resolve) => {
      const ok = ws.write(data + '\n');
      if (!ok) {
        ws.once('drain', () => resolve());
      } else {
        resolve();
      }
    });
  }

  private createFileName(type: LogTypes): string {
    const date = new Date().toISOString().slice(0, -5).replace(/\:/g, '-');
    return `${type}-${date}.log`;
  }

  private getFilePath(fileName: string): string {
    return `${this.path}/${fileName}`;
  }
}
