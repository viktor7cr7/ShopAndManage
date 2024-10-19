function getScrollWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.visibility = 'hidden';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  document.body.appendChild(scrollDiv);

  const scrollWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);

  return scrollWidth;
}

export default getScrollWidth;
