export abstract class BaseProjection<T> {
  protected _readModel: T;

  when(event) {
    if (typeof this[`when${event.constructor.name}`] === 'function')
      this[`when${event.constructor.name}`](event);
  }

  get readModel() {
    return this._readModel;
  }
}
