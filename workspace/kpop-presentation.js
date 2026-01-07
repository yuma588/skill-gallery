const pptxgen = require('pptxgenjs');

function createKPopPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'K-Pop Culture';
  pptx.title = 'K-Pop: The Global Music Phenomenon';

  // Slide 1: Title
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0A0A0A' };
  slide1.addText('K-POP', {
    x: 1, y: 1.5, w: 8, h: 2,
    fontSize: 72,
    bold: true,
    align: 'center',
    color: 'FF2E96',
    fontFace: 'Arial'
  });
  slide1.addText('The Global Music Phenomenon', {
    x: 1, y: 3.2, w: 8, h: 0.8,
    fontSize: 28,
    align: 'center',
    color: 'FFFFFF',
    fontFace: 'Arial'
  });

  // Slide 2: History
  const slide2 = pptx.addSlide();
  slide2.background = { color: '0A0A0A' };
  slide2.addText('A Brief History', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 42,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial'
  });
  slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.65, w: 0.2, h: 0.5,
    fill: { color: 'FF2E96' }
  });
  const historyItems = [
    { title: '1990s - The Birth', desc: 'Seo Taiji and Boys revolutionize Korean music with hip-hop influences.', color: 'FF2E96' },
    { title: '2000s - Hallyu Wave', desc: 'TVXQ, Girls' Generation, Super Junior lead to Korean Wave across Asia.', color: '9B4DCA' },
    { title: '2010s-Present - Global Domination', desc: 'BTS, BLACKPINK, TWICE break international barriers worldwide.', color: '00E5FF' }
  ];
  historyItems.forEach((item, i) => {
    slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: 1.6 + i * 0.9, w: 8.6, h: 0.75,
      fill: { color: '1A0A1A' },
      line: { color: item.color, width: 2 }
    });
    slide2.addText(item.title, {
      x: 0.9, y: 1.75 + i * 0.9, w: 5, h: 0.3,
      fontSize: 18,
      bold: true,
      color: item.color,
      fontFace: 'Arial'
    });
    slide2.addText(item.desc, {
      x: 0.9, y: 2.0 + i * 0.9, w: 8.2, h: 0.35,
      fontSize: 13,
      color: 'CCCCCC',
      fontFace: 'Arial'
    });
  });

  // Slide 3: Styles
  const slide3 = pptx.addSlide();
  slide3.background = { color: '0A0A0A' };
  slide3.addText('Major Styles', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 42,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial'
  });
  slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.65, w: 0.2, h: 0.5,
    fill: { color: '9B4DCA' }
  });
  const styles = [
    { name: 'Idol Pop', desc: 'Polished productions, synchronized choreography, catchy hooks.', color: 'FF2E96' },
    { name: 'Hip-Hop & R&B', desc: 'Rap-heavy tracks, urban beats, street style influences.', color: '9B4DCA' },
    { name: 'Electronic & Dance', desc: 'EDM-infused beats, synth-heavy production, high-energy.', color: '00E5FF' },
    { name: 'Ballads & R&B', desc: 'Emotional vocals, piano-driven melodies, love themes.', color: 'FFB6C1' }
  ];
  styles.forEach((style, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6 + col * 4.4, y: 1.5 + row * 1.3, w: 4.2, h: 1.1,
      fill: { color: '1A0A1A' },
      line: { color: style.color, width: 2 }
    });
    slide3.addText(style.name, {
      x: 0.8 + col * 4.4, y: 1.65 + row * 1.3, w: 3.8, h: 0.25,
      fontSize: 18,
      bold: true,
      color: style.color,
      fontFace: 'Arial'
    });
    slide3.addText(style.desc, {
      x: 0.8 + col * 4.4, y: 1.9 + row * 1.3, w: 3.8, h: 0.55,
      fontSize: 12,
      color: 'CCCCCC',
      fontFace: 'Arial'
    });
  });

  // Slide 4: Global Impact with Chart
  const slide4 = pptx.addSlide();
  slide4.background = { color: '0A0A0A' };
  slide4.addText('Global Impact', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 38,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial'
  });
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.65, w: 0.2, h: 0.45,
    fill: { color: '00E5FF' }
  });
  slide4.addText('$12.5B+', {
    x: 0.6, y: 1.5, w: 2.5, h: 0.5,
    fontSize: 28,
    bold: true,
    color: '00E5FF',
    fontFace: 'Arial'
  });
  slide4.addText('Annual Revenue', {
    x: 0.6, y: 1.9, w: 2.5, h: 0.3,
    fontSize: 13,
    color: 'CCCCCC',
    fontFace: 'Arial'
  });
  slide4.addText('120+', {
    x: 0.6, y: 2.5, w: 2.5, h: 0.5,
    fontSize: 28,
    bold: true,
    color: '00E5FF',
    fontFace: 'Arial'
  });
  slide4.addText('Countries Reached', {
    x: 0.6, y: 2.9, w: 2.5, h: 0.3,
    fontSize: 13,
    color: 'CCCCCC',
    fontFace: 'Arial'
  });
  slide4.addChart(pptx.charts.LINE, [{
    name: 'Global Revenue',
    labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    values: [4.7, 5.4, 6.1, 7.8, 8.4, 10.2, 11.1, 12.5]
  }], {
    x: 3.5, y: 1.5, w: 6, h: 3,
    lineSize: 4,
    lineSmooth: true,
    showTitle: true,
    title: 'K-Pop Industry Revenue Growth',
    showCatAxisTitle: true,
    catAxisTitle: 'Year',
    showValAxisTitle: true,
    valAxisTitle: 'Revenue (Billion $)',
    valAxisMinVal: 0,
    valAxisMaxVal: 14,
    valAxisMajorUnit: 2,
    chartColors: ['00E5FF']
  });

  // Slide 5: Representative Groups
  const slide5 = pptx.addSlide();
  slide5.background = { color: '0A0A0A' };
  slide5.addText('Representative Groups', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 38,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial'
  });
  slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 0.65, w: 0.2, h: 0.45,
    fill: { color: 'FFB6C1' }
  });
  const groups = [
    { name: 'BTS', desc: '7-member. Global ambassadors, Billboard record-breakers.', color: 'FF2E96' },
    { name: 'BLACKPINK', desc: '4-member. YouTube sensations, Coachella performers.', color: '9B4DCA' },
    { name: 'TWICE', desc: '9-member. Japan sensations with catchy songs.', color: '00E5FF' },
    { name: 'EXO', desc: 'Multi-awarded. Concept versatility and powerful performances.', color: 'FFB6C1' },
    { name: 'RED VELVET', desc: 'Dual-concept. Sweet "Red" and sophisticated "Velvet".', color: 'FFD700' },
    { name: 'STRAY KIDS', desc: 'Self-producing. Energetic hip-hop and impactful.', color: '98FB98' }
  ];
  groups.forEach((group, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5 + col * 2.8, y: 1.5 + row * 1.3, w: 2.6, h: 1.1,
      fill: { color: '1A0A1A' },
      line: { color: group.color, width: 2 }
    });
    slide5.addText(group.name, {
      x: 0.65 + col * 2.8, y: 1.6 + row * 1.3, w: 2.3, h: 0.25,
      fontSize: 16,
      bold: true,
      color: group.color,
      fontFace: 'Arial'
    });
    slide5.addText(group.desc, {
      x: 0.65 + col * 2.8, y: 1.85 + row * 1.3, w: 2.3, h: 0.6,
      fontSize: 11,
      color: 'CCCCCC',
      fontFace: 'Arial'
    });
  });

  // Slide 6: Conclusion
  const slide6 = pptx.addSlide();
  slide6.background = { color: '0A0A0A' };
  slide6.addText('THE FUTURE', {
    x: 1, y: 1.2, w: 8, h: 1,
    fontSize: 52,
    bold: true,
    align: 'center',
    color: 'FF2E96',
    fontFace: 'Arial'
  });
  slide6.addText('K-pop continues to break barriers and redefine', {
    x: 1, y: 2.3, w: 8, h: 0.4,
    fontSize: 20,
    align: 'center',
    color: 'CCCCCC',
    italic: true,
    fontFace: 'Arial'
  });
  slide6.addText('global music culture, proving that', {
    x: 1, y: 2.6, w: 8, h: 0.4,
    fontSize: 20,
    align: 'center',
    color: 'CCCCCC',
    italic: true,
    fontFace: 'Arial'
  });
  slide6.addText('art knows no boundaries', {
    x: 1, y: 2.9, w: 8, h: 0.4,
    fontSize: 20,
    bold: true,
    align: 'center',
    color: 'FF2E96',
    italic: true,
    fontFace: 'Arial'
  });
  slide6.addShape(pptx.shapes.LINE, {
    x: 2, y: 3.5, w: 6, h: 0,
    line: { color: 'FF2E96', width: 2 }
  });
  slide6.addText('Thank You', {
    x: 1, y: 3.7, w: 8, h: 0.4,
    fontSize: 16,
    align: 'center',
    color: 'FFFFFF',
    fontFace: 'Arial'
  });

  pptx.writeFile({ fileName: 'kpop-presentation.pptx' });
  console.log('K-Pop presentation created successfully!');
}

createKPopPresentation();
