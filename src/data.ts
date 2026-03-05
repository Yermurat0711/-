export type Round = {
  id: number;
  images: string[];
  answer: string;
  explanation: string;
};

export const rounds: Round[] = [
  {
    "id": 1,
    "images": [
      "https://placehold.co/600x600/1e293b/ffffff?text=A",
      "https://placehold.co/600x600/1e293b/ffffff?text=Creation%20of%20Adam",
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/%D0%92%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0_%D1%81_%D0%9D%D1%83%D1%80%D1%81%D1%83%D0%BB%D1%82%D0%B0%D0%BD%D0%BE%D0%BC_%D0%9D%D0%B0%D0%B7%D0%B0%D1%80%D0%B1%D0%B0%D0%B5%D0%B2%D1%8B%D0%BC_%282025-05-29%29_3_%28cropped%29.jpg"
    ],
    "answer": "Первые",
    "explanation": "Первая буква алфавита, первый человек, первый президент Казахстана."
  },
  {
    "id": 2,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Half-hour_sand_glass_MET_ES268.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Euro_coins_and_banknotes_%28cropped%29.jpg/960px-Euro_coins_and_banknotes_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/The_Doctor_Luke_Fildes_crop.jpg/960px-The_Doctor_Luke_Fildes_crop.jpg"
    ],
    "answer": "Время",
    "explanation": "Песочные часы, выражение «Время — деньги», выражение «Время лечит»."
  },
  {
    "id": 3,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/The_Sun_in_white_light.jpg/960px-The_Sun_in_white_light.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Walk_of_Fame%2C_Hollywood_%2820986072759%29.jpg/960px-Walk_of_Fame%2C_Hollywood_%2820986072759%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Starfish_montage.png/960px-Starfish_montage.png"
    ],
    "answer": "Звезда",
    "explanation": "Солнце (звезда), Аллея славы (звезды), морская звезда."
  },
  {
    "id": 4,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg/960px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Winter_forest_silver.jpg/960px-Winter_forest_silver.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Open_refrigerator_with_food_at_night.jpg/960px-Open_refrigerator_with_food_at_night.jpg"
    ],
    "answer": "Холод",
    "explanation": "Мороженое, зимний лес, холодильник."
  },
  {
    "id": 5,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Aachen_Domschatz_Bueste1.jpg/960px-Aachen_Domschatz_Bueste1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Fphar-11-00937-g001.jpg/960px-Fphar-11-00937-g001.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/64/HK_Kwun_Tong_%E9%BA%97%E6%B8%AF%E5%85%AC%E5%9C%92_Laguna_Park_Tree_evening_sunset.JPG"
    ],
    "answer": "Корона",
    "explanation": "Король, коронавирус, крона дерева."
  },
  {
    "id": 6,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/4/48/Padlock_kl%C3%B3dka_ubt.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Mnemonic_bass_alto_treble_clefs.svg/960px-Mnemonic_bass_alto_treble_clefs.svg.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Big_Spring_Missouri_1-02Aug08.jpg/960px-Big_Spring_Missouri_1-02Aug08.jpg"
    ],
    "answer": "Ключ",
    "explanation": "Дверной замок (нужен ключ), скрипичный ключ, родник (бьет ключом)."
  },
  {
    "id": 7,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Guinea_Fowl_Hunter_%2849109425873%29.jpg/960px-Guinea_Fowl_Hunter_%2849109425873%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Carolina_Herrera_AW14_12.jpg"
    ],
    "answer": "Лук",
    "explanation": "Овощ, оружие, модный образ (look)."
  },
  {
    "id": 8,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Braid_final_rot.jpg/960px-Braid_final_rot.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Scythe_user.png/960px-Scythe_user.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Spit_diagram.svg/960px-Spit_diagram.svg.png"
    ],
    "answer": "Коса",
    "explanation": "Девичья коса, инструмент смерти, песчаная коса."
  },
  {
    "id": 9,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Paintbrushes.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hand%2C_fingers_-_back.jpg/960px-Hand%2C_fingers_-_back.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/960px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg"
    ],
    "answer": "Кисть",
    "explanation": "Малярная кисть, кисть руки, кисть винограда."
  },
  {
    "id": 10,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/%D8%B2%D8%A8%D8%A7%D9%86_tongue.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/39/C_Hello_World_Program.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Parts_of_a_Bell.svg/960px-Parts_of_a_Bell.svg.png"
    ],
    "answer": "Язык",
    "explanation": "Орган (язык), язык программирования, язык колокола."
  }
];
