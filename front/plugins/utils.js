const baseUrl = 'https://photo.neos.love';
const defaultTwitterShareTitle = 'NeosVR Photo';

const fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

const formatHashtag = (text) => {
  if (!isNaN(text)) return '';
  return text.replaceAll(/[! -/:-@[-`{-~]/g, '_');
}

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
  if (!type || !id || (type==='tag' && !name)) {
    console.error('openTwitterShare() - Argument Error');
    return;
  }
  let shareTitle, shareLink;
  let shareTag = '';
  switch(type) {
    case 'modal':
      shareTitle = isOverTextWidth(title+name) ?
        title || `Uploaded by ${name}` : `${title} Uploaded by ${name}`;
      shareLink = pageUrl || `${baseUrl}/?modal=${id}`;
      break;
    case 'moment':
      shareTitle = title ? `${title} ${name}'s Moment` : `${name}'s Moment`;
      shareLink = pageUrl || `${baseUrl}/moment/${id}`;
      break;
    case 'tag':
      default:
        shareTitle = `Tag: ${name}`;
        shareLink = `${baseUrl}/tag/${fixedEncodeURIComponent(name)}`;
        shareTag = `,${formatHashtag(name)}`;
  }
  if (!title && !name) {
    shareTitle = defaultTwitterShareTitle;
  }
  const url = 'https://twitter.com/intent/tweet'
            + `?text=${encodeURIComponent(shareTitle)}`
            + `&url=${encodeURI(shareLink)}`
            + `&hashtags=NeosFrames${encodeURIComponent(shareTag)}`;
  try {
    window.open(url, '_blank');
  } catch (e) {
    // empty
  }
}

export default (context, inject) => {
  inject('openTwitterShare', openTwitterShare);
}
