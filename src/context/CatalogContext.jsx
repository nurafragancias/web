import React, { createContext, useState, useEffect, useContext } from 'react';

const CatalogContext = createContext();

const initialProducts = [
  {
    "id": "1",
    "name": " 9 AM DIVE EDP 100ML",
    "brand": "AFNAN",
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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
    "description": "",
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

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* ignore */ }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getFilteredProducts = (category) => {
    if (category === 'todos') return products;
    if (category === 'masculino') {
      return products.filter(p => p.category === 'masculino' || p.category === 'unisex');
    }
    if (category === 'femenino') {
      return products.filter(p => p.category === 'femenino' || p.category === 'unisex');
    }
    return products.filter(p => p.category === category);
  };

  const resetCatalog = () => {
    setProducts(initialProducts);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CatalogContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getFilteredProducts,
      resetCatalog
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
