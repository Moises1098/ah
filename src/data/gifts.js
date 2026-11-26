const PRODUCT_BASE = 'https://cordsclub.com/products/'

const PAIR_ONLY = {
  formats: ['pair'],
  defaultFormat: 'pair',
}


const REGULAR_HOOPS = {
    formats: ['hoops'],
    defaultFormat: 'hoops',
    customs: ['regular'],
    defaultCustom: 'regular',
}

const SIZED_HOOPS = {
    ...REGULAR_HOOPS,
    customs: ['regular', 'small'],
}

const ORIENTED_STUDS = {
    formats: ['single', 'pair'],
    defaultFormat: 'single',
    customs: ['left', 'right'],
    defaultCustom: 'left',
}



function createGift(id, name, item, category, urlink, options = {}) {
  return {
    id,
    name,
    item,
    category,
    productUrl: urlink
      ? `${PRODUCT_BASE}${urlink}`
      : null,
    colors: ['gold', 'silver'],
    formats: ['single', 'pair'],
    customs: [],
    defaultColor: 'gold',
    defaultFormat: 'single',
    defaultCustom: null,
    imageExtension: 'webp',
    ...options,
  }
}

export const gifts = [


  createGift(
    1, 'Christmas Tree', 'christmas-tree', 'Enamel Flat Back',
    'christmas-tree-enamel-flat-back-stud'
  ),

  createGift(
    2, 'Pink Christmas Tree', 'pink-christmas-tree', 'Enamel Flat Back',
    'pink-christmas-tree-enamel-flat-back-stud'
  ),

  createGift(
    3, 'Gem Christmas Tree', 'gem-christmas-tree', 'Crystal Flat Back',
    'balsam-flat-back-stud-emerald'
  ),

createGift(
  4, 'Gift Bow', 'gift-bow', 'Flat Back Stud',
  'gift-bow-flat-back-stud'
),

  createGift(
    5, 'Tannenbaum', 'tannenbaum', 'Dangle Flat Back',
    'tannenbaum-enamel-flat-back-stud'
  ),
  


  // GIFTS AND DECORATIONS




    createGift(
    6, 'Tree Topper', 'tree-topper', 'Dangle Flat Back',
    'tree-topper-flat-back-stud'
  ),
    createGift(
    7, 'Gift Drop', 'gift-drop', 'Dangle Flat Back',
    'gift-drop-enamel-flat-back-stud'
  ),

 
createGift(
    8, 'Gift Box', 'gift-box', 'Enamel Flat Back',
    'present-flat-back-stud-powder-blue'
  ),

  // HOLIDAY HOOPS

  createGift(
    9, 'Holiday Lights', 'holiday-lights', 'Enamel Hoops',
    'holiday-lights-enamel-hoops', REGULAR_HOOPS
  ),

  createGift(
    10, 'Candy Cane Lane', 'candy-cane', 'Enamel Hoops',
    'candy-cane-enamel-titanium-hoops', SIZED_HOOPS
  ),


  // STRING OF LIGHTS

createGift(
  11, 'String of Lights Duo - Holiday', 'string-of-lights', 'Chain Flat Back',
  'string-of-lights-duo-flat-back-stud-red-green', {
    ...PAIR_ONLY,
    customs: ['holiday-lights'],
    defaultCustom: 'holiday-lights',
  }
),

createGift(
  12, 'String of Lights Duo - White', 'string-of-lights', 'Chain Flat Back',
  'string-of-lights-duo-flat-back-stud-white', {
    ...PAIR_ONLY,
    customs: ['white'],
    defaultCustom: 'white',
  }
),


  // STARS

  createGift(
    13, 'Emerald Star', 'emerald-star', 'Flat Back Stud',
    'star-bright-flat-back-stud-emerald'
  ),

  createGift(
    14, 'Garnet Star', 'garnet-star', 'Flat Back Stud',
    'star-bright-flat-back-stud-garnet'
  ),


  // SNOWFLAKES

  createGift(
    15, 'Snowflake Sugar Cookie', 'snowflake-sugar-cookie', 'Enamel Flat Back',
    'snowflake-sugar-cookie-enamel-flat-back-stud'
  ),

  createGift(
    16, 'Snowflake', 'snowflake', 'Crystal Flat Back',
    'snowflake-flat-back-stud'
  ),



  createGift(
    17, 'Candy Cane', 'candy-cane', 'Enamel Flat Back',
    'candy-cane-enamel-flat-back', ORIENTED_STUDS
  ),

  createGift(
    18, 'Hot Cocoa', 'hot-cocoa', 'Enamel Flat Back',
    'hot-cocoa-flat-back-stud', ORIENTED_STUDS
  ),



  createGift(
    19, 'Poinsettia', 'poinsettia', 'Flat Back Stud',
    'poinsettia-flat-back-stud'
  ),

  createGift(
    20, 'Festive Colors', 'festive-colors', 'Flat Back Stud',
    'festive-flourish-flat-back-stud'
  ),

  createGift(
    21, 'Gingerbread', 'gingerbread', 'Flat Back Stud',
    'gingerbread-flat-back-stud'
  ),


]
