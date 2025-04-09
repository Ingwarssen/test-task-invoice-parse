import { Status, validateItem } from "../../schemas/item.schema";
import { calculateInvoicePrice } from "../../utils/price";

export const processData = (
  dataArray: Record<string, any>[],
  currencyRates: Record<string, number>
) => {
  return dataArray.map((item) => {
    const validation = validateItem(item, currencyRates);
    const withInvoicePrice = {} as Record<string, number>;

    if (item.Status === Status.READY || item["Invoice #"]) {
      const invoicePrice = calculateInvoicePrice(item, currencyRates);
      withInvoicePrice["Invoice Price"] = invoicePrice;
    }

    if (validation.success) {
      return { ...item, ...withInvoicePrice };
    } else {
      return {
        ...item,
        validationErrors: validation.errors?.join("; "),
      };
    }
  });
};
