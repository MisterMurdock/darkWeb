class Article {
    constructor(title, content, author, date) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.comments = [];
      this.images = [];
      this.likes = 0;
      this.dislikes = 0;
    };
  
      addComment(comment) {
          this.comments.push(comment);
      };
      addImage(image) {
          this.images.push(image);
      };
      addLike() {
          this.likes++;
      };
      addDislike() {
          this.dislikes++;
      };
      getComments() {
          return this.comments;
      };
      getImages() {
          return this.images;
      };
  }
  
export function encodeImg(imgInput) {
    // Convert image to Base64 string
    const base64Img = imgInput.toString('base64');
    return base64Img;
  };
export function decodeImg(base64Img) {
    // Convert Base64 string back to image
    const imgBuffer = Buffer.from(base64Img, 'base64');
    return imgBuffer;
  }