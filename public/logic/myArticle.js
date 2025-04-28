const moment = require('moment');

class MyArticle {
    constructor(title, content, author) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = moment().format('MMMM Do YYYY'); // Date of creation
      this.comments = [];
      this.images = [];
      this.likes = 0;
      this.dislikes = 0;
    }
  
    addComment(comment) {
        this.comments.push(comment);
    }
    addImage(image) {
        this.images.push(image);
    }
    addLike() {
        this.likes++;
    }
    addDislike() {
        this.dislikes++;
    }
    getComments() {
        return this.comments;
    }
    getImages() {
        return this.images;
    }
    getAllValues() {
      return {
        title: this.title,
        content: this.content,
        date: this.date,
        author: this.author,
        comments: this.comments,
        images: this.images,
        likes: this.likes,
        dislikes: this.dislikes
      };
    }
}

function encodeImg(imgInput) {
    // Convert image to Base64 string
    const base64Img = imgInput.toString('base64');
    return base64Img;
}

function decodeImg(base64Img) {
    // Convert Base64 string back to image
    const imgBuffer = Buffer.from(base64Img, 'base64');
    return imgBuffer;
}

module.exports = { MyArticle, encodeImg, decodeImg };