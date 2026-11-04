import {
  posterColors,
  posterText,
  type PosterColor,
  type ShareSnapshot,
} from './journey-sharing';

export function drawJourneyPoster(
  canvas: HTMLCanvasElement,
  snapshot: ShareSnapshot,
  name: string,
  color: PosterColor,
  includeProgress: boolean,
  certificate: boolean,
) {
  const text = posterText(snapshot, name, includeProgress, certificate);
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error(
      'Image generation is unavailable. You can still download the itinerary.',
    );
  canvas.width = 1080;
  canvas.height = 1350;
  const accent = posterColors[color];
  const gradient = context.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#111c25');
  gradient.addColorStop(1, '#030608');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1080, 1350);
  context.strokeStyle = accent;
  context.lineWidth = 2;
  for (let ring = 0; ring < 7; ring++) {
    context.globalAlpha = 0.1 + ring * 0.02;
    context.beginPath();
    context.ellipse(
      540,
      460,
      180 + ring * 42,
      240 + ring * 30,
      -0.35,
      0,
      Math.PI * 2,
    );
    context.stroke();
  }
  context.globalAlpha = 1;
  context.strokeRect(38, 38, 1004, 1274);
  context.textAlign = 'center';
  context.fillStyle = accent;
  context.font = '24px monospace';
  context.fillText('THE ROAD TO DOOMSDAY', 540, 112);
  context.font = 'bold 28px sans-serif';
  context.fillText(text.heading, 540, 250);
  context.fillStyle = '#f1f5f9';
  context.font = 'bold 78px sans-serif';
  const words = text.journey.split(' ');
  let line = '';
  let y = 385;
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (line && context.measureText(next).width > 870) {
      context.fillText(line, 540, y);
      y += 96;
      line = word;
    } else {
      line = next;
    }
  }
  context.fillText(line, 540, y);
  context.font = '32px sans-serif';
  context.fillStyle = accent;
  context.fillText(text.name, 540, 820, 870);
  context.font = '28px sans-serif';
  context.fillStyle = '#cbd5e1';
  context.fillText(text.detail, 540, 915);
  context.font = 'italic 34px serif';
  context.fillText('Every story led here.', 540, 1080);
  context.font = '20px sans-serif';
  context.fillText(text.footer, 540, 1240);
}
