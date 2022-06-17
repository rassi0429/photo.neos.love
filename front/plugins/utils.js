const defaultTwitterShareTitle = 'NeosVR Photo';

const getIsDefaultTitle = (title) => {
  const regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  return RegExp(regex).test(title);
}

const openTwitterShare = (params) => {
  const { type, id, pageUrl, title, name } = params;
  if (!type || !id) {
    console.error('openTwitterShare() - Argument is required: type, id');
    return;
  }
  let shareTitle, shareLink;
  const isDefaultTitle = getIsDefaultTitle(title);
  switch(type) {
    case 'modal':
      shareTitle = isDefaultTitle ?
        `${title} Uploaded by ${name}`
        : title || `Uploaded by ${name}`;
      shareLink = pageUrl || `https://photo.neos.love/?modal=${id}`;
      break;
    case 'moment':
    default:
      shareTitle = title ?
        `${name}'s Moment - ${title}`
        : `${name}'s Moment`;
      shareLink = pageUrl || `https://photo.neos.love/moment/${id}`;
  }
  if (!title && !name) {
    shareTitle = defaultTwitterShareTitle;
  }
  const url = 'https://twitter.com/share'
            + `?text=${encodeURI(shareTitle+'\n')}`
            + `&url=${shareLink}`
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
