import EventEmitter from 'events';

export class DIContainer {
  private dependencies: Record<string, unknown> = {};
  private timeoutMs: number;
  private events = new EventEmitter({ captureRejections: true });

  constructor({ timeoutMs = 1000 }: { timeoutMs?: number } = {}) {
    this.timeoutMs = timeoutMs;
  }

  add<T>(name: string, dependency: T | Promise<T>) {
    if (dependency instanceof Promise) {
      dependency.then(dependency => this.#register(name, dependency));
    } else {
      this.#register(name, dependency);
    }
  }

  get<T>(name: string, timeoutMs = this.timeoutMs) {
    return new Promise<T>((resolve, reject) => {
      if (this.dependencies[name]) {
        return resolve(<T>this.dependencies[name]);
      }
      const removeListener = () => this.events.removeListener('name', listener);
      const timeout = setTimeout(() => {
        reject(new Error('awaiting for dependency ' + name + ' timed out'));
        removeListener();
      }, timeoutMs);
      function listener(dependency: T) {
        resolve(dependency);
        clearTimeout(timeout);
        removeListener();
      }
      this.events.once(name, listener);
    });
  }

  #register(name: string, dependency: unknown) {
    this.dependencies[name] = dependency;
    this.events.emit(name, dependency);
  }
}
