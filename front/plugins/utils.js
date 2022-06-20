const defaultTwitterShareTitle = 'NeosVR Photo';

const isOverTextWidth = (text, maxWidth = 500) => {
  if (!text || maxWidth <= 0) return false;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '20px "Segoe UI", Meiryo, system-ui';
    const { width } = ctx.measureText(text);
    return width >= maxWidth;
  } catch {
    // empty
  }
  return true;
}

const openTwitterShare = (params) => {
  const { type, id, pageUrl, title, name } = params;
  if (!type || !id) {
    console.error('openTwitterShare() - Argument is required: type, id');
    return;
  }
  let shareTitle, shareLink;
  switch(type) {
    case 'modal':
      shareTitle = isOverTextWidth(title+name) ?
        title || `Uploaded by ${name}`
        :`${title} Uploaded by ${name}`;
      shareLink = pageUrl || `https://photo.neos.love/?modal=${id}`;
      break;
    case 'moment':
    default:
      shareTitle = title ?
        `${title} ${name}'s Moment`
        : `${name}'s Moment`;
      shareLink = pageUrl || `https://photo.neos.love/moment/${id}`;
  }
  if (!title && !name) {
    shareTitle = defaultTwitterShareTitle;
  }
  const url = 'https://twitter.com/intent/tweet'
            + `?text=${encodeURIComponent(shareTitle)}`
            + `&url=${encodeURI(shareLink)}`
            + '&hashtags=NeosFrames';
  try {
    window.open(url, '_blank');
  } catch (e) {
    // empty
  }
}

export default (context, inject) => {
  inject('openTwitterShare', openTwitterShare);
}
