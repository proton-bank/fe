export function formatCurrency(amount: number, currency = 'VND'): string {
  if (Number.isNaN(amount)) return `0 ${currency}`
  const formatted = new Intl.NumberFormat('vi-VN').format(amount)
  return `${formatted} ${currency}`
}

