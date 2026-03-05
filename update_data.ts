import fs from 'fs';

async function getWikiImage(title: string, lang: string = 'en'): Promise<string> {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=600&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1' || !pages[pageId].thumbnail) {
      return `https://placehold.co/600x600/1e293b/ffffff?text=${encodeURIComponent(title)}`;
    }
    return pages[pageId].thumbnail.source;
  } catch (e) {
    return `https://placehold.co/600x600/1e293b/ffffff?text=${encodeURIComponent(title)}`;
  }
}

async function main() {
  const roundsData = [
    {
      id: 1,
      queries: [{t: "A", l: "en", override: "https://placehold.co/600x600/1e293b/ffffff?text=A"}, {t: "Creation of Adam", l: "en"}, {t: "Nursultan Nazarbayev", l: "en"}],
      answer: "Первые",
      explanation: "Первая буква алфавита, первый человек, первый президент Казахстана."
    },
    {
      id: 2,
      queries: [{t: "Hourglass", l: "en"}, {t: "Money", l: "en"}, {t: "Medicine", l: "en"}],
      answer: "Время",
      explanation: "Песочные часы, выражение «Время — деньги», выражение «Время лечит»."
    },
    {
      id: 3,
      queries: [{t: "Sun", l: "en"}, {t: "Hollywood Walk of Fame", l: "en"}, {t: "Starfish", l: "en"}],
      answer: "Звезда",
      explanation: "Солнце (звезда), Аллея славы (звезды), морская звезда."
    },
    {
      id: 4,
      queries: [{t: "Ice cream", l: "en"}, {t: "Winter", l: "en"}, {t: "Refrigerator", l: "en"}],
      answer: "Холод",
      explanation: "Мороженое, зимний лес, холодильник."
    },
    {
      id: 5,
      queries: [{t: "King", l: "en"}, {t: "COVID-19", l: "en"}, {t: "Crown (botany)", l: "en"}],
      answer: "Корона",
      explanation: "Король, коронавирус, крона дерева."
    },
    {
      id: 6,
      queries: [{t: "Padlock", l: "en"}, {t: "Clef", l: "en"}, {t: "Spring (hydrology)", l: "en"}],
      answer: "Ключ",
      explanation: "Дверной замок (нужен ключ), скрипичный ключ, родник (бьет ключом)."
    },
    {
      id: 7,
      queries: [{t: "Onion", l: "en"}, {t: "Bow and arrow", l: "en"}, {t: "Fashion", l: "en"}],
      answer: "Лук",
      explanation: "Овощ, оружие, модный образ (look)."
    },
    {
      id: 8,
      queries: [{t: "Braid", l: "en"}, {t: "Scythe", l: "en"}, {t: "Spit (landform)", l: "en"}],
      answer: "Коса",
      explanation: "Девичья коса, инструмент смерти, песчаная коса."
    },
    {
      id: 9,
      queries: [{t: "Paintbrush", l: "en"}, {t: "Hand", l: "en"}, {t: "Grape", l: "en"}],
      answer: "Кисть",
      explanation: "Малярная кисть, кисть руки, кисть винограда."
    },
    {
      id: 10,
      queries: [{t: "Tongue", l: "en"}, {t: "Programming language", l: "en"}, {t: "Bell", l: "en"}],
      answer: "Язык",
      explanation: "Орган (язык), язык программирования, язык колокола."
    }
  ];

  const rounds = [];
  for (const r of roundsData) {
    const images = [];
    for (const q of r.queries) {
      if (q.override) {
        images.push(q.override);
      } else {
        images.push(await getWikiImage(q.t, q.l));
      }
    }
    rounds.push({
      id: r.id,
      images,
      answer: r.answer,
      explanation: r.explanation
    });
  }

  const fileContent = `export type Round = {
  id: number;
  images: string[];
  answer: string;
  explanation: string;
};

export const rounds: Round[] = ${JSON.stringify(rounds, null, 2)};
`;

  fs.writeFileSync('./src/data.ts', fileContent);
  console.log('src/data.ts updated successfully!');
}

main();
