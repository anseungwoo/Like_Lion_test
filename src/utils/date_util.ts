export const oneDayDateNumber = 1000 * 60 * 60 * 24;
// export const oneDayDateNumber = 1000 * 6;

export const dateToStr: (date: Date) => string = (date) => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();
  const second: number = date.getSeconds();
  let text: string = '';

  text += year.toString() + '년';
  text += ' ' + month.toString() + '월';
  text += ' ' + day.toString() + '일';
  text += ' ' + hour.toString() + '시';
  text += ' ' + minute.toString() + '분';
  text += ' ' + second.toString() + '초';

  return text;
};
export const dateToStrEng: (date: Date) => string = (date) => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();
  const second: number = date.getSeconds();
  let text: string = '';

  text += year.toString() + '/';
  text += month.toString().padStart(2, '0') + '/';
  text += day.toString().padStart(2, '0');
  text += ' ' + hour.toString().padStart(2, '0') + 'h';
  text += ' ' + minute.toString().padStart(2, '0') + 'm';
  text += ' ' + second.toString().padStart(2, '0') + 's';

  return text;
};

export const msToPeriodStrEng: (ms: number) => string = (ms) => {
  const hour: string = Math.floor(ms / (1000 * 60 * 60)).toString();
  const minute: string = (Math.floor(ms / (1000 * 60)) % 60).toString();
  const second: string = (Math.floor(ms / 1000) % 60).toString();
  let text: string = '';

  text += hour.padStart(2, '0') + 'h';
  text += ' ' + minute.toString().padStart(2, '0') + 'm';
  text += ' ' + second.toString().padStart(2, '0') + 's';

  return text;
};
