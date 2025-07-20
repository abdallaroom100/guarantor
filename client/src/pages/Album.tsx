


const images = [
  { image: "/img/q3wan1.jpg", text: "" },
  { image: "/img/q3wan2.jpg", text: "" },
  { image: "/img/q3wan3.jpg", text: "" },
  // ... باقي الصور
];

function preloadImages(imageList: { image: string,text:string }[]) {
  return Promise.all(
    imageList.map(({ image }) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = image;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

const Album = () => {



  return (
    <div>
    
    </div>
  );
};

export default Album;