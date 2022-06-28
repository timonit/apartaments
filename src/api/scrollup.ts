export const scrollupbtn = document.querySelector('#scrollup') as HTMLDivElement;
const docElement = document.documentElement;
function up() {
  docElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

document.addEventListener('scroll', () => {
  const pos = docElement.scrollTop;
  console.log(pos);
  if (pos < 200) { 
    scrollupbtn.style.display = 'none';
  } else {
    if (scrollupbtn.style.display === 'none') scrollupbtn.style.display = 'block';
  }
});

scrollupbtn.addEventListener('click', up);
