// Product & slider data (max 5 in slider)
const PRODUCTS = [
  { id: 'vlnk01', name: 'Velvet Necklace', price: 189000, img: 'assets/svg/prod-necklace.svg', tag:'perhiasan' },
  { id: 'vlcr01', name: 'Crème Tote', price: 159000, img: 'assets/svg/prod-tote.svg', tag:'tas' },
  { id: 'vlcn01', name: 'Mauve Candle', price: 99000, img: 'assets/svg/prod-candle.svg', tag:'aroma' },
  { id: 'vlht01', name: 'Luna Headband', price: 79000, img: 'assets/svg/prod-headband.svg', tag:'aksesoris' },
  { id: 'vlpt01', name: 'Blume Poster A3', price: 59000, img: 'assets/svg/prod-poster.svg', tag:'dekor' },
  { id: 'vlsk01', name: 'Sage Socks', price: 39000, img: 'assets/svg/prod-socks.svg', tag:'fashion' }
];

export const TOP_PICKS = PRODUCTS.slice(0,5);
export default PRODUCTS;
