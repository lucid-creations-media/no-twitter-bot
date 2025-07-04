// Global regex used to detect all meta services.
const metaRegex =
  /(facebook\.com|meta\.com|instagram\.com|threads\.net|whatsapp\.com)/gi;

/**
 * This function will check if a url matches Meta services links using regex.
 *
 * @param linkUrl representing a suspected blacklisted url
 * @returns flag
 */
const metaLinkCheck = (linkUrl: string): boolean => {
  let flag = false;

  if (linkUrl.match(metaRegex)) {
    flag = true;
  }

  return flag;
};

export { metaRegex };
export default metaLinkCheck;
