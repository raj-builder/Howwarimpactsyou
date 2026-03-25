import type { Category } from '@/types'

export const CATEGORIES: Category[] = [
  { id: 'bread', label: 'Bread & Cereals', icon: '🍞' },
  { id: 'dairy', label: 'Milk & Dairy', icon: '🥛' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'rice', label: 'Rice', icon: '🍚' },
  { id: 'oil', label: 'Cooking Oil', icon: '🫒' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'meat', label: 'Meat & Chicken', icon: '🍗' },
  { id: 'detergent', label: 'Detergent', icon: '🧴' },
  { id: 'fuel', label: 'Household Fuel', icon: '⛽' },
  { id: 'basket', label: 'Household Basics Basket', icon: '🛒' },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, Category>
