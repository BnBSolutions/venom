/** Contextul comun pentru ecranele magazinului. */
import type { Cart } from "../cart.js";
import type { Product } from "../types.js";
import type { Sheet } from "./sheet.js";

export interface Shop {
  readonly products: readonly Product[];
  readonly cart: Cart;
  readonly sheet: Sheet;
}
