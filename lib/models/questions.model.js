const fs = require("fs");

const path = `${__dirname}/../../data/questions.json`;

class QuestionModel {
  getQuestions() {
    const questions = fs.readFileSync(path, "utf8");
    return JSON.parse(questions);
  }

  createQuestion(questions) {
    fs.writeFileSync(path, JSON.stringify(questions), (err, data) => {
      if (err) return err;
      return data;
    });
  }
}

module.exports = new QuestionModel();
