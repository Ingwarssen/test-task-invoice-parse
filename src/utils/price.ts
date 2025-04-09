import { BASE_CURRENCY } from "../constants/constants";
import { Status } from "../schemas/item.schema";

export const calculateInvoicePrice = (
  item: Record<string, any>,
  currencyRates: Record<string, number>
): number => {
  const extendedCurrencyRates: Record<string, number> = {
    ...currencyRates,
    [BASE_CURRENCY]: 1,
  };
  const itemCurrency = item["Item Price Currency"] as string;
  const invoiceCurrency = item["Invoice Currency"] as string;
  const totalPrice = item["Invoice Total Price"] as number;

  if (itemCurrency === invoiceCurrency) {
    return Number(totalPrice.toFixed(2));
  }

  const itemCurrencyRate = extendedCurrencyRates[itemCurrency];
  const invoiceCurrencyRate = extendedCurrencyRates[invoiceCurrency];

  if (!itemCurrencyRate || !invoiceCurrencyRate) {
    return NaN;
  }

  return Number(
    (totalPrice * (itemCurrencyRate / invoiceCurrencyRate)).toFixed(2)
  );
};
