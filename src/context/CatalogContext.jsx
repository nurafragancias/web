import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured, PRODUCT_IMAGES_BUCKET } from '../lib/supabase';
import { visibleVariants } from '../lib/stock';

const CatalogContext = createContext();

const initialProducts = [
  {
    "id": "1",
    "name": " 9 AM DIVE EDP 100ML",
    "brand": "AFNAN",
    "description": "9am Dive de Afnan es una fragancia de la familia olfativa Aromática Acuática para Hombres y Mujeres. 9am Dive se lanzó en 2022. La Nariz detrás de esta fragrancia es Imran Fazlani. Las Notas de Salida son limón (lima ácida), menta, grosellas negras y pimienta rosa; las Notas de Corazón son manzana, cedro y incienso; las Notas de Fondo son jengibre, sándalo, pachulí y jazmín.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 8200
      },
      {
        "size": "100ml",
        "price": 81800
      }
    ],
    "images": [
          "/images/products/9%20AM%20DIVE(1).jpg",
          "/images/products/9%20AM%20DIVE(2).jpg",
          "/images/products/9%20AM%20DIVE.jpg"
    ]
  },
  {
    "id": "2",
    "name": " 9 PM MASC EDP 100ML",
    "brand": "AFNAN",
    "description": "9pm de Afnan es una fragancia de la familia olfativa Oriental Vainilla para Hombres. 9pm se lanzó en 2020. Las Notas de Salida son manzana, canela, lavanda silvestre y bergamota; las Notas de Corazón son flor de azahar del naranjo y lirio de los valles (muguete); las Notas de Fondo son vainilla, haba tonka, ámbar y pachulí.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7400
      },
      {
        "size": "100ml",
        "price": 73700
      }
    ],
    "images": [
          "/images/products/AFNAN%209%20PM%203.jpg",
          "/images/products/AFNAN%209%20PM%205.jpg",
          "/images/products/AFNAN%209%20PM.jpg"
    ]
  },
  {
    "id": "3",
    "name": " 9 PM REBEL EDP 100ML",
    "brand": "AFNAN",
    "description": "9 PM Rebel de Afnan es una fragancia de la familia olfativa Aromática Frutal para Hombres y Mujeres. Esta fragrancia es nueva. 9 PM Rebel se lanzó en 2024. La Nariz detrás de esta fragrancia es Gaël Montero. Las Notas de Salida son piña, manzana Granny Smith y mandarina; las Notas de Corazón son musgo de roble, cedro y vainilla; las Notas de Fondo son Madera seca, ámbar gris, caramelo y almizcle.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 9700
      },
      {
        "size": "100ml",
        "price": 96800
      }
    ],
    "images": [
          "/images/products/9%20PM%20REBEL(1).jpg",
          "/images/products/9%20PM%20REBEL(2).jpg",
          "/images/products/9%20PM%20REBEL(3).JPG"
    ]
  },
  {
    "id": "4",
    "name": "AMBER OUD DUBAI NIGHT EDP 100ML",
    "brand": "AL HARAMAIN",
    "description": "Amber Oud Dubai Night de Al Haramain es una fragancia de la familia olfativa Oriental Amaderada para Hombres. Esta fragrancia es nueva. Amber Oud Dubai Night se lanzó en 2024. Las Notas de Salida son azafrán, bergamota y elemí; las Notas de Corazón son madera de oud, rosa de Bulgaria (rosa Damascena de Bulgaria) y lirio de los valles (muguete); las Notas de Fondo son haba tonka, ámbar, almizcle blanco y musgo de roble.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 11700
      },
      {
        "size": "100ml",
        "price": 116600
      }
    ],
    "images": []
  },
  {
    "id": "5",
    "name": "AMBER OUD GOLD EDITION EDP 120ML",
    "brand": "AL HARAMAIN",
    "description": "Amber Oud Gold Edition de Al Haramain Perfumes es una fragancia de la familia olfativa Oriental Vainilla para Hombres y Mujeres. Amber Oud Gold Edition se lanzó en 2024. Las Notas de Salida son bergamota y notas verdes; las Notas de Corazón son melón, piña, ámbar y Acorde goloso; las Notas de Fondo son vainilla, almizcle y notas amaderadas.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 10600
      },
      {
        "size": "100ml",
        "price": 126800
      }
    ],
    "images": [
          "/images/products/AL%20HARAMAIN%20AMBER%20OUD%20GOLD%20EDITION(1).JPG",
          "/images/products/AL%20HARAMAIN%20AMBER%20OUD%20GOLD%20EDITION(2).JPG",
          "/images/products/AL%20HARAMAIN%20AMBER%20OUD%20GOLD%20EDITION(3).jpg"
    ]
  },
  {
    "id": "6",
    "name": "SABAH AL WARD 100ML",
    "brand": "AL WATANIAH",
    "description": "Sabah Al Ward de Al Wataniah es una fragancia de la familia olfativa Oriental Floral para Mujeres. Las Notas de Salida son pimienta rosa y mandarina; las Notas de Corazón son vaina de cacao, flor de azahar del naranjo y jazmín sambac (sampaguita); las Notas de Fondo son vainilla, haba tonka y pachulí.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 4600
      },
      {
        "size": "100ml",
        "price": 46300
      }
    ],
    "images": [
          "/images/products/AL%20WATANIAH%20DAR%20AL%20WARD(1).jpg",
          "/images/products/AL%20WATANIAH%20DAR%20AL%20WARD(2).jpg",
          "/images/products/AL%20WATANIAH%20DAR%20AL%20WARD.jpg"
    ]
  },
  {
    "id": "7",
    "name": "CLUB DE NUIT ICONIC EDP 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Blue Iconic de Armaf es una fragancia de la familia olfativa para Hombres. Club de Nuit Blue Iconic se lanzó en 2022. Las Notas de Salida son toronja (pomelo), limón (lima ácida), menta, pimienta rosa y cilantro; las Notas de Corazón son jengibre, melón, jazmín y nuez moscada; las Notas de Fondo son notas amaderadas, incienso, sándalo, ámbar, cedro, pachulí y ládano.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 10800
      },
      {
        "size": "100ml",
        "price": 113300
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20ICONIC(1).jpg",
          "/images/products/CLUB%20DE%20NUIT%20ICONIC(2).jpg",
          "/images/products/CLUB%20DE%20NUIT%20ICONIC(3).jpg"
    ]
  },
  {
    "id": "8",
    "name": "CLUB DE NUIT INTENSE MAN EDT 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Intense Man de Armaf es una fragancia de la familia olfativa Amaderada Especiada para Hombres. Club de Nuit Intense Man se lanzó en 2015. Las Notas de Salida son limón (lima ácida), piña, bergamota, grosellas negras y manzana; las Notas de Corazón son abedul, jazmín y rosa; las Notas de Fondo son almizcle, ámbar gris, pachulí y vainilla.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 9100
      },
      {
        "size": "100ml",
        "price": 96000
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20INTENSE%20MAN(1).jpg",
          "/images/products/CLUB%20DE%20NUIT%20INTENSE%20MAN.jpg"
    ]
  },
  {
    "id": "9",
    "name": "CLUB DE NUIT MILESTONE EDP 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Milestone de Armaf es una fragancia de la familia olfativa Almizcle Amaderado Floral para Hombres y Mujeres. Club de Nuit Milestone se lanzó en 2019. Las Notas de Salida son notas marinas, Frutas rojas y bergamota; las Notas de Corazón son violeta, maderas blancas y sándalo; las Notas de Fondo son almizcle, ambroxan y vetiver.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 8300
      },
      {
        "size": "100ml",
        "price": 87500
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20MILESTONE..jpg",
          "/images/products/CLUB%20DE%20NUIT%20MILESTONE.jpg"
    ]
  },
  {
    "id": "10",
    "name": "CLUB DE NUIT SILLAGE EDP 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Sillage de Armaf es una fragancia de la familia olfativa Almizcle Floral Amaderado para Hombres y Mujeres. Club de Nuit Sillage se lanzó en 2020. Las Notas de Salida son bergamota, limón (lima ácida), lima (limón verde), grosellas negras, hojas de violeta y jengibre; las Notas de Corazón son rosa, iris y jazmín; las Notas de Fondo son ambroxan, almizcle, sándalo y cedro.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 8800
      },
      {
        "size": "100ml",
        "price": 92600
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20SILAGE(1).jpg",
          "/images/products/CLUB%20DE%20NUIT%20SILAGE(2).jpg",
          "/images/products/CLUB%20DE%20NUIT%20SILAGE..JPG"
    ]
  },
  {
    "id": "11",
    "name": "CLUB DE NUIT UNTOLD EDP 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Untold de Armaf es una fragancia de la familia olfativa para Hombres y Mujeres. Club de Nuit Untold se lanzó en 2022. Las Notas de Salida son azafrán y jazmín; las Notas de Corazón son Amberwood y ámbar gris; las Notas de Fondo son resina de abeto y cedro.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 10100
      },
      {
        "size": "100ml",
        "price": 106300
      }
    ],
    "images": []
  },
  {
    "id": "12",
    "name": "CLUB DE NUIT URBAN MAN ELIXIR EDP 105ML",
    "brand": "ARMAF",
    "description": "Club De Nuit Urban Elixir de Armaf es una fragancia de la familia olfativa para Hombres. Club De Nuit Urban Elixir se lanzó en 2022. Las Notas de Salida son bergamota, pimienta rosa, flor de azahar del naranjo y jazmín; las Notas de Corazón son lavanda, elemí, geranio, vetiver, azafrán y cempasúchil (tagete, clavelón); las Notas de Fondo son ambroxan, ámbar, cedro, pachulí y ládano.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 8500
      },
      {
        "size": "100ml",
        "price": 89200
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20URBAN%20MAN%20ELIXIR(1).jpg",
          "/images/products/CLUB%20DE%20NUIT%20URBAN%20MAN%20ELIXIR(2).jpg",
          "/images/products/CLUB%20DE%20NUIT%20URBAN%20MAN%20ELIXIR.jpg"
    ]
  },
  {
    "id": "13",
    "name": "CLUB DE NUIT WOMAN EDP 105ML",
    "brand": "ARMAF",
    "description": "Club de Nuit Woman de Armaf es una fragancia de la familia olfativa Floral Frutal para Mujeres. Las Notas de Salida son naranja, bergamota, toronja (pomelo) y durazno (melocotón); las Notas de Corazón son rosa, jazmín, lichi y geranio; las Notas de Fondo son pachulí, almizcle, vainilla y vetiver.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 7500
      },
      {
        "size": "100ml",
        "price": 78800
      }
    ],
    "images": [
          "/images/products/CLUB%20DE%20NUIT%20WOMAN(1).jpg",
          "/images/products/CLUB%20DE%20NUIT%20WOMAN(2).jpg",
          "/images/products/CLUB%20DE%20NUIT%20WOMAN.jpg"
    ]
  },
  {
    "id": "14",
    "name": "ODYSSEY CANDEE EDP 100ML",
    "brand": "ARMAF",
    "description": "Odyssey Candee de Armaf es una fragancia de la familia olfativa para Mujeres. Esta fragrancia es nueva. Odyssey Candee se lanzó en 2024. Las Notas de Salida son fresa, frambuesa, geranio, durazno (melocotón) y bergamota; las Notas de Corazón son caramelo, jazmín y maracuyá (fruta de la pasión); las Notas de Fondo son pachulí, almizcle y ámbar.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6500
      },
      {
        "size": "100ml",
        "price": 65200
      }
    ],
    "images": [
          "/images/products/ODYSSEY%20CANDEE(1).JPG",
          "/images/products/ODYSSEY%20CANDEE(2).jpg",
          "/images/products/ODYSSEY%20CANDEE.jpg"
    ]
  },
  {
    "id": "15",
    "name": "ODYSSEY HOMME WHITE EDP 100ML ",
    "brand": "ARMAF",
    "description": "Odyssey Homme White Edition de Armaf es una fragancia de la familia olfativa Oriental Fougère para Hombres. Las Notas de Salida son pimienta rosa, cardamomo y menta; las Notas de Corazón son salvia, Notas acuáticas y piña; las Notas de Fondo son Amberwood, vainilla y cedro.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7200
      },
      {
        "size": "100ml",
        "price": 72000
      }
    ],
    "images": []
  },
  {
    "id": "16",
    "name": "ODYSSEY LIMONI EDP 100ML",
    "brand": "ARMAF",
    "description": "Odyssey Limoni Fresh de Armaf es una fragancia de la familia olfativa para Hombres y Mujeres. Esta fragrancia es nueva. Odyssey Limoni Fresh se lanzó en 2024. Las Notas de Salida son limón (lima ácida), naranja dulce, mandarina y bergamota; las Notas de Corazón son flor de azahar del naranjo, Notas marinas y jengibre; las Notas de Fondo son té, almizcle y ámbar.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6900
      },
      {
        "size": "100ml",
        "price": 68600
      }
    ],
    "images": [
          "/images/products/ARMAF%20ODYSSEY%20LIMONI.jpg",
          "/images/products/LATTAFA%20ODYSSEY%20LIMONI.jpg",
          "/images/products/ODYSSEY%20LIMONI(1).jpg"
    ]
  },
  {
    "id": "17",
    "name": "ODYSSEY MANDARIN SKY EDP 100ML",
    "brand": "ARMAF",
    "description": "Odyssey Mandarin Sky de Armaf es una fragancia de la familia olfativa para Hombres. Odyssey Mandarin Sky se lanzó en 2023. Las Notas de Salida son mandarina, naranja, azafrán y salvia; las Notas de Corazón son caramelo, haba tonka y cempasúchil (tagete, clavelón); las Notas de Fondo son ambroxan, cedro y vetiver.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7700
      },
      {
        "size": "100ml",
        "price": 77200
      }
    ],
    "images": [
          "/images/products/ARMAF%20ODYSSEY%20MANDARIN%20SKY.jpg",
          "/images/products/ODYSSEY%20MANDARIN%20SKY.JPG"
    ]
  },
  {
    "id": "18",
    "name": "VENTANA MARINE EDP 100ML",
    "brand": "ARMAF",
    "description": "Ventana Marine de Armaf es una fragancia de la familia olfativa Amaderada Acuática para Hombres y Mujeres. Las Notas de Salida son naranja siciliana, cidra, bergamota de Calabria, petit grain y cardamomo; las Notas de Corazón son jengibre, neroli de Túnez, romero, jazmín, canela y lirio de los valles (muguete); las Notas de Fondo son té chino, sándalo, palisandro y madera de gaiac.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 8600
      },
      {
        "size": "100ml",
        "price": 85700
      }
    ],
    "images": [
          "/images/products/Ventana%20marine(1).jpg",
          "/images/products/Ventana%20marine(2).jpg",
          "/images/products/Ventana%20marine(3).jpg"
    ]
  },
  {
    "id": "19",
    "name": "STRONGER WITH YOU INTENSELY EDP 100ML",
    "brand": "ARMANI",
    "description": "Emporio Armani Stronger With You Intensely de Giorgio Armani es una fragancia de la familia olfativa Oriental Fougère para Hombres. Emporio Armani Stronger With You Intensely se lanzó en 2019. Las Notas de Salida son pimienta rosa, enebro y violeta; las Notas de Corazón son tófe, canela, lavanda y salvia; las Notas de Fondo son vainilla, ámbar, haba tonka y gamuza.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 26200
      },
      {
        "size": "100ml",
        "price": 291500
      }
    ],
    "images": []
  },
  {
    "id": "20",
    "name": "ANDALEEB EDP 100ML",
    "brand": "ASDAAF",
    "description": "Al Andaleeb de Asdaaf es una fragancia de la familia olfativa Chipre Floral para Hombres y Mujeres. Las Notas de Salida son naranja, bergamota y mandarina; las Notas de Corazón son jazmín y rosa; las Notas de Fondo son pachulí, sándalo y vetiver.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 5100
      },
      {
        "size": "100ml",
        "price": 50600
      }
    ],
    "images": [
          "/images/products/ASDAAF%20ANDALEEB(1).jpg",
          "/images/products/ASDAAF%20ANDALEEB(2).jpg",
          "/images/products/ASDAAF%20ANDALEEB.jpg"
    ]
  },
  {
    "id": "21",
    "name": "LIQUID BRUN 100ML",
    "brand": "FRENCH AVENUE",
    "description": "Liquid Brun de French Avenue es una fragancia de la familia olfativa Amaderada para Hombres. Liquid Brun se lanzó en 2024. Las Notas de Salida son canela, flor de azahar del naranjo, cardamomo y bergamota; las Notas de Corazón son vainilla Bourbon y elemí; las Notas de Fondo son praliné, ambroxan, almizcle y madera de gaiac.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 12400
      },
      {
        "size": "100ml",
        "price": 124300
      }
    ],
    "images": []
  },
  {
    "id": "22",
    "name": "KING EDP 100ML",
    "brand": "BHARARA",
    "description": "King de Bharara es una fragancia de la familia olfativa Aromática para Hombres. King se lanzó en 2021. Las Notas de Salida son naranja, bergamota y limón (lima ácida); la Nota de Corazón es notas afrutadas; las Notas de Fondo son vainilla, almizcle blanco y ámbar.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 13700
      },
      {
        "size": "100ml",
        "price": 137200
      }
    ],
    "images": []
  },
  {
    "id": "23",
    "name": "VIKING BEIRUT EDP 100ML",
    "brand": "BHARARA",
    "description": "Viking Beirut de Bharara es una fragancia de la familia olfativa Aromática para Hombres y Mujeres. Esta fragrancia es nueva. Viking Beirut se lanzó en 2024. Las Notas de Salida son bergamota, limón (lima ácida) y gálbano; las Notas de Corazón son notas ozónicas, salvia y geranio; las Notas de Fondo son pachulí, vetiver, musgo de roble y haba tonka.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 13700
      },
      {
        "size": "100ml",
        "price": 137200
      }
    ],
    "images": [
          "/images/products/BHARARA%20VIKING(1).JPG",
          "/images/products/BHARARA%20VIKING(2).jpg",
          "/images/products/BHARARA%20VIKING(3).jpg"
    ]
  },
  {
    "id": "24",
    "name": "FATTAH 100ML",
    "brand": "DAR EL WARD",
    "description": "",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 8200
      },
      {
        "size": "100ml",
        "price": 82300
      }
    ],
    "images": []
  },
  {
    "id": "25",
    "name": "HAWAS FOR HIM EDP 100ML",
    "brand": "RASASI",
    "description": "Hawas for Him de Rasasi es una fragancia de la familia olfativa Aromática Acuática para Hombres. Hawas for Him se lanzó en 2015. Las Notas de Salida son manzana, bergamota, limón (lima ácida) y canela; las Notas de Corazón son notas acuosas, ciruela, flor de azahar del naranjo y cardamomo; las Notas de Fondo son ámbar gris, almizcle, pachulí y trozos de madera a la deriva.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7000
      },
      {
        "size": "100ml",
        "price": 70400
      }
    ],
    "images": [
          "/images/products/HAWAS%20FOR%20HIM(1).jpg",
          "/images/products/HAWAS%20FOR%20HIM(2).jpg",
          "/images/products/HAWAS%20FOR%20HIM.jpg"
    ]
  },
  {
    "id": "26",
    "name": "LE BEAU EDT 125ml",
    "brand": "JEAN PAUL GAULTIER",
    "description": "Le Beau de Jean Paul Gaultier es una fragancia de la familia olfativa Amaderada Aromática para Hombres. Le Beau se lanzó en 2019. Le Beau fue creada por Quentin Bisch y Sonia Constant. La Nota de Salida es bergamota; la Nota de Corazón es coco; la Nota de Fondo es haba tonka.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 15900
      }
    ],
    "images": []
  },
  {
    "id": "27",
    "name": "LE MALE ELIXIR PARFUM 125ML",
    "brand": "JEAN PAUL GAULTIER",
    "description": "Le Male Elixir de Jean Paul Gaultier es una fragancia de la familia olfativa Oriental Fougère para Hombres. Le Male Elixir se lanzó en 2023. La Nariz detrás de esta fragrancia es Quentin Bisch. Las Notas de Salida son lavanda y menta; las Notas de Corazón son vainilla y benjuí; las Notas de Fondo son miel, haba tonka y tabaco.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 20600
      }
    ],
    "images": [
          "/images/products/JPG%20LE%20MALE%20ELIXIR%202.jpg",
          "/images/products/JPG%20LE%20MALE%20ELIXIR.JPG"
    ]
  },
  {
    "id": "28",
    "name": "LE MALE LE PARFUM 125ML",
    "brand": "JEAN PAUL GAULTIER",
    "description": "Le Male Le Parfum de Jean Paul Gaultier es una fragancia de la familia olfativa Oriental para Hombres. Le Male Le Parfum se lanzó en 2020. Le Male Le Parfum fue creada por Quentin Bisch y Natalie Gracia-Cetto. La Nota de Salida es cardamomo; las Notas de Corazón son lavanda y iris; las Notas de Fondo son vainilla, notas orientales y notas amaderadas.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 16200
      }
    ],
    "images": [
          "/images/products/JPG%20LE%20MALE%20LE%20PARFUM%202.JPG",
          "/images/products/JPG%20LE%20MALE%20LE%20PARFUM.jpg"
    ]
  },
  {
    "id": "29",
    "name": "INVICTUS VICTORY ELIXIR PARFUM 100ML",
    "brand": "RABANNE",
    "description": "Invictus Victory Elixir de Rabanne es una fragancia de la familia olfativa Oriental Amaderada para Hombres. Invictus Victory Elixir se lanzó en 2023. Invictus Victory Elixir fue creada por Domitille Michalon Bertier, Anne Flipo y Nicolas Beaulieu. Las Notas de Salida son lavanda, cardamomo y pimienta negra; las Notas de Corazón son incienso y pachulí; las Notas de Fondo son vaina de vainilla y haba tonka.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 21300
      }
    ],
    "images": []
  },
  {
    "id": "30",
    "name": "AL NOBLE SAFEER EDP 100ML",
    "brand": "LATTAFA",
    "description": "Safeer de Lattafa Perfumes es una fragancia de la familia olfativa para Hombres y Mujeres. Las Notas de Salida son toronja (pomelo), bergamota, jengibre y pimienta negra; las Notas de Corazón son caramelo, jazmín y heliotropo; las Notas de Fondo son madera de gaiac, almizcle, cipriol (nagarmota), ámbar gris y cachemira.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 5800
      },
      {
        "size": "100ml",
        "price": 58300
      }
    ],
    "images": [
          "/images/products/AL%20NOBLE%20SAAFER(1).jpg",
          "/images/products/AL%20NOBLE%20SAAFER(2).jpg",
          "/images/products/AL%20NOBLE%20SAAFER(3).jpg"
    ]
  },
  {
    "id": "31",
    "name": "QAED AL FURSAN EDP 90ml",
    "brand": "LATTAFA",
    "description": "Qaed Al Fursan de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Amaderada para Hombres y Mujeres. Qaed Al Fursan se lanzó en 2016. Las Notas de Salida son piña y azafrán; las Notas de Corazón son abeto balsámico y jazmín; las Notas de Fondo son cedro, ámbar y madera de oud.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 5300
      },
      {
        "size": "100ml",
        "price": 53200
      }
    ],
    "images": []
  },
  {
    "id": "32",
    "name": "QAED AL FURSAN UNLIMITED EDP 90ml",
    "brand": "LATTAFA",
    "description": "Qaed Al Fursan Unlimited de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal Gourmand para Hombres y Mujeres. Qaed Al Fursan Unlimited se lanzó en 2022. Las Notas de Salida son coco, piña y cítricos; las Notas de Corazón son ylang-ylang, frangipani (plumeria, plumaria, atapaima) y jazmín; las Notas de Fondo son vainilla, almizcle, sándalo y notas dulces.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 4300
      },
      {
        "size": "100ml",
        "price": 42800
      }
    ],
    "images": []
  },
  {
    "id": "33",
    "name": "BADE’E AL OUD AMETHYST EDP 100ML",
    "brand": "LATTAFA",
    "description": "Bade’e Al Oud Amethyst de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Vainilla para Hombres y Mujeres. Bade’e Al Oud Amethyst se lanzó en 2021. Las Notas de Salida son pimienta rosa y bergamota; las Notas de Corazón son rosa turca, rosa de Bulgaria (rosa Damascena de Bulgaria) y jazmín; las Notas de Fondo son madera de oud, ámbar y vainilla.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6300
      },
      {
        "size": "100ml",
        "price": 62600
      }
    ],
    "images": [
      "/images/products/BADEE%20AMESTHYST(1).jpg",
      "/images/products/BADEE%20AMESTHYST(2).jpg",
      "/images/products/BADEE%20AMESTHYST.jpg"
    ]
  },
  {
    "id": "34",
    "name": "BADE’E AL OUD FOR GLORY EDP 100ML",
    "brand": "LATTAFA",
    "description": "Bade’e Al Oud Oud for Glory de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Amaderada para Hombres y Mujeres. Bade’e Al Oud Oud for Glory se lanzó en 2020. Las Notas de Salida son azafrán, nuez moscada y lavanda; las Notas de Corazón son madera de oud y pachulí; las Notas de Fondo son madera de oud, pachulí y almizcle.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
      "/images/products/BADEE%20FOR%20GLORY(1).jpg",
      "/images/products/BADEE%20FOR%20GLORY(2).JPG",
      "/images/products/BADEE%20FOR%20GLORY(3).JPG"
    ]
  },
  {
    "id": "35",
    "name": "BADE’E AL OUD HONOR & GLORY EDP 100ML",
    "brand": "LATTAFA",
    "description": "Bade’e Al Oud Honor & Glory de Lattafa Perfumes es una fragancia de la familia olfativa para Hombres y Mujeres. Bade’e Al Oud Honor & Glory se lanzó en 2023. Las Notas de Salida son piña y créme brulée; las Notas de Corazón son canela, cúrcuma (azafrán de la India), pimienta negra y benjuí; las Notas de Fondo son vainilla, sándalo, cachemira y musgo.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
      "/images/products/BADEE%20HONOR%20%26%20GLORY.JPG",
      "/images/products/BADEEE%20HONOR%20%26%20GLORY(1).jpg",
      "/images/products/BADEEE%20HONOR%20%26%20GLORY(2).jpg"
    ]
  },
  {
    "id": "36",
    "name": "BADE’E AL OUD NOBLE BLUSH EDP 100ML",
    "brand": "LATTAFA",
    "description": "Badee Al Oud Noble Blush de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal Gourmand para Mujeres. Badee Al Oud Noble Blush se lanzó en 2024. La Nota de Salida es Leche de rosas; las Notas de Corazón son merengue y almendra; las Notas de Fondo son vainilla, sándalo y almizcle.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 5800
      },
      {
        "size": "100ml",
        "price": 58300
      }
    ],
    "images": [
      "/images/products/BADEE%20NOBLE%20BLUSH(1).jpg",
      "/images/products/BADEE%20NOBLE%20BLUSH(2).JPG",
      "/images/products/BADEE%20NOBLE%20BLUSH(3).jpg"
    ]
  },
  {
    "id": "37",
    "name": "BADE’E AL OUD SUBLIME EDP 100ML",
    "brand": "LATTAFA",
    "description": "Bade’e Al Oud Sublime de Lattafa Perfumes es una fragancia de la familia olfativa Amaderada Aromática para Hombres y Mujeres. Bade’e Al Oud Sublime se lanzó en 2023. Las Notas de Salida son manzana, lichi y rosa; las Notas de Corazón son ciruela y jazmín; las Notas de Fondo son musgo, vainilla y pachulí.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
      "/images/products/BADEE%20SUBLIME(1).jpg",
      "/images/products/BADEE%20SUBLIME(2).JPG",
      "/images/products/BADEE%20SUBLIME(3).jpg"
    ]
  },
  {
    "id": "38",
    "name": "ECLAIRE EDP 100ML",
    "brand": "LATTAFA",
    "description": "Eclaire de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal Gourmand para Mujeres. Eclaire se lanzó en 2024. Las Notas de Salida son caramelo, leche y azúcar; las Notas de Corazón son miel y flores blancas; las Notas de Fondo son vainilla, praliné y almizcle.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 7000
      },
      {
        "size": "100ml",
        "price": 70300
      }
    ],
    "images": [
          "/images/products/ECLAIRE(1).jpg",
          "/images/products/ECLAIRE(2).jpg",
          "/images/products/ECLAIRE(3).jpg"
    ]
  },
  {
    "id": "39",
    "name": "EMEER EDP 100ML",
    "brand": "LATTAFA",
    "description": "Emeer de Lattafa Perfumes es una fragancia de la familia olfativa Amaderada Aromática para Hombres y Mujeres. Emeer se lanzó en 2024. Las Notas de Salida son limón (lima ácida), bergamota, esclarea y bayas de enebro; las Notas de Corazón son té Blanco, sándalo, cardamomo y incienso de olíbano (franquincienso); las Notas de Fondo son ámbar gris, cedro, cachemira y pachulí.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 9400
      },
      {
        "size": "100ml",
        "price": 94300
      }
    ],
    "images": [
          "/images/products/EMEER(1).jpg",
          "/images/products/EMEER(2).jpg",
          "/images/products/EMEER(3).jpg"
    ]
  },
  {
    "id": "40",
    "name": "FAKHAR BLACK EDP 100ML",
    "brand": "LATTAFA",
    "description": "Fakhar Black de Lattafa Perfumes es una fragancia de la familia olfativa Oriental para Hombres. Fakhar Black se lanzó en 2022. Las Notas de Salida son manzana, bergamota y jengibre; las Notas de Corazón son lavanda, salvia, bayas de enebro y geranio; las Notas de Fondo son haba tonka, cedro, Amberwood y vetiver.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7900
      },
      {
        "size": "100ml",
        "price": 78800
      }
    ],
    "images": [
          "/images/products/FAKHAR%20BLACK(1).jpg",
          "/images/products/FAKHAR%20BLACK(2).jpg",
          "/images/products/FAKHAR%20BLACK(3).JPG"
    ]
  },
  {
    "id": "41",
    "name": "FAKHAR EXTRAIT EDP 100ML",
    "brand": "LATTAFA",
    "description": "Fakhar Extrait de Lattafa Perfumes es una fragancia de la familia olfativa para Hombres. Fakhar Extrait se lanzó en 2023. Las Notas de Salida son toronja (pomelo), cardamomo y pimienta rosa; las Notas de Corazón son nardos, notas solares y abrótano; las Notas de Fondo son ámbar, cachemira, cuero y ládano.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 5800
      },
      {
        "size": "100ml",
        "price": 57500
      }
    ],
    "images": [
          "/images/products/FAKHAR%20EXTRAIT(1).jpg",
          "/images/products/FAKHAR%20EXTRAIT(2).jpg",
          "/images/products/FAKHAR%20EXTRAIT(3).jpg"
    ]
  },
  {
    "id": "42",
    "name": "FAKHAR WOMAN EDP 100ML",
    "brand": "LATTAFA",
    "description": "Fakhar Rose de Lattafa Perfumes es una fragancia de la familia olfativa Floral para Mujeres. Fakhar Rose se lanzó en 2022. Las Notas de Salida son frutas, azucena, granada y aldehídos; las Notas de Corazón son nardos, jazmín, gardenia, ylang-ylang, rosa, madreselva y peonía; las Notas de Fondo son vainilla, almizcle blanco, sándalo y ambroxan.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 8400
      },
      {
        "size": "100ml",
        "price": 84000
      }
    ],
    "images": [
          "/images/products/FAKHAR%20WOMAN(1).jpg",
          "/images/products/FAKHAR%20WOMAN(2).jpg",
          "/images/products/FAKHAR%20WOMAN(3).jpg"
    ]
  },
  {
    "id": "43",
    "name": "HAYA EDP 100ML",
    "brand": "LATTAFA",
    "description": "Haya de Lattafa Perfumes es una fragancia de la familia olfativa para Mujeres. Haya se lanzó en 2022. Las Notas de Salida son fresa, champaña, naranja tangerina, naranja sanguina y rosa; las Notas de Corazón son gardenia, jazmín y orquídea de vainilla; las Notas de Fondo son ámbar, sándalo y castaña.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6700
      },
      {
        "size": "100ml",
        "price": 66800
      }
    ],
    "images": [
          "/images/products/LATTAFA%20HAYA%202.jpg",
          "/images/products/LATTAFA%20HAYA%204(1).jpg",
          "/images/products/LATTAFA%20HAYA%204.JPG"
    ]
  },
  {
    "id": "44",
    "name": "HAYAATI GOLD ELIXIR EDP 100ML",
    "brand": "LATTAFA",
    "description": "Hayaati Gold Elixir de Lattafa Perfumes es una fragancia de la familia olfativa para Hombres y Mujeres. Las Notas de Salida son bergamota, toronja (pomelo) y casis (grosellero negro); las Notas de Corazón son cuero, durazno (melocotón) y azafrán; las Notas de Fondo son vainilla, ámbar, almizcle y vetiver.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 4600
      },
      {
        "size": "100ml",
        "price": 46300
      }
    ],
    "images": [
          "/images/products/LATTAFA%20HAYAATI(1).jpg",
          "/images/products/LATTAFA%20HAYAATI(2).jpg",
          "/images/products/LATTAFA%20HAYAATI(3).jpg"
    ]
  },
  {
    "id": "45",
    "name": "KHAMRAH EDP 100ML",
    "brand": "LATTAFA",
    "description": "Khamrah de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Especiada para Hombres y Mujeres. Khamrah se lanzó en 2022. Las Notas de Salida son canela, nuez moscada y bergamota; las Notas de Corazón son dátiles, praliné, nardos y Mahonial; las Notas de Fondo son vainilla, haba tonka, Amberwood, mirra, benjuí y Akigalawood.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6900
      },
      {
        "size": "100ml",
        "price": 68600
      }
    ],
    "images": [
          "/images/products/LATTAFA%20KHAMRAH(1).JPG",
          "/images/products/LATTAFA%20KHAMRAH(2).jpg",
          "/images/products/LATTAFA%20KHAMRAH(3).jpg"
    ]
  },
  {
    "id": "46",
    "name": "MAAHIR BLACK EDP 100ML",
    "brand": "LATTAFA",
    "description": "Maahir Black Edition de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Especiada para Hombres y Mujeres. Maahir Black Edition se lanzó en 2020. Las Notas de Salida son pimienta negra, pimienta rosa y azafrán; las Notas de Corazón son Aceite de cade, ládano, bálsamo de Gurjum y ruibarbo; las Notas de Fondo son cuero, cedro, madera de gaiac, pachulí, musgo y almizcle.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 6500
      },
      {
        "size": "100ml",
        "price": 65200
      }
    ],
    "images": [
          "/images/products/MAHIIR%20BLACK(1).jpg",
          "/images/products/MAHIIR%20BLACK.JPG"
    ]
  },
  {
    "id": "47",
    "name": "MAAHIR GOLD EDP 100ML",
    "brand": "LATTAFA",
    "description": "Maahir de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Floral para Hombres y Mujeres. Maahir se lanzó en 2019. Las Notas de Salida son bayas rojas, durazno (melocotón) y bergamota; las Notas de Corazón son jazmín, peonía y azucena roja; las Notas de Fondo son sándalo, flor de vainilla y almizcle.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 7000
      },
      {
        "size": "100ml",
        "price": 69500
      }
    ],
    "images": [
          "/images/products/MAHIIR%20GOLD(1).jpg",
          "/images/products/MAHIIR%20GOLD.jpg",
          "/images/products/MAHIR%20GOLD.JPG"
    ]
  },
  {
    "id": "48",
    "name": "MAYAR CHERRY INTENSE 100ML",
    "brand": "LATTAFA",
    "description": "Mayar Cherry Intense de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Vainilla para Hombres y Mujeres. Esta fragrancia es nueva. Mayar Cherry Intense se lanzó en 2024. Las Notas de Salida son fresa y bergamota; las Notas de Corazón son Mermelada de cereza y cacao; las Notas de Fondo son vainilla, ámbar y pachulí.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6500
      },
      {
        "size": "100ml",
        "price": 65200
      }
    ],
    "images": [
          "/images/products/LATTAFA%20MAYAR%20CHERRY.jpg",
          "/images/products/MAYAR%20CHERRY.jpg"
    ]
  },
  {
    "id": "49",
    "name": "MAYAR EDP 100ML",
    "brand": "LATTAFA",
    "description": "Mayar de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal para Mujeres. Mayar se lanzó en 2022. Las Notas de Salida son lichi, frambuesa y hojas de violeta; las Notas de Corazón son rosa blanca, peonía y jazmín; las Notas de Fondo son almizcle y vainilla.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6700
      },
      {
        "size": "100ml",
        "price": 66800
      }
    ],
    "images": [
          "/images/products/LATTAFA%20MAYAR.jpg",
          "/images/products/MAYAR(1).jpg",
          "/images/products/MAYAR.JPG"
    ]
  },
  {
    "id": "50",
    "name": "MUSK CANDY ROSE EDP 100ML",
    "brand": "LATTAFA",
    "description": "Musk Candy Rose de Lattafa Perfumes es una fragancia de la familia olfativa para Hombres y Mujeres. Musk Candy Rose se lanzó durante la 2020's. Las Notas de Salida son rosa y cítricos; las Notas de Corazón son almizcle blanco y notas florales; las Notas de Fondo son almizcle y ámbar.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 5200
      },
      {
        "size": "100ml",
        "price": 51500
      }
    ],
    "images": [
          "/images/products/LATTAFA%20CANDY%20MUSK(1).JPG",
          "/images/products/LATTAFA%20CANDY%20MUSK.jpg"
    ]
  },
  {
    "id": "51",
    "name": "SEHR EDP 100ML",
    "brand": "LATTAFA",
    "description": "Sehr de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Floral para Hombres y Mujeres. Sehr se lanzó en 2024. Las Notas de Salida son almendra amarga y canela; las Notas de Corazón son Akigalawood, Pomarose y jazmín; las Notas de Fondo son absoluto de vainilla, haba tonka y ámbar.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 8200
      },
      {
        "size": "100ml",
        "price": 82300
      }
    ],
    "images": []
  },
  {
    "id": "52",
    "name": "THE KINGDOM FOR MEN EDP 100ML",
    "brand": "LATTAFA",
    "description": "The Kingdom For Men de Lattafa Perfumes es una fragancia de la familia olfativa Aromática para Hombres. Esta fragrancia es nueva. The Kingdom For Men se lanzó en 2024. Las Notas de Salida son lavanda, menta y salvia; las Notas de Corazón son vainilla, tabaco y flor de azahar del naranjo; las Notas de Fondo son haba tonka, benjuí y ládano.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 8200
      },
      {
        "size": "100ml",
        "price": 82300
      }
    ],
    "images": [
          "/images/products/LATTAFA%20THE%20KINGDOM.jpg",
          "/images/products/THE%20KINGDOM(1).jpg",
          "/images/products/THE%20KINGDOM(2).jpg"
    ]
  },
  {
    "id": "53",
    "name": "VINTAGE RADIO 100ML",
    "brand": "LATTAFA",
    "description": "Vintage Radio de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Amaderada para Hombres y Mujeres. Vintage Radio se lanzó en 2023. Las Notas de Salida son lavanda, salvia y bergamota; las Notas de Corazón son ciruela, palo santo y pimienta negra; las Notas de Fondo son sándalo y madera de oud.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 6700
      },
      {
        "size": "100ml",
        "price": 66800
      }
    ],
    "images": []
  },
  {
    "id": "54",
    "name": "ASAD EDP 100ML",
    "brand": "LATTAFA",
    "description": "Asad de Lattafa Perfumes es una fragancia de la familia olfativa Oriental para Hombres. Asad se lanzó en 2021. Las Notas de Salida son pimienta negra, tabaco y piña; las Notas de Corazón son pachulí, café y iris; las Notas de Fondo son vainilla, ámbar, Madera seca, benjuí y ládano.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 7600
      },
      {
        "size": "100ml",
        "price": 75500
      }
    ],
    "images": [
          "/images/products/LATTAFA%20ASAD(1).jpg",
          "/images/products/LATTAFA%20ASAD.JPG"
    ]
  },
  {
    "id": "55",
    "name": "ASAD BOURBON EDP 100ML",
    "brand": "LATTAFA",
    "description": "Asad Bourbon de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Especiada para Hombres. Esta fragrancia es nueva. Asad Bourbon se lanzó en 2025. Las Notas de Salida son lavanda, ciruela Mirabel y pimienta rosa; las Notas de Corazón son cacao, nuez moscada y Davana; las Notas de Fondo son vainilla Bourbon, ámbar y vetiver.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 8200
      },
      {
        "size": "100ml",
        "price": 82300
      }
    ],
    "images": [
          "/images/products/BOURBON(1).jpg",
          "/images/products/BOURBON.JPG",
          "/images/products/LATTAFA%20ASAD%20BOURBON.JPG"
    ]
  },
  {
    "id": "56",
    "name": "YARA CANDY WOMAN EDP 100ML",
    "brand": "LATTAFA",
    "description": "Yara Candy de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal Gourmand para Mujeres. Esta fragrancia es nueva. Yara Candy se lanzó en 2024. Las Notas de Salida son grosellas negras y Mandarina verde; las Notas de Corazón son Caramelo de fresa efervescente y gardenia; las Notas de Fondo son vainilla, almizcle, ámbar y sándalo.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
          "/images/products/YARA%20CANDY(1).JPG",
          "/images/products/YARA%20CANDY(2).jpg",
          "/images/products/YARA%20CANDY(3).jpg"
    ]
  },
  {
    "id": "57",
    "name": "YARA MOI EDP 100ML",
    "brand": "LATTAFA",
    "description": "Yara Moi de Lattafa Perfumes es una fragancia de la familia olfativa para Mujeres. Yara Moi se lanzó en 2022. Las Notas de Salida son jazmín y durazno (melocotón); las Notas de Corazón son caramelo y ámbar; las Notas de Fondo son pachulí y sándalo.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
          "/images/products/YARA%20MOI(1).jpg",
          "/images/products/YARA%20MOI(2).jpg",
          "/images/products/YARA%20MOI.jpg"
    ]
  },
  {
    "id": "58",
    "name": "YARA TOUS EDP 100ML",
    "brand": "LATTAFA",
    "description": "Yara Tous de Lattafa Perfumes es una fragancia de la familia olfativa para Mujeres. Yara Tous se lanzó en 2023. Las Notas de Salida son mango, coco y maracuyá (fruta de la pasión); las Notas de Corazón son jazmín, flor de azahar del naranjo y heliotropo; las Notas de Fondo son vainilla, almizcle y cachemira.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6100
      },
      {
        "size": "100ml",
        "price": 60800
      }
    ],
    "images": [
          "/images/products/YARA%20TOUS(1).JPG",
          "/images/products/YARA%20TOUS(2).jpg",
          "/images/products/YARA%20TOUS(3).jpg"
    ]
  },
  {
    "id": "59",
    "name": "YARA WOMAN EDP 100ML",
    "brand": "LATTAFA",
    "description": "Yara de Lattafa Perfumes es una fragancia de la familia olfativa Oriental Vainilla para Mujeres. Yara se lanzó en 2020. Las Notas de Salida son orquídea, heliotropo y naranja tangerina; las Notas de Corazón son Acorde goloso y frutas tropicales; las Notas de Fondo son vainilla, almizcle y sándalo.",
    "category": "femenino",
    "variants": [
      {
        "size": "5ml",
        "price": 6300
      },
      {
        "size": "100ml",
        "price": 62600
      }
    ],
    "images": [
          "/images/products/YARA%20WOMAN(1).jpg",
          "/images/products/YARA%20WOMAN(2).jpg",
          "/images/products/YARA%20WOMAN.JPG"
    ]
  },
  {
    "id": "60",
    "name": "CORAL BLUSH 80ML",
    "brand": "MAISON ALHAMBRA",
    "description": "Coral Blush de Maison Alhambra es una fragancia de la familia olfativa Floral Frutal para Hombres y Mujeres. Esta fragrancia es nueva. Coral Blush se lanzó en 2024. Las Notas de Salida son durazno (melocotón), hojas verdes y naranja sanguina; la Nota de Corazón es pachulí; las Notas de Fondo son coñac y miel.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 5200
      },
      {
        "size": "100ml",
        "price": 51500
      }
    ],
    "images": [
          "/images/products/CORAL%20BLUSH(1).jpg",
          "/images/products/coral%20blush(2).jpg",
          "/images/products/Coral%20blush(3).jpg"
    ]
  },
  {
    "id": "61",
    "name": "JEAN LOWE OMBRE EDP 100ML",
    "brand": "MAISON ALHAMBRA",
    "description": "Jean Lowe Ombre de Maison Alhambra es una fragancia de la familia olfativa para Hombres. Jean Lowe Ombre se lanzó en 2023. Las Notas de Salida son madera de oud y incienso; las Notas de Corazón son rosa, azafrán, frambuesa y abedul; las Notas de Fondo son ámbar, benjuí y geranio.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 6900
      },
      {
        "size": "100ml",
        "price": 68600
      }
    ],
    "images": [
          "/images/products/JEAN%20LOWE%20NOIR(1).jpg",
          "/images/products/JEAN%20LOWE%20NOIR.jpg"
    ]
  },
  {
    "id": "62",
    "name": "PHILOS PURA EDP 100ML",
    "brand": "MAISON ALHAMBRA",
    "description": "Philos Pura de Maison Alhambra es una fragancia de la familia olfativa Aromática Frutal para Hombres y Mujeres. Philos Pura se lanzó en 2022. Las Notas de Salida son naranja, bergamota y limón (lima ácida); la Nota de Corazón es frutas; las Notas de Fondo son vainilla de Madagascar, almizcle blanco y ámbar.",
    "category": "unisex",
    "variants": [
      {
        "size": "5ml",
        "price": 7300
      },
      {
        "size": "100ml",
        "price": 73300
      }
    ],
    "images": [
          "/images/products/PHILOS%20PURA(1).jpg",
          "/images/products/PHILOS%20PURA.jpg"
    ]
  },
  {
    "id": "63",
    "name": "MASCARA CAPILAR COLLAGEN 500ML",
    "brand": "KARSELL",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 27500
      }
    ],
    "images": []
  },
  {
    "id": "64",
    "name": "LOCION CORPORAL COCONUT DREAM",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 24000
      }
    ],
    "images": []
  },
  {
    "id": "65",
    "name": "LOCION CORPORAL ROMANCE DREAM",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 10300
      }
    ],
    "images": []
  },
  {
    "id": "66",
    "name": "LOCION CORPORAL VAINILLA DREAM",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 24000
      }
    ],
    "images": []
  },
  {
    "id": "67",
    "name": "MIST CORPORAL COCONUT DREAM  ",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 24000
      }
    ],
    "images": []
  },
  {
    "id": "68",
    "name": "MIST CORPORAL ROMANCE DREAM  ",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 10300
      }
    ],
    "images": []
  },
  {
    "id": "69",
    "name": "MIST CORPORAL VAINILLA DREAM  ",
    "brand": "STELLA DUSTIN",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 24000
      }
    ],
    "images": []
  },
  {
    "id": "70",
    "name": "BORN IN ROMA INTENSE",
    "brand": "VALENTINO",
    "description": "Valentino Donna Born In Roma Intense de Valentino es una fragancia de la familia olfativa Oriental Floral para Mujeres. Valentino Donna Born In Roma Intense se lanzó en 2023. Valentino Donna Born In Roma Intense fue creada por Amandine Clerc-Marie y Honorine Blanc. Las Notas de Salida son vainilla Bourbon y ámbar; la Nota de Corazón es jazmín; la Nota de Fondo es benjuí.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 35500
      }
    ],
    "images": []
  },
  {
    "id": "71",
    "name": "EROS EDT 100ML",
    "brand": "VERSACE",
    "description": "Eros de Versace es una fragancia de la familia olfativa Aromática Fougère para Hombres. Eros se lanzó en 2012. La Nariz detrás de esta fragrancia es Aurélien Guichard. Las Notas de Salida son menta, manzana verde y limón (lima ácida); las Notas de Corazón son haba tonka, ambroxan y geranio; las Notas de Fondo son vainilla de Madagascar, cedro de Virginia, cedro del Atlas, vetiver y musgo de roble.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 14400
      }
    ],
    "images": []
  },
  {
    "id": "72",
    "name": "EROS FLAME EDP 200ml",
    "brand": "VERSACE",
    "description": "Eros Flame de Versace es una fragancia de la familia olfativa Amaderada Especiada para Hombres. Eros Flame se lanzó en 2018. La Nariz detrás de esta fragrancia es Olivier Pescheux. Las Notas de Salida son mandarina, pimienta de Madagascar, limón (lima ácida), Chinotto y romero; las Notas de Corazón son geranio, rosa y Pepperwood™; las Notas de Fondo son vainilla, haba tonka, sándalo, cedro de Texas, pachulí y musgo de roble.",
    "category": "masculino",
    "variants": [
      {
        "size": "5ml",
        "price": 13400
      }
    ],
    "images": []
  },
  {
    "id": "73",
    "name": "LOCION CORPORAL AMBER ROMANCE",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "74",
    "name": "LOCION CORPORAL COCONUT PASSION",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "75",
    "name": "LOCION CORPORAL LOVE SPELL",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "76",
    "name": "LOCION CORPORAL PURE SEDUCTION",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "77",
    "name": "LOCION CORPORAL VAINILLA ",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "78",
    "name": "MIST CORPORAL AMBER ROMANCE 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "79",
    "name": "MIST CORPORAL AQUA KISS 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "80",
    "name": "MIST CORPORAL COCONUT PASSION 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "81",
    "name": "MIST CORPORAL JAZMINE 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "82",
    "name": "MIST CORPORAL LOVE SPELL 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "83",
    "name": "MIST CORPORAL MIDNIGHT BLOOM 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "84",
    "name": "MIST CORPORAL PURE SEDUCTION 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "85",
    "name": "MIST CORPORAL VAINILLA 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  },
  {
    "id": "86",
    "name": "MIST CORPORAL VAINILLA CON BRILLO 250ML",
    "brand": "VICTORIA’S SECRET",
    "description": "",
    "category": "femenino",
    "variants": [
      {
        "size": "100ml",
        "price": 41200
      }
    ],
    "images": []
  }
];

const STORAGE_KEY = 'nura_catalog_v6';

// Persist catalog to disk via API (data/catalog.json)
const saveToDisk = async (products) => {
  try {
    await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
  } catch (e) {
    console.warn('No se pudo guardar en disco:', e.message);
  }
};

// Sube una imagen y devuelve su URL pública.
// Con Supabase configurado -> Supabase Storage (sirve en producción).
// Sin Supabase -> API del servidor de desarrollo (escribe en public/images).
export const uploadProductImage = async (file) => {
  if (isSupabaseConfigured) {
    const dot = file.name.lastIndexOf('.');
    const ext = (dot >= 0 ? file.name.slice(dot + 1) : 'jpg').toLowerCase();
    const base = (dot >= 0 ? file.name.slice(0, dot) : file.name)
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .slice(0, 60) || 'imagen';
    const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${ext}`;
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(objectPath, file, { contentType: file.type || undefined, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: ev.target.result
          })
        });
        const result = await res.json();
        if (result.ok) {
          resolve(result.path);
        } else {
          reject(new Error(result.error));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Ordena el catálogo por marca y, dentro de cada marca, alfabéticamente por
// nombre. Se aplica siempre (al cargar y al agregar/editar), así un producto
// nuevo queda en su lugar automáticamente.
const sortByBrandThenName = (arr) => [...arr].sort((a, b) => {
  const brandCmp = (a.brand || '').localeCompare(b.brand || '', 'es', { sensitivity: 'base' });
  if (brandCmp !== 0) return brandCmp;
  return (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' });
});

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef(null);

  // Load catalog on mount.
  // Order of preference:
  //   1) /api/catalog   -> live data from the dev server (admin edits persist here)
  //   2) /catalog.json  -> static snapshot generated at build time (production hosting)
  //   3) localStorage   -> last data seen in this browser
  //   4) initialProducts (bundled fallback)
  useEffect(() => {
    // Fetch a URL and return a valid products array, or null if unavailable.
    const fetchProducts = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        // On static hosting a SPA rewrite may answer unknown paths with index.html;
        // ignore anything that isn't actually JSON.
        if (!contentType.includes('application/json')) return null;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : null;
      } catch {
        return null;
      }
    };

    const loadCatalog = async () => {
      // 0) Supabase: fuente principal cuando está configurado.
      if (isSupabaseConfigured) {
        const { data: rows, error } = await supabase
          .from('products')
          .select('*')
          .order('position', { ascending: true });
        if (!error && Array.isArray(rows) && rows.length > 0) {
          setProducts(sortByBrandThenName(rows));
          setLoaded(true);
          return;
        }
      }

      let data = await fetchProducts('/api/catalog');
      if (!data) data = await fetchProducts('/catalog.json');

      if (data) {
        setProducts(sortByBrandThenName(data));
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(sortByBrandThenName(parsed));
            }
          }
        } catch { /* use initialProducts */ }
      }
      setLoaded(true);
    };
    loadCatalog();
  }, []);

  // Guardado por archivo (solo modo legacy sin Supabase). Con Supabase los
  // cambios se persisten por operación (insert/update/delete), abajo.
  useEffect(() => {
    if (!loaded) return; // Don't save during initial load
    if (isSupabaseConfigured) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveToDisk(products);
    }, 500);
  }, [products, loaded]);

  // Mapea un producto a las columnas de la tabla (evita mandar campos extra).
  const toRow = (p) => ({
    name: p.name,
    brand: p.brand ?? null,
    description: p.description ?? null,
    category: p.category ?? null,
    variants: p.variants ?? [],
    images: p.images ?? [],
    stock: Number.isFinite(p.stock) ? p.stock : 0,
    discount: Number.isFinite(p.discount) ? p.discount : 0,
    on_sale: !!p.on_sale,
    active: p.active === false ? false : true
  });

  // visibleVariants vive en lib/stock.js — usa variantAffectsStock por debajo
  // para inferir "frasco" en variantes viejas sin flag explícito.
  const isProductPublicVisible = (p) => p?.active !== false && visibleVariants(p).length > 0;
  // Lista filtrada para el publico (oculta inactivos y los que no tienen
  // ninguna variante disponible). El admin sigue viendo `products` completo.
  const publicProducts = React.useMemo(
    () => products.filter(isProductPublicVisible).map(p => ({ ...p, variants: visibleVariants(p) })),
    [products]
  );

  const addProduct = async (product) => {
    const id = Date.now().toString();
    const position = products.length
      ? Math.max(...products.map(p => p.position ?? 0)) + 1
      : 0;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .insert({ id, position, ...toRow(product) })
        .select()
        .single();
      if (error) throw error;
      setProducts(prev => sortByBrandThenName([...prev, data]));
      return data;
    }

    const newProduct = { ...product, id, position };
    setProducts(prev => sortByBrandThenName([...prev, newProduct]));
    return newProduct;
  };

  const updateProduct = async (id, updatedData) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...toRow(updatedData), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setProducts(prev => sortByBrandThenName(prev.map(p => p.id === id ? data : p)));
      return data;
    }

    setProducts(prev => sortByBrandThenName(prev.map(p => p.id === id ? { ...p, ...updatedData } : p)));
  };

  const deleteProduct = async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Ajusta el stock de un producto (delta negativo = venta, positivo = compra).
  // Hace una actualización puntual de la columna stock (no toca el resto).
  const adjustStock = async (productId, delta) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock ?? 0) + delta);
    const variants = (prod.variants || []).map(v =>
      v.affectsStock ? { ...v, active: newStock > 0 } : v
    );
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock, variants, updated_at: new Date().toISOString() })
        .eq('id', productId);
      if (error) throw error;
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock, variants } : p));
  };

  // Filtra según la categoría elegida:
  // - todos: todo el catálogo.
  // - masculino / femenino: primero los de esa categoría, luego los unisex.
  // - unisex / combos: sólo los de esa categoría.
  // Dentro de cada grupo, ordenado por marca y nombre.
  const getFilteredProducts = (category) => {
    const sorted = sortByBrandThenName(publicProducts);
    if (category === 'todos' || !category) return sorted;
    if (category === 'masculino' || category === 'femenino') {
      const main = sorted.filter(p => p.category === category);
      const unisex = sorted.filter(p => p.category === 'unisex');
      return [...main, ...unisex];
    }
    return sorted.filter(p => p.category === category);
  };

  const resetCatalog = () => {
    setProducts(initialProducts);
    localStorage.removeItem(STORAGE_KEY);
    saveToDisk(initialProducts);
  };

  return (
    <CatalogContext.Provider value={{
      products,
      publicProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      getFilteredProducts,
      resetCatalog,
      usingSupabase: isSupabaseConfigured
    }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
};
