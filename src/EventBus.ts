export type Disposable = () => void
export type EventListener = (...args: any[]) => boolean | void;

export enum Priority {
  HIGHEST = 100,
  HIGH = 10,
  NORMAL = 0,
  LOW = -10,
  LOWEST = -100,
}

type ListenerNode = {
  listener: EventListener,
  priority: number,
};

const ALL_KEY = '_____*_____';

export class EventBus {
  listenerMap: {
    [key: string]: Array<ListenerNode>,
    [ALL_KEY]: Array<ListenerNode>,
  } = {
    [ALL_KEY]: []
  };

  private destroyed = false;

  constructor() {
    this.on = this.on.bind(this);
    this.fire = this.fire.bind(this);
    this.getListeners = this.getListeners.bind(this);
  }

  on(name: string, listener: EventListener, priority = Priority.NORMAL): Disposable {
    let listeners = this.getListeners(name);
    listeners.push({
      priority,
      listener,
    });
    listeners.sort((a, b) => b.priority - a.priority);

    return () => {
      this.listenerMap[name] = this.getListeners(name).filter(l => l.listener != listener);
    };
  }

  all(listener: EventListener, priority = Priority.NORMAL): Disposable {
    return this.on(ALL_KEY, listener, priority);
  }

  fire(name: string, ...args: any[]): boolean {
    if (this.destroyed) {
      throw new Error('this eventBus already destroyed');
    }
    let listeners = this.getListeners(name);
    for (const listener of listeners) {
      if (listener.listener(...args)) {
        return true;
      }
    }
    listeners = this.getListeners(ALL_KEY);
    for (const listener of listeners) {
      if (listener.listener(name, ...args)) {
        return true;
      }
    }
    return false;
  }

  getListeners(eventName: string): ListenerNode[] {
    if (this.destroyed) {
      throw new Error('this eventBus already destroyed');
    }
    let listeners: ListenerNode[] | undefined = this.listenerMap[eventName];
    if (listeners == null) {
      listeners = [];
      this.listenerMap[eventName] = listeners;
    }
    return listeners;
  }

  destroy() {
    this.destroyed = true;
    this.listenerMap = {
      [ALL_KEY]: [],
    };
  }
}
