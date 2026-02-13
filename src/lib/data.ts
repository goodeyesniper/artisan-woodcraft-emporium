import chessboardImg from '@/assets/product-chessboard.jpg';
import nameplateImg from '@/assets/product-nameplate.jpg';
import jewelryBoxImg from '@/assets/product-jewelry-box.jpg';
import type { Product } from './types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wooden Handcrafted Chessboard',
    price: 120,
    image: chessboardImg,
    category: 'Games',
    description: 'A stunning handcrafted chessboard made from solid mahogany and acacia wood. Each piece is hand-carved with meticulous attention to detail, finished with a scratch-resistant matte varnish.',
    specs: {
      'Material': 'Solid Mahogany + Acacia',
      'Board Dimensions': '18in × 18in',
      'Square Size': '2in',
      'Pieces': 'Full 32-piece set, hand-carved',
      'Finish': 'Matte varnish, scratch-resistant',
    },
    featured: true,
  },
  {
    id: '2',
    name: 'Custom Wooden Nameplate',
    price: 35,
    image: nameplateImg,
    category: 'Personalized',
    description: 'Beautifully crafted wooden nameplate with custom engraving. Choose between pine or narra wood, with gloss or matte finish options to match your style.',
    specs: {
      'Material': 'Pine or Narra (customer choice)',
      'Dimensions': '12in × 4in',
      'Engraving': 'Custom engraving included',
      'Finish': 'Gloss or Matte',
    },
    featured: true,
  },
  {
    id: '3',
    name: 'Hand-Carved Wooden Jewelry Box',
    price: 65,
    image: jewelryBoxImg,
    category: 'Storage',
    description: 'An elegant hand-carved jewelry box made from premium walnut wood. Features a luxurious velvet interior lining and solid brass hinges for lasting beauty.',
    specs: {
      'Material': 'Walnut',
      'Dimensions': '10in × 6in × 4in',
      'Interior': 'Velvet lining',
      'Hardware': 'Brass hinges',
    },
    featured: true,
  },
];
