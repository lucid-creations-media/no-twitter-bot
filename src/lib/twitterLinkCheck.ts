// Global regex used to detect Twitter and X links.
const twitterRegex = /(x\.com|twitter\.com)/gi;

/**
 * This function will check if a url matches Twitter/X services links using regex.
 *
 * @param linkUrl representing a suspected blacklisted url
 * @return flag
 */
const twitterLinkCheck = (linkUrl: string): boolean => {
  let flag = false;

  if (linkUrl.match(twitterRegex)) {
    flag = true;
  }

  return flag;
};

export { twitterRegex };
export default twitterLinkCheck;
