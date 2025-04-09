import { z } from "zod";
import { BASE_CURRENCY } from "../constants/constants";

export enum Status {
  READY = "Ready",
  DONE = "Done",
}

export const createItemSchema = (currencyRates: Record<string, number>) => {
  const rateKeys = Object.keys(currencyRates) as string[];
  rateKeys.push(BASE_CURRENCY);

  return z
    .object({
      Customer: z.string().min(1),
      "Cust No'": z
        .number()
        .transform((v) => v.toString())
        .refine((v) => v.length === 5, {
          message: "Cust No' must be 5 characters long",
        }),
      "Project Type": z.string(),
      Quantity: z.number().int().min(1),
      "Price Per Item": z.number().min(0),
      "Item Price Currency": z.enum(rateKeys as [string, ...string[]]),
      "Invoice Total Price": z.number(),
      "Invoice Currency": z.enum(rateKeys as [string, ...string[]]),
      Status: z.enum([Status.READY, Status.DONE]),
    })
    .superRefine((data, ctx) => {
      const calculatedTotal = data.Quantity * data["Price Per Item"];
      if (data["Invoice Total Price"] !== calculatedTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `'Invoice Total Price' should equal Quantity × Price Per Item (${data.Quantity} × ${data["Price Per Item"]} = ${calculatedTotal})`,
          path: ["Invoice Total Price"],
        });
      }
    });
};

export const validateItem = (
  item: Record<string, any>,
  currencyRates: Record<string, number>
) => {
  const ItemSchema = createItemSchema(currencyRates);
  const result = ItemSchema.safeParse(item);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(
      (err) => `${err.path.join(".")} ${err.message}`
    );
    return { success: false, errors };
  }
};
