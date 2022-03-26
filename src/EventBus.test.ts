import {EventBus, Priority} from "./EventBus";

test('on', () => {
  const emitter = new EventBus();
  let count = 0;
  let dispose = emitter.on('test', () => {
    count++;
  });
  emitter.fire('test');
  expect(count).toEqual(1);
  emitter.fire('test');
  expect(count).toEqual(2);
  dispose();
  emitter.fire('test');
  expect(count).toEqual(2);
});

test('all', () => {
  const emitter = new EventBus();
  let count = 0;
  let dispose = emitter.all((key, arg) => {
    count++;
    expect(key).toBe('test')
    expect(arg).toBe('testArg')
  });
  emitter.fire('test', 'testArg');
  expect(count).toEqual(1);
});

test('on arg', () => {
  const emitter = new EventBus();
  let count = 0;
  let dispose = emitter.on('test', (arg: string) => {
    count++;
    expect(arg).toEqual('arg');
  });
  emitter.fire('test', 'arg');
  expect(count).toEqual(1);
  emitter.fire('test', 'arg');
  expect(count).toEqual(2);
  dispose();
  emitter.fire('test', 'arg');
  expect(count).toEqual(2);
});

test('stopNext', () => {
  const emitter = new EventBus();
  let count = 0;
  emitter.on('test', () => {
    count++
    return true;
  }, Priority.HIGHEST);

  emitter.on('test', () => {
    count++;
  });

  emitter.fire('test');
  expect(count).toBe(1)
})

test('priority', () => {
  const emitter = new EventBus();
  let count = 0;
  emitter.on('test', () => {
    expect(count++).toBe(0);
  }, Priority.HIGHEST);

  emitter.on('test', () => {
    expect(count++).toBe(2);
  }, Priority.LOWEST);

  emitter.on('test', () => {
    expect(count++).toBe(1);
  });

  emitter.fire('test');
});
