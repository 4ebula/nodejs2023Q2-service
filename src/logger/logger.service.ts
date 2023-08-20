import { Injectable, Logger } from '@nestjs/common';
import { WriteStream, createWriteStream, mkdirSync, statSync } from 'fs';

@Injectable()
export class LoggerService extends Logger {
  private readonly path = './logs';
  private readonly sizeLimit = parseInt(process.env.LOG_SIZE) * 1024;
  private currentFileName: string;
  private requestWs: WriteStream;

  private requestDataStack: string[] = [];
  private isWriteInProgress = false;

  constructor() {
    super();
    this.checkFolderExistance();
  }

  log({ url, method, query, body, code }): void {
    const data = `${url}\t${method}\t${JSON.stringify(query)}\t${JSON.stringify(
      body,
    )}\t${code}`;

    // super.log(data);
    this.requestDataStack.push(data);
    this.writeToFile();
  }

  private async writeToFile(): Promise<void> {
    if (this.isWriteInProgress) {
      return;
    }

    do {
      this.isWriteInProgress = true;
      if (!this.currentFileName) {
        this.currentFileName = this.createFileName();
      }

      const path = `${this.path}/requests-${this.currentFileName}.log`;

      if (!this.requestWs) {
        this.requestWs = createWriteStream(path, 'utf-8');
      } else {
        try {
          const { size } = statSync(path);
          if (size > this.sizeLimit) {
            this.currentFileName = this.createFileName();
            const newPath = `${this.path}/requests-${this.currentFileName}.log`;
            this.requestWs = createWriteStream(newPath, 'utf-8');
          }
        } catch {
          this.requestWs = createWriteStream(path, 'utf-8');
        }
      }

      const data = this.requestDataStack.pop();
      await this.write(data);
    } while (this.requestDataStack.length);

    this.isWriteInProgress = false;
  }

  private checkFolderExistance(): void {
    mkdirSync(this.path, { recursive: true });
  }

  private async write(data: string): Promise<void> {
    return new Promise((resolve) => {
      const ok = this.requestWs.write(data + '\n');
      if (!ok) {
        this.requestWs.once('drain', () => resolve());
      } else {
        resolve();
      }
    });
  }

  private createFileName(): string {
    return new Date().toISOString().slice(0, -5).replace(/\:/g, '-');
  }
}
