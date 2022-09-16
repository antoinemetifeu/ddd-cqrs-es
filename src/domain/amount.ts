export class Amount {
  #value: number;

  constructor(value: number) {
    if (value < 100) {
      // TODO: custom exception
      throw new Error('Not stonks :nrv:');
    }

    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
