/*
For the input of your function, you will be given one sentence.
You have to return a corrected version,
that starts with a capital letter and ends with a period (dot).

Example:

input (string): "hey, friend"
output (string): "Hey, friend."

Updated first 'h' to 'H', added '.'.

More examples:

correctSentence("greetings, friends") == "Greetings, friends."
correctSentence("Greetings, friends") == "Greetings, friends."
correctSentence("Greetings, friends.") == "Greetings, friends."
 */

export default function correctSentence(text) {
  if(text === '') return text;

  if(text.slice(-1) != '.') {
    text += '.';
  }
  let upper = text[0].toUpperCase();

  if(text[0] != upper) {
    text = upper + text.substring(1);
  }

  
  
  return text;
}
