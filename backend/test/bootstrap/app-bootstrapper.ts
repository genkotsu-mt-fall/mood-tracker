import { INestApplication } from '@nestjs/common';
import { setupE2EApp } from 'test/utils/setup-e2e-app';

export class AppBootstrapper {
  private static app: INestApplication;

  static async init() {
    this.app = await setupE2EApp();
  }

  static getApp(): INestApplication {
    if (!this.app) throw new Error('AppBootstrapper: App not initialized');
    return this.app;
  }

  static async shutdown() {
    await this.app.close();
  }
}
